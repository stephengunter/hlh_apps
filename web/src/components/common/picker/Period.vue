<script setup>
import { reactive, computed, onBeforeMount, } from 'vue'
import { deepClone, getDatePickerModel, getTimeString } from '@/utils'
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
	minimum_view: {
      type: String,
		default: 'day'
	},
	values: {
		type: Array,
		default: () => ['', '']
	},
	dates: {
		type: Array,
		default: () => [null, null]
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
	},
	hours_allow: {
		type: Array,
		default: () => []
	},
	minutes_allow: {
		type: Array,
		default: () => []
	},
})
const emit = defineEmits(['selected'])
defineExpose({
   getDates
})

const initialState = {
	dates: [null, null],
	values: ['', ''],
	models: [null, null],
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
	state.dates = props.dates.slice(0)
	
	state.values = props.values.slice(0)
	state.models = props.dates.map(date => getDatePickerModel(date, props.roc))	
}

function onDateSelected(index, { date, model}, selected = true) {	
	
	state.dates[index] = date
	state.models[index] = model
	if(props.minimum_view === 'time') {
		if(date) {
			const time = getTimeString(date)
			const dateStr = props.roc ? model.text_cn : model.text
			state.values[index] = `${dateStr}   ${time}`
		}
		else state.values[index] = props.roc ? model.text_cn : model.text
	}else {
		state.values[index] = props.roc ? model.text_cn : model.text
	}
	
	
	if(selected) {
		if(checkErrors()) {
			emit('selected', getDates())
		} 
	}
	
}

function checkErr(date, index) {
	if(date) {
		if(index < 1) {
			if(upper_limit.value) {
				if(dateAapter.isAfter(date, upper_limit.value)) return 'upper_limit'
				if(dateAapter.isEqual(date, upper_limit.value) && !props.allow_same) return 'upper_limit'
			}
		}else {
			if(lower_limit.value) {
				if(dateAapter.isBefore(date, lower_limit.value)) return 'lower_limit'
				if(dateAapter.isEqual(date, lower_limit.value) && !props.allow_same) return 'lower_limit'
			}
		}
	}
	return ''
}

function checkErrors() {
	state.errors = new Errors()
	if(props.required_start) {
		if(state.dates[0]) state.errors.clear('start')
		else state.errors.set('start', [`${VALIDATE_MESSAGES.REQUIRED(props.labels[0])}`]) 
	}
	if(props.required_end) {
		if(state.dates[1]) state.errors.clear('end')
		else state.errors.set('end', [`${VALIDATE_MESSAGES.REQUIRED(props.labels[0])}`])
		
	}

	const startDate = state.dates[0]
	const err = checkErr(startDate, 0)
	if(err) {
		state.errors.set('start', [`錯誤的${props.labels[0]}`])
	}
	const endDate = state.dates[1]
	const errEnd = checkErr(endDate, 1)
	if(errEnd) {
		state.errors.set('start', [`錯誤的${props.labels[1]}`])
	}
	return !state.errors.any()
}

function getDates() {
	return state.dates.map((date, index) => ({date, model: state.models[index]}))
}
</script>

<template>
	<v-row dense>
		<v-col cols="6">
			<CommonPickerRocDate :roc="roc" :label="labels[0]"
			:date="state.dates[0]" :value="state.values[0]" 
			:minimum_view="minimum_view" 
			:minutes_allow="minutes_allow" :hours_allow="hours_allow"
			:upper_limit="upper_limit" :clearable="!required_start"
			:error_message="state.errors.get('start')"
			@ready="(model) => onDateSelected(0, model, false)"
			@selected="(model) => onDateSelected(0, model)"
			/>
		</v-col>
		<v-col cols="6">
			<CommonPickerRocDate :roc="roc" :label="labels[1]"
			:date="state.dates[1]" :value="state.values[1]" 
			:minimum_view="minimum_view"
			:minutes_allow="minutes_allow" :hours_allow="hours_allow"
			:lower_limit="lower_limit" :clearable="!required_start"
			:error_message="state.errors.get('end')"
			@ready="(model) => onDateSelected(1, model, false)"
			@selected="(model) => onDateSelected(1, model)"
			/>
		</v-col>
	</v-row>
</template>