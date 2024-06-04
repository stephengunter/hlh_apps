<script setup>
import { reactive, ref, computed, onBeforeMount } from 'vue'
import zh_tw from '@fullcalendar/core/locales/zh-tw'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { deepClone, dateToText, textToDate, now } from '@/utils'

import { VALIDATE_MESSAGES } from '@/consts'
import Errors from '@/common/errors'
import date from '@/plugins/date'
const dateAdapter = new date.adapter({ locale: date.locale.zhTW })
const calendar = ref(null)

const initialState = {
	date: {
		roc: false,
		date: null,
		value: '',
		model: {}
	},
	calendarOptions: {
		plugins: [dayGridPlugin, interactionPlugin],
		locale: zh_tw,
		initialView: 'dayGridMonth',
		weekends: true,
		dateClick: (val) => {
			console.log('dateclick', val)
		},
		events: [
			{ title: 'event 1', date: '2024-04-01' },
			{ title: 'event 2', date: '2024-04-02' }
		]
	},
	
	errors: new Errors()
}

const state = reactive(deepClone(initialState))

const hours_allow = computed(() => [...Array(24).keys()].filter(num => num >= 6 && num <= 22))
const minutes_allow = computed(() => [...Array(60).keys()].filter(num => num % 5 === 0))

onBeforeMount(() => {
	console.log('year', dateAdapter.getYear(now()))
})
function onDateSelected({ date, model }, selected = true) {	
	state.date.date = date
	state.date.value = state.date.roc ? model.text_cn : model.text
	state.date.model = deepClone(model)

	console.log(state.date)
}
</script>

<template>
	<div>
		<v-row>
			<v-col cols="12">
				<FullCalendar ref="calendar" 
				:options='state.calendarOptions' 
				/>
			</v-col>
		</v-row>

	</div>
</template>