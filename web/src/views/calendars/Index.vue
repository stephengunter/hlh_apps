<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
//import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zh_tw from '@fullcalendar/core/locales/zh-tw'

import { FETCH_CALENDARS, FETCH_EVENTS, CREATE_EVENT, STORE_EVENT, EVENT_DETAILS, UPDATE_EVENT } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import FullEvent from '@/models/fullEvent'
import { isEmptyObject, deepClone , isSameDay, initByDate,
	 onErrors, onSuccess, setValues, is400, dateToText, toYearTW,
} from '@/utils'
import { WIDTH, ROUTE_NAMES, CALENDAR_TYPES, ACTION_TYPES, ENTITY_TYPES } from '@/consts'

import date from '@/plugins/date'


const name = 'CalendarIndexView'
const EVENT = ENTITY_TYPES.EVENT
const store = useStore()
const route = useRoute()
const router = useRouter()
const dateAdapter = new date.adapter({ locale: date.locale.zhTW })

const head = ref(null)
const full_calendar = ref(null)


const initialState = {
   date: [new Date()],
	viewMode: 'month',
	current_date: null,
	selected_dates: [],
	range: [],
	options: {
		plugins: [dayGridPlugin, interactionPlugin],
		locale: zh_tw,
		headerToolbar: false,
		initialView: 'dayGridMonth',
		editable: true,
      selectable: true,
        //selectMirror: true,
       // dayMaxEvents: true,
      weekends: true,
   	select: onDatesSelected,
        
		// dateClick: (model) => {
		// 	console.log('date', model.date)
		// },
		eventClick: (info) => {
			const event = info.event
			details(event.id)
			// alert('Event: ' + info.event.title);
			// alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
			// alert('View: ' + info.view.type);
		},
		events: [],
		eventTimeFormat: { 
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		}
	},
	form: {
		title: '',
		active: false,
		type: 'all',
		model: {},
		action: ''
	}
}

const state = reactive(deepClone(initialState))

const calendars = computed(() => store.state.calendars.list)
const labels = computed(() => store.state.events.labels)
const fullCalendarApi = computed(() => {
	if(full_calendar.value) return full_calendar.value.getApi()
	return null
})

watch(route, init)

onMounted(init)


