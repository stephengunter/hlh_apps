<script setup>
import { reactive, ref } from 'vue'

import { deepClone } from '@/utils'

const initialState = {
	active: false,
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
	if (model) {
		state.date.model = deepClone(model)
		state.date.value = model.text
	} else {
		state.date = deepClone(initialState.date)
	}

}
</script>

<template>
	<div>
		<v-row>
			<v-col cols="6">
				<!-- <v-menu :close-on-content-click="false" v-model="state.active">
					<template v-slot:activator="{ props }">
						<v-text-field label="日期" readonly v-bind="props" clearable />
					</template>
					<CommonPickerRocWrapper />
				</v-menu> -->

			</v-col>
			<v-col cols="6">
				
			
			</v-col>
		</v-row>
		<v-row>

		</v-row>
		<!-- <v-dialog persistent v-model="state.datePicker.active" :width="WIDTH.S + 50">
			<v-card style="padding-right: 100px;" v-if="state.datePicker.active" :max-width="WIDTH.S">
				<CommonCardTitle :title="state.datePicker.title" @cancel="selectDate" />
				<v-card-text>
					<v-row>
						<v-col cols="6">
							<CommonPickerRocDate :clearable="true" label="起始日" :upper_limit="state.datePicker.upper_limit"
								:error_message="state.datePicker.dates[0].error_message" :value="state.datePicker.dates[0].value"
								@selected="(model) => onDateSelected(0, model)" />
						</v-col>
						<v-col cols="6">
							<CommonPickerRocDate :clearable="true" label="截止日" :lower_limit="state.datePicker.lower_limit"
								:error_message="state.datePicker.dates[1].error_message" :value="state.datePicker.dates[1].value"
								@selected="(model) => onDateSelected(1, model)" />
						</v-col>
						<v-col cols="6">
						</v-col>
					</v-row>
					<v-row dense>
						<v-col cols="12">
							<v-btn @click.prevent="onRangeSelected" color="success" :disabled="has_error">
								確定
							</v-btn>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-dialog> -->

	</div>
</template>