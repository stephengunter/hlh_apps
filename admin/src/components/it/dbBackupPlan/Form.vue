<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, alphaNum, ipAddress, helpers } from '@vuelidate/validators'
import Errors from '@/common/errors'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES, DB_BACKUP_TYPES } from '@/consts'
import { setValues, getValue, isEnableText, deepClone, isEmptyObject, formatTime, isValidTime , timeStringToNumber } from '@/utils'


const name = 'ITDbBackupPlanForm'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	type_options: {
		type: Array,
      default: () => []
	},
	db_options: {
		type: Array,
      default: () => []
	},
	labels: {
		type: Object,
		default: null
	},
	can_remove: {
		type: Boolean,
		default: false
	}
})
const emit = defineEmits(['submit', 'cancel', 'remove'])
const store = useStore()

const initialState = {
   form: {
		title: '',
		ps: '',
		type: '',
		active: true,
		startTime: 0,
		minutesInterval: 0,
		databaseId: 0
   },
	interval_options: [],
	startTime: {
		value: ''
	},
	errors: new Errors()

}
const state = reactive(deepClone(initialState))
const rules = computed(() => {
	let obj = {
		type: { 
			isValid: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('type')), checkType)
		}
	}
	return obj
})
const ENTITY_TYPE = ENTITY_TYPES.CREDENTIALINFO
const v$ = useVuelidate(rules, state.form)
const status_text = computed(() => isEnableText(state.form.active))

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
	state.startTime.value = formatTime(state.form.startTime)
	for(let i = 30; i <= 300; i += 30) {
		state.interval_options.push({
			value: i, title: i
		})
	}
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function checkType(val) {
	return true
}
function checkStartTime() {
	if(state.startTime.value && isValidTime(state.startTime.value)) {
		state.form.startTime = timeStringToNumber(state.startTime.value)
		state.errors.clear('startTime')
	}else {
		state.errors.set('startTime', [`${VALIDATE_MESSAGES.REQUIRED(getLabel('startTime'))}`])
	}
}
function onStartTimeSelected(val) {
	state.startTime.value = val
	checkStartTime()
}
function getErrorMessages(key) {
	if(state.errors.has(key)) {
		return [state.errors.get(key)]
	}
	return []
}
function checkMinutesInterval() {
	if(state.form.type === DB_BACKUP_TYPES.FULL.name) {
		state.form.minutesInterval = 0
		state.errors.clear('minutesInterval')
		return
	}
	if(state.form.minutesInterval) {
		state.errors.clear('minutesInterval')
	}else {
		state.errors.set('minutesInterval', [`${VALIDATE_MESSAGES.REQUIRED(getLabel('minutesInterval'))}`])
	}
}
function onSubmit() {
	v$.value.$validate().then(valid => {
		console.log(valid)
		if(!valid) return

		checkMinutesInterval()
		checkStartTime()
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
			<v-col cols="6">
				<v-select :label="getLabel('database')" readonly
				:items="props.db_options" v-model="state.form.databaseId"
				/>
			</v-col>
			<v-col cols="6">
				<v-select :label="getLabel('type')"
				:items="type_options" v-model="state.form.type"
				/>
			</v-col>
			<v-col cols="6">
				<CommonPickerTime :label="getLabel('startTime')" 
				:value="state.startTime.value" :error_messages="getErrorMessages('startTime')"
				@selected="onStartTimeSelected"
				/>
			</v-col>
			<v-col cols="6">
				<v-select :label="getLabel('minutesInterval')" v-show="state.form.type !== DB_BACKUP_TYPES.FULL.name"
				:items="state.interval_options" v-model="state.form.minutesInterval"
				:error-messages="getErrorMessages('minutesInterval')"
				@update:modelValue="checkMinutesInterval"
				/>
			</v-col>
			<v-col cols="6">
				<v-switch
				v-model="state.form.active"
				color="success" :label="status_text"
				/>
			</v-col>
			<v-col cols="6">
				<v-text-field :label="getLabel('title')"
				v-model="state.form.title"	
				/>
			</v-col>
			<v-col cols="12">
				<v-textarea auto-grow  :label="getLabel('ps')"
				v-model="state.form.ps"	
				/>
			</v-col>
		</v-row>
		<v-col cols="12">
			<CommonErrorsList />
		</v-col> 
		<v-row>
			<v-col cols="12">
				<v-btn v-if="can_remove"  class="float-left" color="error"
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