function init() {
	
	if(calendars.value.length) head.value.init()
	else fetchCalendars()
}
function fetchCalendars() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_CALENDARS)
	.then(() => nextTick(init))
	.catch(error => onErrors(error))
}
function onParamsChanged(params) {
	const calendar = params.calendar
	const year = params.year + 1911
	const month = params.month - 1
	const firstDay = new Date(year, month, 1)
	const lastDay = new Date(year, month + 1, 0)

	fetchEvents({ calendar, firstDay, lastDay })
}
function fetchEvents({ calendar, firstDay, lastDay }) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_EVENTS, { calendar, start: dateToText(firstDay), end: dateToText(lastDay) })
	.then((list) => {
		if(state.viewMode === 'month') {
			const today = dateAdapter.date()
			if(today.getMonth() === firstDay.getMonth()) {
				state.current_date = today
			}else {
				const currentDate = fullCalendarApi.value.currentData.currentDate
				const month = currentDate.getMonth()

				if(month === firstDay.getMonth()) {
					state.current_date = currentDate
				}else {
					state.current_date = firstDay
				}
			}
			fullCalendarApi.value.gotoDate(state.current_date)
		}
		state.options.events = list.map(model => new FullEvent(model))
	})
	.catch(error => onErrors(error))
}
function onOptionChanged({ key, val }) {
	if(key === 'view_mode') {
		state.viewMode = val
		if(val === 'week') {
			fullCalendarApi.value.changeView('dayGridWeek')
			nextTick(getWeekData)
		}else {
			fullCalendarApi.value.changeView('dayGridMonth')
			nextTick(() => {
				const params = head.value.getParams()
				const currentData = fullCalendarApi.value.currentData
				const dateProfile = currentData.dateProfile
				const currentRange = dateProfile.currentRange

				const firstDay = currentRange.start
				const calendar = params.calendar
				const year = toYearTW(firstDay.getFullYear())
				const month = firstDay.getMonth() + 1
				head.value.setParams({ calendar, year, month })
			})
		}
	}
	
}
function next() {
	if(state.viewMode === 'week') {
		fullCalendarApi.value.next()
		nextTick(getWeekData)
	}
}
function prev() {
	if(state.viewMode === 'week') {
		fullCalendarApi.value.prev()
		nextTick(getWeekData)
	}
}
function getWeekData() {
	if(state.viewMode === 'week') {
		const calendar = head.value.getParams().calendar

		const currentData = fullCalendarApi.value.currentData
		const dateProfile = currentData.dateProfile
		const currentRange = dateProfile.currentRange

		const firstDay = currentRange.start
		const lastDay = dateAdapter.addDays(currentRange.end, -1)
		fetchEvents({ calendar, firstDay, lastDay }) 

		head.value.setRange({ firstDay, lastDay })
		state.current_date = currentData.currentDate
	}
}
function onDatesSelected(model) {
	const end = dateAdapter.addDays(model.end, -1)
	const same = isSameDay(model.start, end)
	if(same) state.selected_dates = [model.start]
	else state.selected_dates = [model.start, end]
}
function create(calendar_key) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_EVENT, { calendar: calendar_key})
	.then(model => {
		state.form.model = deepClone(model)

		const calendar = head.value.getSelectedCalendar()
		state.form.model.calendarIds = [calendar.id]

		if(state.selected_dates.length) {
			state.form.model.startDate = state.selected_dates[0]
			if(state.selected_dates.length > 1) {
				state.form.model.endDate = state.selected_dates[1]
			}
			state.form.model.allDay = true
		}else {
			state.form.model.startDate = initByDate(state.current_date, 10)
			state.form.model.endDate = initByDate(state.current_date, 11)
			state.form.model.allDay = false
		}
		
		state.form.type = calendar_key
		state.form.active = true
		state.form.title = `${ACTION_TYPES.CREATE['title']}${EVENT.title}`
		state.form.action = UPDATE_EVENT
	})
	.catch(error => onErrors(error))
}
function details(id) {
	store.dispatch(EVENT_DETAILS, id)
	.then(model => {
		state.form.model = model
		state.form.active = true
		state.form.title = ``
		state.form.action = EVENT_DETAILS
	})
	.catch(error => onErrors(error))
}
function edit(id) {
	console.log('edit', id)
}
function onSubmit(form) {
	setValues(form, state.form.model)
	console.log('model', state.form.model)
return
	store.commit(CLEAR_ERRORS)
	store.dispatch(STORE_EVENT, state.form.model)
	.then(onEventUpdated)
	.catch(error => onErrors(error))
}
function onEventUpdated() {
	if(state.viewMode === 'week') getWeekData()
	else onParamsChanged(head.value.getParams()) 

	state.form = deepClone(initialState.form)
}
function onRemove() {
	const id = state.form.model.id
	console.log('onRemove', id)
}

function onCancel() {
	state.form = { ...initialState.form }
}

</script>

<template>
   <CalendarHead ref="head" 
	:current_date="state.current_date"
	:calendars="calendars" 
	@option_changed="onOptionChanged"
	@next="next" @prev="prev"
	@submit="onParamsChanged" @add="create"
	/>
	<v-row class="mt-1">
		<v-col cols="12">
			<FullCalendar ref="full_calendar" 
			:options='state.options' 
			/>
		</v-col>
   </v-row>
	<v-dialog persistent v-model="state.form.active" :width="WIDTH.L + 50">
		<v-card v-if="state.form.active" :max-width="WIDTH.L">
			<CommonCardTitle :title="state.form.title" 
			@cancel="onCancel"  
			/>
			<v-card-text>
				<EventView v-if="state.form.action === EVENT_DETAILS" :labels="labels"
				:model="state.form.model" :calendars="calendars"
				@edit="edit"
				/>
				<EventForm v-else :type="state.form.type" :labels="labels"
				:model="state.form.model" :calendars="calendars"
				@submit="onSubmit"  @remove="onRemove"
				/>
				
			</v-card-text>
		</v-card>
	</v-dialog>
</template>