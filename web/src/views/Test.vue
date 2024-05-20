<script setup>
<<<<<<< Updated upstream
import { reactive, ref } from 'vue'

import { deepClone } from '@/utils'

const initialState = {
	date: {
		model: null,
		text: ''
	}
=======
import { reactive } from 'vue'
import { DIALOG_MAX_WIDTH } from '@/config'
import { resolveErrorData, onErrors, onWarning, deepClone } from '@/utils'

const initialState = reactive({
	startDate: {
		val: ''
	}
})
  
const state = reactive(deepClone(initialState))
function image(val) {
	onErrors()
	//data.image.active = val
>>>>>>> Stashed changes
}
const state = reactive(deepClone(initialState))

<<<<<<< Updated upstream
=======
function onStartDateChanged(model) {
	console.log(model)
	//image(false)
}
>>>>>>> Stashed changes
</script>

<template>
	<div>
		<v-row>
<<<<<<< Updated upstream
			<v-col cols="2">
				<CommonPickerRocDate 
				:value="state.date.text"
				/>
			</v-col>
			<v-col cols="12">
=======
			<v-col cols="6">
				<v-locale-provider locale="zhTW">
					<v-date-picker  color="primary" :hide-header="true" header=""
					:day-format="(date) => new Date(date).getDate()"
					/>
				</v-locale-provider>
			</v-col>
			<v-col cols="6">
				
>>>>>>> Stashed changes
			</v-col>
		</v-row>
		
	</div>
 </template>