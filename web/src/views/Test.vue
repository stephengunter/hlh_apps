<script setup>
import { reactive, ref, computed, onBeforeMount } from 'vue'
import { deepClone, dateToText, textToDate, now } from '@/utils'

import { VALIDATE_MESSAGES } from '@/consts'
import Errors from '@/common/errors'
import date from '@/plugins/date'
const dateAdapter = new date.adapter({ locale: date.locale.zhTW })


const initialState = {
	range: {
		roc: true,
		dates: [],
      values: [],
		models: {},
		hours_allow: [],
		minutes_allow: []
	},
	
	errors: new Errors()
}
const  period_picker = ref(null)
const state = reactive(deepClone(initialState))

onBeforeMount(() => {
	state.range.hours_allow = [...Array(24).keys()].filter(num => num >= 6 && num <= 22)
	state.range.minutes_allow = [...Array(60).keys()].filter(num => num % 5 === 0)
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
		{{state.range.hours_allow}}
		<v-row>
			<v-col cols="12">
				<CommonPickerPeriod ref="period_picker" 
				:roc="true" :allow_same="false" minimum_view="time"
				:hours_allow="state.range.hours_allow" :minutes_allow="state.range.minutes_allow"
				:required_start="true" :required_end="true" 
				:dates="state.range.dates" 
				@selected="(dates) => console.log(dates)"
				/>
			</v-col>
		</v-row>

	</div>
</template>