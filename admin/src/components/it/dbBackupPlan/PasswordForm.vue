<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, alphaNum, ipAddress, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, getValue, statusText, deepClone, isEmptyObject } from '@/utils'

const name = 'ITCredentialInfoPasswordForm'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	labels: {
		type: Object,
		default: null
	}
})
const emit = defineEmits(['submit'])
const store = useStore()

const initialState = {
   form: {
		password: ''
   },
	password:{
      visible: false
   }
}
const state = reactive(deepClone(initialState))
const rules = computed(() => {
	return {
		password: {
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('password')), required)
   	}
	}
})
const ENTITY_TYPE = ENTITY_TYPES.CREDENTIALINFO
const v$ = useVuelidate(rules, state.form)

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
				<v-text-field :label="getLabel('username')" readonly        
				v-model="props.model.username"
				/>
			</v-col>
			<v-col cols="6">
				<v-text-field :label="getLabel('password')"
				:append-inner-icon="state.password.visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="state.password.visible ? 'text' : 'password'"        
				v-model="state.form.password"
				:error-messages="v$.password.$errors.map(e => e.$message)"                     
				@input="v$.password.$touch"
				@blur="v$.password.$touch"
				@click:append-inner="state.password.visible = !state.password.visible"
				/>
			</v-col>
		</v-row>
		<v-col cols="12">
			<CommonErrorsList />
		</v-col> 
		<v-row>
			<v-col cols="12">
				<v-btn type="submit" color="success" class="float-right">
				{{ ACTION_TITLES.SAVE }}
				</v-btn>
			</v-col>
		</v-row>
	</form>
</template>