<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import Errors from '@/common/errors'
import { getDatePickerModel, deepClone , isDirty, initByDate,
	setValues, badRequest, isValidDate, uuid
} from '@/utils'
import Reference from '@/models/reference'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { WIDTH, VALIDATE_MESSAGES, ROUTE_NAMES, ENTITY_TYPES, ACTION_TYPES, HEIGHT } from '@/consts'

const name = 'TaskRootForm'
const store = useStore()
const TASK = ENTITY_TYPES.TASK


const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	labels: {
		type: Object,
		default: () => {}
	}
})
const emit = defineEmits(['submit', 'remove'])

const initialState = {
	task: {
		id: 0,
		title: '',
		content: '',
		deadLine: null,
		done: false
   },
	date: {
		date: null,
		value: '',
		model: {
			text: '',
			text_cn: '',
			num: 0
		},
		error_message: ''
	},
	errors: new Errors()
}
const state = reactive(deepClone(initialState))

const rules = computed(() => {
	return {
		title: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(props.labels['title']), required)
		}
	}
})
const v$ = useVuelidate(rules, state.task)


onBeforeMount(init)

function init() {
	setValues(props.model, state.task)
	let date = null 
	let deadLine = props.model.deadLine 
	if(deadLine && isValidDate(deadLine)) {
		if(deadLine instanceof Date) date = deadLine
		else date = new Date(deadLine)
	}
	let model = getDatePickerModel(date)
	onDateSelected({ date, model }, false)
}
 
function onDateSelected({ date, model }, check) {
	state.date.date = date
	state.date.model = deepClone(model)
	state.date.value = model.text_cn

	state.task.deadLine = date

	if(!check) return
	const err_msg = checkDeadLine(state.task.deadLine)
	if(err_msg) {
		state.errors.set('deadLine', [err_msg])		
	}else {		
		state.errors.clear('deadLine')
	}

}
function checkDeadLine(date) {
	if(date) return ''
	return `必須填寫${props.labels['deadLine']}`
}
function onSubmit() {
	v$.value.$validate().then(valid => {
		if(!valid) return		
		if(state.errors.any()) return

		let model = deepClone(state.task)
		emit('submit', { model })
	})
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}

</script>

<template>
   <form  @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row dense>
			<v-col cols="10">
				<v-text-field :label="labels['title']"           
				v-model="state.task.title"
				:error-messages="v$.title.$errors.map(e => e.$message)"                     
				@input="v$.title.$touch"
				@blur="v$.title.$touch"
				/>
			</v-col>
			<v-col cols="2">
				<CommonPickerRocDate :label="labels['deadLine']"
				:clearable="true"
				:error_message="state.errors.has('deadLine') ? state.errors.get('deadLine') : ''"
				:date="state.date.date" :value="state.date.value"
				@ready="(model) => onDateSelected(model, false)"
				@selected="(model) => onDateSelected(model, true)"
				/>
			</v-col>
			<v-col cols="12">
				<v-textarea :label="labels['content']" variant="outlined"
				row-height="15" rows="3" auto-grow
				v-model="state.task.content"
				/>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<CommonErrorsList />
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<v-btn type="submit" color="success" class="float-right">
				{{ ACTION_TYPES.SAVE['title'] }}
				</v-btn>
			</v-col>
		</v-row>
	</form>
</template>