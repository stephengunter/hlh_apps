<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, alphaNum, ipAddress, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, getValue, statusText, deepClone, isEmptyObject } from '@/utils'

const name = 'ITCredentialInfoForm'
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
	},
})
const emit = defineEmits(['submit', 'cancel', 'remove'])
const store = useStore()

const initialState = {
   form: {
		title: '',
		ps: '',
		type: '',
		startTime: 0,
		minutesInterval: 0,
		databaseId: 0
   }
}
const state = reactive(deepClone(initialState))
const rules = computed(() => {
	let obj = {
		type: { 
			isValid: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('type')), checkType)
		},
		startTime: { 
			isValid: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('startTime')), checkStartTime)
		},
		minutesInterval: { 
			isValid: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('minutesInterval')), checkMinutesInterval)
		},
		databaseId: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('database')), required)
		}
	}
	// if(!props.model.id) {
	// 	obj.password = {
	// 		required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('password')), required)
   // 	}
	// }
	return obj
})
const ENTITY_TYPE = ENTITY_TYPES.CREDENTIALINFO
const v$ = useVuelidate(rules, state.form)


const canRemove = computed(() => {
	if(!props.model.id) return false
	return true
})
const status_text = computed(() => statusText(state.form.active))

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function checkType(val) {

}
function checkStartTime(val) {

}
function checkMinutesInterval(val) {

}
function onSubmit() {
	v$.value.$validate().then(valid => {
		if(!valid) return
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
		<v-row dense>{{ state.form }}
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
				<v-text-field :label="getLabel('startTime')"           
				v-model="state.form.startTime"
				:error-messages="v$.startTime.$errors.map(e => e.$message)"                     
				@input="v$.startTime.$touch"
				@blur="v$.startTime.$touch"
				/>
			</v-col>
			<v-col cols="6">
				<v-text-field :label="getLabel('minutesInterval')"           
				v-model="state.form.minutesInterval"
				:error-messages="v$.minutesInterval.$errors.map(e => e.$message)"                     
				@input="v$.minutesInterval.$touch"
				@blur="v$.minutesInterval.$touch"
				/>
			</v-col>
			<v-col cols="12">
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