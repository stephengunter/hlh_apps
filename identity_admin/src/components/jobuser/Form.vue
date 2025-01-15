<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, statusText, deepClone, isEmptyObject, isSameOrAfter } from '@/utils'
import Errors from '@/common/errors'

const name = 'JobUserForm'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	job: {
		type: Object,
		default: null
	},
	department: {
      type: Object,
      default: null
   },
	profiles: {
      type: Array,
      default: () => []
   }
})
const emit = defineEmits(['submit', 'cancel', 'remove'])
const store = useStore()

const initialState = {
   form: {
		id: 0,
		jobId: 0,
		userId: '',
		startDate: null,
		endDate: null,
		startDateText: '',
		endDateText: ''
   },
	errors: new Errors(),
}
const state = reactive(deepClone(initialState))
const title = computed(() => props.model.id ? `${ACTION_TITLES.EDIT}${entity.title}` : `${ACTION_TITLES.CREATE}${entity.title}`)
const rules = computed(() => {
	return {
		userId: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['userId']), required)
		}
	}
})

const labels = {
	'department': ENTITY_TYPES.DEPARTMENT.title,
	'jobId': ENTITY_TYPES.JOB.title,
	'userId': '任職人員',
	'ps': '備註',
	'active': '狀態',
	'startDate': '開始日期',
	'endDate': '結束日期'
}
const v$ = useVuelidate(rules, state.form)

const canRemove = computed(() => {
	if(!props.model.id) return false
	if(props.model.active) return false
	return true
})
const departmentFullTitle = computed(() => {
	if(props.department) return props.department.getFullText()
	if(props.model.department) return props.job.department.title
	return ''
})
const status_text = computed(() => statusText(state.form.active))

onBeforeMount(init)

function init() {
	console.log(props.profiles)
	setValues(props.model, state.form)
}

function setStartDate(date) {
	state.form.startDateText = date.text
	checkDate()
}
function setEndDate(date) {
	state.form.endDateText = date.text
	checkDate()
}
function checkDate() {
	if(state.form.startDateText) state.errors.clear('startDate')
	else state.errors.set('startDate', [VALIDATE_MESSAGES.REQUIRED(labels['startDate'])])

	if(state.form.endDateText) {
		if(isSameOrAfter(state.form.startDateText, state.form.endDateText)) {
			state.errors.clear('endDate')
		}else {
			state.errors.set('endDate', ['錯誤的結束日期'])
		}
	}
	
}
function cancel() {
	emit('cancel')
}
function onSubmit() {
	v$.value.$validate().then(valid => {
		checkDate()
		if(!valid) return
		if(state.errors.any()) return
		emit('submit', state.form)
	})
}

function onRemove() {
	emit('remove')
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}
</script>

<template>
	<form @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row dense>
			<v-col cols="12">
				<v-text-field :label="labels['department']"
				readonly :model-value="departmentFullTitle"
				/>
			</v-col>
			
			<v-col cols="6">
				<v-text-field :label="labels['jobId']"
				readonly :model-value="props.job.jobTitle.title"
				/>
			</v-col>
			<v-col cols="6">
				<v-autocomplete :label="labels['userId']"
				v-model="state.form.userId" item-value="userId"
				:items="props.profiles" item-title="name"
				:error-messages="v$.userId.$errors.map(e => e.$message)"                     
				@input="v$.userId.$touch"
				@blur="v$.userId.$touch"
				/>
			</v-col>
			<v-col cols="6">
				<CommonPickerDate :label="labels['startDate']" :value="state.form.startDateText"
				:error_message="state.errors.get('startDate')"
				@selected="setStartDate"
				/>
			</v-col>
			<v-col cols="6">
				<CommonPickerDate :label="labels['endDate']" :value="state.form.endDateText"
				:error_message="state.errors.get('endDate')"
				@selected="setEndDate"
				/>
			</v-col>
			<v-col cols="12">
				<v-textarea auto-grow :label="labels['ps']"  
				v-model="state.form.ps"	
				/>
			</v-col>
		</v-row>
		<v-col cols="12">
			<CommonErrorsList />
		</v-col> 
		<v-row>
			<v-col cols="12">
				
				<v-btn v-if="canRemove"  class="float-left" color="error"
				@click.prevent="onRemove" 
				>
				{{ ACTION_TITLES.REMOVE }}
				</v-btn>
				<v-btn type="submit" color="success" class="float-right">
				{{ ACTION_TITLES.SAVE }}
				</v-btn>
			</v-col>
		</v-row>
	</form>
</template>