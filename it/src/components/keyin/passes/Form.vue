<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, alphaNum, ipAddress, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, getValue, deepClone, isEnableText, isEmptyObject, tryParseInt } from '@/utils'
import Errors from '@/common/errors'

const name = 'KeyinPassesForm'
const props = defineProps({
	id: {
		type: Number,
		default: 0
	},
	labels: {
		type: Object,
		default: null
	},
   model: {
		type: Object,
		default: null
	}
})
const emit = defineEmits(['submit', 'cancel', 'remove'])
const store = useStore()

const initialState = {
   form: {
		account: '',
		unit: '',
		name: '',
		highRun: '',
		leaveAtText: ''
   },
	errors: new Errors()
}
const state = reactive(deepClone(initialState))
const rules = computed(() => {
	return {
		account: {
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('account')), required)
		},
		unit: {
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('unit')), required)	
		},
		name: {
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('name')), required)
		},
		highRun: {
			isValid: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(getLabel('highRun')), isValidHighRun)
		}
	}
})
const ENTITY_TYPE = ENTITY_TYPES.HOST
const v$ = useVuelidate(rules, state.form)


const canRemove = computed(() => {
	if(!props.id) return false
	return true
})
const status_text = computed(() => isEnableText(state.form.active))

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function isValidHighRun(val) {
	if(isNaN(val)) return false
	return tryParseInt(val) >= 0 
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

function setLeaveAt(date) {
	state.form.leaveAtText = date.text
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}
</script>

<template>
	<form @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row dense>
			<v-col cols="4">
				<v-text-field :label="labels['name']" density="compact"           
				v-model="state.form.name"
				:error-messages="v$.name.$errors.map(e => e.$message)"                     
				@input="v$.name.$touch"
				@blur="v$.name.$touch"
				/>
			</v-col>
			<v-col cols="4">
				<v-text-field :label="labels['account']" density="compact"            
				v-model="state.form.account"
				:error-messages="v$.account.$errors.map(e => e.$message)"                     
				@input="v$.account.$touch"
				@blur="v$.account.$touch"
				/>
			</v-col>
			<v-col cols="4">
				<v-text-field :label="labels['unit']"  density="compact"           
				v-model="state.form.unit"
				:error-messages="v$.unit.$errors.map(e => e.$message)"                     
				@input="v$.unit.$touch"
				@blur="v$.unit.$touch"
				/>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="4">
				<v-text-field :label="labels['highRun']" density="compact"            
				v-model="state.form.highRun"
				:error-messages="v$.highRun.$errors.map(e => e.$message)"                     
				@input="v$.highRun.$touch"
				@blur="v$.highRun.$touch"
				/>			
			</v-col>
			<v-col cols="4">
				<CommonPickerDate :label="labels['leaveAtText']" :value="state.form.leaveAtText"
				@selected="setLeaveAt"
				/>
			</v-col>
			<v-col cols="4">
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