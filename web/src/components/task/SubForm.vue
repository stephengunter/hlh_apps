<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import Errors from '@/common/errors'
import { getDatePickerModel, deepClone , areObjectsEqual, initByDate,
	setValues, badRequest, isValidDate
} from '@/utils'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, ROUTE_NAMES, ENTITY_TYPES, ACTION_TYPES, HEIGHT } from '@/consts'

const name = 'TaskSUbForm'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.TASK

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
	form: {
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

const canRemove = computed(() => {
	if(!props.model.id) return false
	if(props.model.active) return false
	return true
})


const rules = computed(() => {
	return {
		title: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(props.labels['title']), required)
		}
	}
})
const v$ = useVuelidate(rules, state.form)


onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
	console.log(props.model.deadLine)
	console.log(state.form.deadLine)

	let date = props.model.deadLine
	let model = getDatePickerModel(date)
	 
	state.date.date = state.form.deadLine
	state.date.model = getDatePickerModel()

	onDateSelected({ date, model }, false)
}

function onDateSelected({ date, model }) {
	state.date.date = date
	state.date.model = deepClone(model)
	state.date.value = model.text_cn

	state.form.deadLine = date

	if(checkDeadLine(state.form.deadLine)) {
		state.date.error_message = ''
	}else {
		state.date.error_message = `${labels.value['deadLine']}不正確`
	}

}
function checkDeadLine(date) {
   console.log('checkDeadLine', date)
	return true
}
function onSubmit() {
	v$.value.$validate().then(valid => {
		if(!valid) return

		if(state.errors.any()) return
		emit('submit', state.form)
	})
}
function onRemove(id) {
	emit('remove', id)
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}

</script>

<template>
   <form @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row dense>
			<v-col cols="10">
				<v-text-field :label="labels['title']"           
				v-model="state.form.title"
				:error-messages="v$.title.$errors.map(e => e.$message)"                     
				@input="v$.title.$touch"
				@blur="v$.title.$touch"
				/>
			</v-col>
			<v-col cols="2">
				<CommonPickerRocDate :label="labels['deadLine']"
				:clearable="true"
				:error_message="state.date.error_message"
				:date="state.date.date" :value="state.date.value"
				@ready="(model) => onDateSelected(model)"
				@selected="(model) => onDateSelected(model)"
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
				<v-btn v-if="canRemove"  class="float-left" color="error"
				@click.prevent="onRemove" 
				>
					{{ ACTION_TYPES.REMOVE['title'] }}
				</v-btn>
				<v-btn type="submit" color="success" class="float-right">
				{{ ACTION_TYPES.SAVE['title'] }}
				</v-btn>
			</v-col>
		</v-row>
	</form>
</template>