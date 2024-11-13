<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { VALIDATE_MESSAGES } from '@/consts'
import { deepClone, onErrors, setValues } from '@/utils'

const name = 'FetchesSystemsForm'
const store = useStore()
const emit = defineEmits(['submit'])
const props = defineProps({
	model: {
		type: Object,
		default: null
	},
	department_options: {
      type: Array,
      default: () => []
   }
})

const initialState = {
	form: {
		department: '',
		title: ''
   }
}
const state = reactive(deepClone(initialState))

const rules = computed(() => {
	return {
		title: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED('名稱'), required)
		}
	}
})

const v$ = useVuelidate(rules, state.form)

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
	console.log(state.form)
}
function onSubmit() {
	v$.value.$validate().then(valid => {
      if(!valid) return
		emit('submit', state.form)
	})
}
</script>

<template>
	<form @submit.prevent="onSubmit">
		<v-row dense>
			<v-col cols="12">
				<v-select density="compact" label="部門" 
				:items="department_options" v-model="state.form.department"
				/>
				<v-text-field label="名稱"                   
				v-model="state.form.title"
				:error-messages="v$.title.$errors.map(e => e.$message)"                     
				@input="v$.title.$touch"
				@blur="v$.title.$touch"
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