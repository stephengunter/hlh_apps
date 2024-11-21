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
		username: '',
		password: '',
		title: '',
		key: '',
		ps: ''

   },
	password:{
      visible: false
   }
}
const state = reactive(deepClone(initialState))
const rules = computed(() => {
	let obj = {
		username: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('username')), required)
		}
	}
	if(!props.model.id) {
		obj.password = {
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('password')), required)
   	}
	}
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
		<v-row>
			<v-col cols="6">
				<v-text-field :label="getLabel('username')"           
				v-model="state.form.username"
				:error-messages="v$.username.$errors.map(e => e.$message)"                     
				@input="v$.username.$touch"
				@blur="v$.username.$touch"
				/>
			</v-col>
			<v-col cols="6">
				<v-text-field v-if="props.model.id" :label="getLabel('password')"
				readonly type="password" v-model="state.form.password"
				/>
				<v-text-field v-else :label="getLabel('password')"
				:append-inner-icon="state.password.visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="state.password.visible ? 'text' : 'password'"        
				v-model="state.form.password"
				:error-messages="v$.password.$errors.map(e => e.$message)"                     
				@input="v$.password.$touch"
				@blur="v$.password.$touch"
				@click:append-inner="state.password.visible = !state.password.visible"
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