<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { email, required, numeric , helpers } from '@vuelidate/validators'
import { VALIDATE_MESSAGES } from '@/consts'
import { CLEAR_ERRORS } from '@/store/mutations.type' 
import { setValues, deepClone, statusText, isValidUserName, isValidPhoneNumber } from '@/utils'

const name = 'UserForm'
const props = defineProps({
   model: {
      type: Object,
      default: null
   },
	active: {
      type: Boolean,
      default: false
   }
})
const emit = defineEmits(['submit'])

const store = useStore()
const initialState = {
   form: {
		userName: '',
      email: '',
      name: '',
		phoneNumber: '',
		active: false
   }
}
const state = reactive(deepClone(initialState))
const status_text = computed(() => statusText(state.form.active))

onBeforeMount(init)

const labels = {
   'userName':'UserName',
   'email':'Email',
	'name':'名稱',
	'phoneNumber':'手機號碼',
	'active':'狀態'
}

const rules = computed(() => {
	return {
		userName: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['userName']), required),
			isValidUserName: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(labels['userName']), isValidUserName)
		},
		email: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['email']), required), 
			email: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(labels['email']), email), 
		},
		name: {
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['name']), required)
		},
		phoneNumber: {
			numeric: helpers.withMessage(VALIDATE_MESSAGES.IS_NUMERIC(labels['phoneNumber']), numeric),
			isValidPhoneNumber: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(labels['phoneNumber']), checkPhone)
		}
	}
})

const v$ = useVuelidate(rules, state.form)

function init() {
	setValues(props.model, state.form)
}
function onSubmit() {
	v$.value.$validate().then(valid => {
      if(!valid) return
		emit('submit', state.form)
	})
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}
function checkPhone(val) {
	if(!val) return true
	return isValidPhoneNumber(val)
}
</script>

<template>
   <form v-if="props.model" @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row>
			<v-col cols="12">
				<v-text-field :label="labels['userName']"                   
				v-model="state.form.userName"
				:error-messages="v$.userName.$errors.map(e => e.$message)"                     
				@input="v$.userName.$touch"
				@blur="v$.userName.$touch"
				/>
				<v-text-field :label="labels['name']"                
				v-model="state.form.name"
				:error-messages="v$.name.$errors.map(e => e.$message)"                     
				@input="v$.name.$touch"
				@blur="v$.name.$touch"
				/>
				<v-text-field :label="labels['email']"
				v-model="state.form.email"
				:error-messages="v$.email.$errors.map(e => e.$message)"                     
				@input="v$.email.$touch"
				@blur="v$.email.$touch"
				/>
				<v-text-field :label="labels['phoneNumber']"
				v-model="state.form.phoneNumber"
				:error-messages="v$.phoneNumber.$errors.map(e => e.$message)"                     
				@input="v$.phoneNumber.$touch"
				@blur="v$.phoneNumber.$touch"
				/>
				<v-switch
				v-model="state.form.active"
				color="success" :label="status_text"
				/>
				<CommonErrorsList v-if="props.active" />
			</v-col>
			<v-col cols="12">
				<v-btn type="submit" color="success" class="float-right">
				存檔
				</v-btn>
			</v-col>  
		</v-row>
	</form>
</template>