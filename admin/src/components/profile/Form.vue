<script setup>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import { VALIDATE_MESSAGES } from '@/consts'
import { CLEAR_ERRORS } from '@/store/mutations.type' 
import { setValues, deepClone } from '@/utils'

const name = 'ProfileForm'
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
defineExpose({
	init
})
const emit = defineEmits(['submit'])

const store = useStore()
const initialState = {
   form: {
      name: '',
      phoneNumber: ''
   }
}
const state = reactive(deepClone(initialState))

const labels = {
   'email':'Email',
	'name':'名稱',
	'phoneNumber':'手機號碼'
}

const rules = computed(() => {
	return {
		name: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['name']), required)
		},
		phoneNumber: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['phoneNumber']), required),
			numeric: helpers.withMessage(VALIDATE_MESSAGES.IS_NUMERIC(labels['phoneNumber']), numeric)
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
</script>

<template>
   <form v-if="props.model" @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row>
			<v-col cols="12">
				<v-text-field :label="labels['email']"
				readonly :model-value="props.model.email"
				/>
				<v-text-field :label="labels['name']"                
				v-model="state.form.name"
				:error-messages="v$.name.$errors.map(e => e.$message)"                     
				@input="v$.name.$touch"
				@blur="v$.name.$touch"
				/>
				<v-text-field :label="labels['phoneNumber']"                   
				v-model="state.form.phoneNumber"
				:error-messages="v$.phoneNumber.$errors.map(e => e.$message)"                     
				@input="v$.phoneNumber.$touch"
				@blur="v$.phoneNumber.$touch"
				/>
			</v-col>
			<v-col cols="12">
				<v-btn type="submit" color="success" class="float-right">
				存檔
				</v-btn>
			</v-col> 
			<v-col v-show="props.active" cols="12">
				<CoreErrorList />
			</v-col>  
		</v-row>
	</form>
</template>