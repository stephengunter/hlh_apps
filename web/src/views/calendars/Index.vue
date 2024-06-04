<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import zh_tw from '@fullcalendar/core/locales/zh-tw'

import { FETCH_CALENDARS, FETCH_EVENTS } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, dateToRocFormat,
	 onErrors, onSuccess, setValues, is400, 
	resolveErrorData, isNumeric, textToDate,
	buildQuery, bytesToBinary, getMimeType, showModifyRecords
} from '@/utils'
import { WIDTH, ROUTE_NAMES, VALIDATE_MESSAGES, ACTION_TYPES, ENTITY_TYPES } from '@/consts'

import date from '@/plugins/date'


const name = 'CalendarIndexView'
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
	options: {
		plugins: [dayGridPlugin, interactionPlugin],
		locale: zh_tw,
		//headerToolbar: false,
		initialView: 'dayGridMonth',
		weekends: true,
		dateClick: (val) => {
			console.log('dateclick', val)
		},
		events: [
			{ title: 'event 1', date: '2024-06-01' },
			{ title: 'event 2', date: '2024-06-12' }
		]
	},
	
	events: [{
		title: 'test title',
		start: new Date(2024, 5, 17, 10, 0, 0),
		end: new Date(2024, 5, 17, 11, 30, 0),
		color: 'deep-purple',
		allDay: false,
	}]
}

const state = reactive(deepClone(initialState))

const calendars = computed(() => store.state.calendars.list)
const labels = computed(() => store.state.calendars.labels)
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
function fetchEvents(params) {
	console.log('fetchEvents', params)
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_EVENTS, params)
	.then(() => {
		if(state.viewMode === 'month') {
			const startDate = textToDate(params.start)
			state.current_date = startDate
			fullCalendarApi.value.gotoDate(startDate)
		}
		// let patter = `${params.year}-${params.month}-1`
		// const date = dateAdapter.date(patter)
		// 
		// fullCalendarApi.value.gotoDate(date)		
	})
	.catch(error => onErrors(error))
}
function onOptionChanged({ key, val }) {
	if(key === 'view_mode') {
		state.viewMode = val
		if(val === 'week') {
			
		}
		// if(val === 'week') {
		// 	fullCalendarApi.value.changeView('dayGridWeek')
		// }else {
		// 	fullCalendarApi.value.changeView('dayGridMonth')
		// }
	}
	nextTick(getCurrentData)
}
function next() {
	fullCalendarApi.value.next()
	nextTick(getCurrentData)
}
function prev() {
	fullCalendarApi.value.prev()
	nextTick(getCurrentData)
}
function setWeekTitle(dateProfile) {
	if(dateProfile) {
		const start = dateProfile.currentRange.start
		const end = dateProfile.currentRange.end
		state.week_title = `${dateToRocFormat(start)} - ${end.getDate()}日` 
	}
	else state.week_title = ''
}
function getCurrentData() {
	const currentData = fullCalendarApi.value.currentData
	console.log('currentData', currentData)
	if(state.viewMode === 'week') {
		const dateProfile = fullCalendarApi.value.currentData.dateProfile
		setWeekTitle(dateProfile)

		const currentDate = currentData.currentDate
		console.log('currentDate', currentDate)
	}
	
	
}
function gotoDate() {
	fullCalendarApi.value.gotoDate( new Date(2024, 3, 17) )
	nextTick(() => console.log(fullCalendarApi.value.currentData))
} 

</script>

<template>
   <CalendarHead ref="head" 
	:current_date="state.current_date" :week_title="state.week_title"
	:calendars="calendars" :labels="labels" 
	@option_changed="onOptionChanged"
	@next="next" @prev="prev"
	@submit="fetchEvents" 
	/>
	<v-row dense>
		<v-col cols="3">
			<a href="#" @click.prevent="gotoDate">0317</a>	
		</v-col>
		<v-col cols="9">
		</v-col>
	</v-row>
	<v-row>
		<v-col cols="12">
			<FullCalendar ref="full_calendar" 
			:options='state.options' 
			/>
		</v-col>
   </v-row>
</template>