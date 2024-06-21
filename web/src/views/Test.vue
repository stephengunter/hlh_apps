<script setup>
import { reactive, ref, computed, onBeforeMount } from 'vue'
import { deepClone, dateToText, textToDate, now, datetimeText } from '@/utils'

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
	
})
function onDateSelected({ date, model }, selected = true) {	
	
}
function create() {
	console.log('create')
}
</script>

<template>
	<div>
		<v-row>
			<v-col cols="12">
				<CommonButtonRemove
				/>
			</v-col>
		</v-row>

	</div>
</template>