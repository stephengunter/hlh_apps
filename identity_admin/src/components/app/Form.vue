<script setup>
import { ref, reactive, computed, onBeforeMount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, alphaNum, url, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, getValue, isValidURL, isAlphaNumeric, deepClone, isEmptyObject } from '@/utils'

const name = 'AppForm'
const props = defineProps({
	id: {
		type: Number,
		default: 0
	},
   model: {
		type: Object,
		default: null
	},
	labels: {
		type: Object,
		default: null
	},
	type_options: {
		type: Array,
      default: () => []
	}
})
const emit = defineEmits(['submit', 'cancel', 'remove'])
const store = useStore()
const initialState = {
   form: {
		clientId: '',
		url: '',
		title: '',
		type: ''
   },
	ready: false
}
const state = reactive(deepClone(initialState))
const is_spa = computed(() => state.form.type.toLowerCase() === 'spa')
const rules = computed(() => {
	if(is_spa.value) {
		return {
			clientId: { 
				required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('clientId')), required),
				alphaNumeric: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(getLabel('clientId')), isAlphaNumeric)
			},
			url: { 
				required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED('url'), required), 
				url: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF('url'), isValidURL)
			}
		}
	}
	return {
		clientId: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('clientId')), required),
			alphaNumeric: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(getLabel('clientId')), isAlphaNumeric)
		}
	}
	
})
const APP = ENTITY_TYPES.APP
const v$ = useVuelidate(rules, state.form)

const canRemove = computed(() => {
	return false
	// if(!props.id) return false
	// if(props.model.active) return false
	// return true
})

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
	nextTick(() => {
		state.ready = true
	})	
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function onSubmit() {
	v$.value.$validate().then(valid => {
		console.log(valid)
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
		<v-row dense>
			<v-col cols="4">
				<v-select :label="getLabel('type')" 
				:items="type_options" v-model="state.form.type"
				/>
			</v-col>
			<v-col cols="4">
				<v-text-field :label="labels['clientId']"       
				v-model="state.form.clientId"
				:error-messages="v$.clientId.$errors.map(e => e.$message)"
            @input="v$.clientId.$touch"
            @blur="v$.clientId.$touch"
				/>
			</v-col>
			<v-col v-if="state.ready" cols="4">
				<v-text-field v-if="is_spa" label="url"  v-model="state.form.url"
				:error-messages="v$.url.$errors.map(e => e.$message)"
            @input="v$.url.$touch"
            @blur="v$.url.$touch"
				/>
			</v-col>
		</v-row>
		
		<v-row dense>
			<v-col cols="12">
				<v-text-field :label="labels['displayName']"           
				v-model="state.form.title"
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