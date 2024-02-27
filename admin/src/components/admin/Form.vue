<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES } from '@/consts'
import { setValues, statusText, deepClone, isEmptyObject } from '@/utils'

const name = 'AdminForm'
const emit = defineEmits(['submit'])
const store = useStore()

const props = defineProps({
   model: {
		type: Object,
		default: null
	}
})
const initialState = {
   form: {
		key: ''
   }
}
const state = reactive(deepClone(initialState))
const rules = computed(() => {
	return {
		key: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED('Key'), required)
		}
	}
})

const v$ = useVuelidate(rules, state.form)

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
	state.parent = isEmptyObject(props.model.parent) 
						? deepClone(initialState.parent) 
						: deepClone(props.model.parent)
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
	<form @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row dense>
			<v-col cols="12">
				<v-text-field label="Key"           
				v-model="state.form.key"
				:error-messages="v$.key.$errors.map(e => e.$message)"                     
				@input="v$.key.$touch"
				@blur="v$.key.$touch"
				/>
			</v-col>
			<CommonErrorsList />
		</v-row> 
		<v-row dense>
			<v-col cols="12">
				<v-btn type="submit" color="success" class="float-right">
				{{ ACTION_TITLES.SAVE }}
				</v-btn>
			</v-col>
		</v-row>
	</form>
</template>