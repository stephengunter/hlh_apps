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
	lower_limit: {
      type: Date,
		default: () => null
	},
	upper_limit: {
      type: Date,
		default: () => null
	},
	clearable: {
      type: Boolean,
		default: true
	},
	class_name: {
      type: String,
		default: ''
	}
})
const emit = defineEmits(['ready', 'selected'])

const initialState = {
	active: false,
	action: '',
	date: null,
	model: {
		text: '',
		text_cn: '',
		num: 0
	}
}
const state = reactive(deepClone(initialState))

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
	emit('ready', { date: state.date, model: state.model })
}

function resolve(date) {
	let text = ''
	let text_cn = ''
	let num = 0
	if(date) {
		text = dateToText(date)
		let parts = text.split('-')
		parts[0] = tryParseInt(parts[0]) - 1911
		text_cn = `${parts[0]}-${parts[1]}-${parts[2]}`
		num = tryParseInt(`${parts[0]}${parts[1]}${parts[2]}`)
	}
	return { text, text_cn, num }
}

function onSelected(date) {
	if(date) state.date = date
	else state.date = null

	let model = resolve(date)
	state.model = model
	emit('selected', { date: state.date, model: deepClone(model) })

	state.active = false
}

</script>
<template>
	<v-menu :close-on-content-click="false" v-model="state.active">
      <template v-slot:activator="{ props }">
         <v-text-field :class="class_name"  readonly v-bind="props"
			density="compact" variant="outlined"
			:label="label" :clearable="clearable"
         :model-value="state.model.text_cn"
			:error-messages="errorMessages"
			@click:clear="onSelected(null)"
         />
      </template>
      <Wrapper :auto_show="true"
		:lowerLimit="lower_limit" :upperLimit="upper_limit"
		:modelValue="state.date" 
		@update:modelValue="onSelected"
		/>
   </v-menu>
</template>