<script setup>
import { reactive, ref } from 'vue'

import { deepClone } from '@/utils'

const initialState = {
	date: {
		value: '',
		model: {
			text: '',
			text_cn: '',
			num: 0
		},
		error_message: ''
	}
}
const state = reactive(deepClone(initialState))

function onDateSelected(model) {
	if(model) {
		state.date.model = deepClone(model)
		state.date.value = model.text
	}else {
		state.date = deepClone(initialState.date)
	}
	
}
</script>

<template>
	<div>
		<v-row>
			<v-col cols="2">
				<CommonPickerRocDate :error_message="state.err"
				:value="state.date.value"
				@selected="onDateSelected"
				/>
			</v-col>
			<v-col cols="10">

			</v-col>
			<v-col cols="6">
				
			</v-col>
			<v-col cols="6">
			</v-col>
		</v-row>
		
	</div>
 </template>