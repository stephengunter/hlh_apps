<script setup>
import { reactive, ref } from 'vue'

import { deepClone } from '@/utils'

const initialState = {
	date: {
		model: null,
		text: ''
	}
}
const state = reactive(deepClone(initialState))

</script>

<template>
	<div>
		<v-row>
			<v-col cols="2">
				<CommonPickerRocDate 
				:value="state.date.text"
				/>
			</v-col>
			<v-col cols="12">
			</v-col>
		</v-row>
		
	</div>
 </template>