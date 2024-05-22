<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { deepClone, dateToText, textToDate, isValidDate, tryParseInt } from '@/utils'
import Wrapper from './Wrapper.vue'
import { WIDTH, ROUTE_NAMES, VALIDATE_MESSAGES, ACTION_TYPES, ENTITY_TYPES } from '@/consts'


const name = 'CommonPickerDate'
const props = defineProps({
   value: {
      type: String,
		default: ''
	},
   label: {
      type: String,
		default: '日期'
	},
   error_message: {
      type: String,
		default: ''
	},
	auto_launch: {
      type: Boolean,
		default: false
	},
	clearable: {
      type: Boolean,
		default: true
	}
})
const emit = defineEmits(['selected'])

const initialState = {
	action: '',
	date: null,
	model: {
		text: '',
		text_cn: '',
		num: 0
	}
}
const state = reactive(deepClone(initialState))

const wrapper = ref(null)

const errorMessages = computed(() => props.error_message ? [props.error_message] : [])

onMounted(init)
watch(() => props.value, init, {
	deep: false
})

function init() {
	if (props.value) {
		let parts = props.value.split('-')
		if (parts.length === 3) {
			const date = textToDate(props.value)
			if (date) {
				state.model.text = props.value
				parts[0] = tryParseInt(parts[0]) - 1911
				state.model.text_cn = `${parts[0]}-${parts[1]}-${parts[2]}`
				state.model.num = tryParseInt(`${parts[0]}${parts[1]}${parts[2]}`)

				state.date = date
			}
		}
		
	}else {
		state.date = null
		state.model = deepClone(initialState.model)
	}

	if(props.auto_launch) wrapper.value.launch()
}
function onFocused(val) {
	if(val) {
		state.action = 'focus'
	}
	else {
		state.action = 'blur'
	} 
}
function onClick() {
	state.action = ''
	nextTick(() => {
		state.action = 'click'
	})
	
}

function resolve(date) {
	state.date = date
	state.model.text = dateToText(date)
	let parts = state.model.text.split('-')
	parts[0] = tryParseInt(parts[0]) - 1911
	state.model.text_cn = `${parts[0]}-${parts[1]}-${parts[2]}`
	state.model.num = tryParseInt(`${parts[0]}${parts[1]}${parts[2]}`)
	
}

function onSelected(date) {
	if(date) {
		resolve(date)
		emit('selected', state.model)
	}else {
		emit('selected')
	}
	
}

</script>
<template>
	<div>
		<v-text-field  density="compact" variant="outlined"
		:label="label" readonly 
		:clearable="clearable"
		:model-value="state.model.text_cn"
		:error-messages="errorMessages"
		@click:clear="onSelected(null)"
		@click:control="onClick"
		@update:focused="onFocused"
		/>
		<Wrapper ref="wrapper" :action="state.action"
		:modelValue="state.date"
		@update:modelValue="onSelected"
		/>
	</div>
</template>