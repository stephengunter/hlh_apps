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

import { FETCH_CALENDARS, FETCH_EVENTS, CREATE_EVENT, UPDATE_EVENT } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import FullEvent from '@/models/fullEvent'
import { isEmptyObject, deepClone ,
	 onErrors, onSuccess, setValues, is400, dateToText, toYearTW,
} from '@/utils'
import { WIDTH, ROUTE_NAMES, VALIDATE_MESSAGES, ACTION_TYPES, ENTITY_TYPES } from '@/consts'

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
	week_title: '',
	current_date: null,
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
      //   select: (val) => {
		// 	console.log('select', val)
		// },
        
		dateClick: (model) => {
			console.log('date', model.date)
		},
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
			state.current_date = firstDay
			fullCalendarApi.value.gotoDate(firstDay)
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
function create() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_EVENT)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.active = true
		state.form.title = `${ACTION_TYPES.CREATE['title']}${EVENT.title}`
		state.form.action = UPDATE_EVENT
	})
	.catch(error => onErrors(error))
}
function details(id) {
	console.log('details', id)
}
function onSubmit(form) {
	setValues(form, state.form.model)
	console.log('onSubmit', form)
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
				<EventForm :labels="labels"
				:model="state.form.model" 
				@submit="onSubmit"  @remove="onRemove"
				/>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>