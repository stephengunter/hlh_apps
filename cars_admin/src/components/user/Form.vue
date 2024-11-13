<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { email, required, numeric , helpers } from '@vuelidate/validators'
import { VALIDATE_MESSAGES } from '@/consts'
import { CLEAR_ERRORS } from '@/store/mutations.type' 
import { isEmptyObject, setValues, getValue, deepClone, statusText, isValidUserName, isValidPhoneNumber } from '@/utils'

const name = 'UserForm'
const props = defineProps({
   model: {
      type: Object,
      default: null
   },
	labels: {
      type: Object,
      default: null
   },
	roles: {
      type: Array,
      default: () => []
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
		roles: [],
		active: false
   }
}
const state = reactive(deepClone(initialState))
const status_text = computed(() => statusText(state.form.active))
const can_edit_username = computed(() => {
	if(props.model) {
		if(props.model.id) return false
		return true
	}
	return false
})

function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}

onBeforeMount(init)

const rules = computed(() => {
	return {
		userName: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('userName')), required),
			isValidUserName: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(getLabel('userName')), isValidUserName)
		},
		email: { 
			//required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('email']), required), 
			email: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(getLabel('email')), email), 
		},
		name: {
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('name')), required)
		},
		phoneNumber: {
			numeric: helpers.withMessage(VALIDATE_MESSAGES.IS_NUMERIC(getLabel('phoneNumber')), numeric),
			isValidPhoneNumber: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(getLabel('phoneNumber')), checkPhone)
		}
	}
})

const v$ = useVuelidate(rules, state.form)

function init() {
	console.log(props.roles)
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
				<v-text-field :label="getLabel('userName')" :readonly="!can_edit_username"                  
				v-model="state.form.userName"
				:error-messages="v$.userName.$errors.map(e => e.$message)"                     
				@input="v$.userName.$touch"
				@blur="v$.userName.$touch"
				/>
				<v-text-field :label="getLabel('name')"                
				v-model="state.form.name"
				:error-messages="v$.name.$errors.map(e => e.$message)"                     
				@input="v$.name.$touch"
				@blur="v$.name.$touch"
				/>
				<v-text-field :label="getLabel('email')"
				v-model="state.form.email"
				:error-messages="v$.email.$errors.map(e => e.$message)"                     
				@input="v$.email.$touch"
				@blur="v$.email.$touch"
				/>
				<v-text-field :label="getLabel('phoneNumber')"
				v-model="state.form.phoneNumber"
				:error-messages="v$.phoneNumber.$errors.map(e => e.$message)"                     
				@input="v$.phoneNumber.$touch"
				@blur="v$.phoneNumber.$touch"
				/>
				<v-label class="font-weight-bold" v-text="getLabel('roles')"></v-label>
				<v-row>
					<v-col cols="4" v-for="role in roles">
						<v-checkbox density="compact"
						hide-details
						v-model="state.form.roles"
						:label="role.title"
						:value="role.name"						
						/>
					</v-col>
				</v-row>
				<v-switch
				v-model="state.form.active"
				color="success" :label="status_text"
				/>
				<CommonErrorsList />
			</v-col>
			<v-col cols="12">
				<v-btn type="submit" color="success" class="float-right">
				存檔
				</v-btn>
			</v-col>  
		</v-row>
	</form>
</template>