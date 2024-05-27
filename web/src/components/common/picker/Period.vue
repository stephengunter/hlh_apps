<script setup>
import { reactive, computed, onBeforeMount, } from 'vue'
import { deepClone } from '@/utils'
import { VALIDATE_MESSAGES } from '@/consts'
import Errors from '@/common/errors'
import date from '@/plugins/date'

const dateAapter = new date.adapter({ locale: date.locale.zhTW })

const name = 'CommonPickerPeriod'
const props = defineProps({
   roc: {
      type: Boolean,
		default: false
	},
	values: {
		type: Array,
		default: () => ['', '']
	},
	labels: {
		type: Array,
		default: () => ['開始日期', '結束日期']
	},
	required_start: {
		type: Boolean,
		default: false
	},
	required_end: {
		type: Boolean,
		default: false
	},
	allow_same: {
		type: Boolean,
		default: true
	}
})
const emit = defineEmits(['selected'])
defineExpose({
   getDates
})

const initialState = {
	dates: [null, null],
	roc_models: [null, null],
	start: '',
	end: '',
	errors: new Errors()
}

const state = reactive(deepClone(initialState))
const lower_limit  = computed(() => {
	if(!state.dates[0]) return null
	return state.dates[0]
})
const upper_limit  = computed(() => {
	if(!state.dates[1]) return null
	return state.dates[1]
})


onBeforeMount(init)

function init() {
	state.start = props.values[0]
	state.end = props.values[1]
}

function onDateSelected(index, model, selected = true) {	
	if(props.roc) {
		state.dates[index] = model.date
		state.roc_models[index] = model.model
		//model: {date, model: {text, text_cn, num}}
		if(index) state.end = model.model.text
		else state.start = model.model.text
	}else {
		state.dates[index] = model.model
		//model: {model , text}
		if(index) state.end = model.text
		else state.start = model.text
	}
	
	if(selected) {
		if(checkErrors()) {
			emit('selected', getDates())
		} 
	}
	
}

function checkErr(date) {
	if(date) {
		if(lower_limit.value) {
			if(dateAapter.isBefore(date, lower_limit.value)) return 'lower_limit'
			if(dateAapter.isEqual(date, lower_limit.value) && !props.allow_same) return 'lower_limit'
		}
		if(upper_limit.value) {
			if(dateAapter.isAfter(date, upper_limit.value)) return 'upper_limit'
			if(dateAapter.isEqual(date, upper_limit.value) && !props.allow_same) return 'upper_limit'
		}
	}
	return ''
}

function checkErrors() {
	state.errors = new Errors()
	if(props.required_start) {
		if(!state.start) state.errors.set('start', [`${VALIDATE_MESSAGES.REQUIRED(props.labels[0])}`])
	}
	if(props.required_end && !state.end) {
		state.errors.set('end', [`${VALIDATE_MESSAGES.REQUIRED(props.labels[0])}`])
	}

	const startDate = state.dates[0]
	const err = checkErr(startDate)
	if(err) {
		state.errors.set('start', [err])
	}
	const endDate = state.dates[1]
	const errEnd = checkErr(endDate)
	if(errEnd) {
		state.errors.set('end', [errEnd])
	}
	return !state.errors.any()
}

function getDates() {
	const roc = props.roc
	return state.dates.map((date, index) => {
		const text = index === 0 ? state.start : state.end
		if(roc) {
			const roc_model = state.roc_models[index]
			let text_cn = ''
			let num = ''
			if(roc_model) {
				text_cn = roc_model.text_cn
				num = roc_model.num
			}
			
			return {
				date,
				text,
				text_cn,
				num			
			}
		}

		return { date, text }
	})
}
</script>

<template>
	<v-row dense v-if="props.roc">
		<v-col cols="6">
			<CommonPickerRocDate 
			:value="state.start" :label="labels[0]"
			:upper_limit="upper_limit" :clearable="!required_start"
			:error_message="state.errors.get('start')"
			@ready="(model) => onDateSelected(0, model, false)"
			@selected="(model) => onDateSelected(0, model)"
			/>
		</v-col>
		<v-col cols="6">
			<CommonPickerRocDate
			:value="state.end" :label="labels[1]"
			:lower_limit="lower_limit" :clearable="!required_start"
			:error_message="state.errors.get('end')"
			@ready="(model) => onDateSelected(1, model, false)"
			@selected="(model) => onDateSelected(1, model)"
			/>
		</v-col>
	</v-row>
	<v-row dense v-else>

		<v-col cols="6">
			<CommonPickerDate 
			:value="state.start" :label="labels[0]"
			:upper_limit="upper_limit" :clearable="!required_start"
			:error_message="state.errors.get('start')"
			@ready="(model) => onDateSelected(0, model, false)"
			@selected="(model) => onDateSelected(0, model)"
			/>
		</v-col>
		<v-col cols="6">
			<CommonPickerDate 
			:value="state.end" :label="labels[1]"
			:lower_limit="lower_limit" :clearable="!required_start"
			:error_message="state.errors.get('end')"
			@ready="(model) => onDateSelected(1, model, false)"
			@selected="(model) => onDateSelected(1, model)"
			/>
		</v-col>
	</v-row>
</template>