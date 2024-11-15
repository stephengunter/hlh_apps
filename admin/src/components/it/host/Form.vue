<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, alphaNum, ipAddress, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, getValue, statusText, deepClone, isEmptyObject } from '@/utils'

const name = 'ITHostForm'
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
const emit = defineEmits(['submit', 'cancel', 'remove'])
const store = useStore()

const initialState = {
   form: {
		id: 0,
		ip: '',
		title: '',
		key: '',
		ps: ''

   },
	errors: {
		'title': false
	}
}
const state = reactive(deepClone(initialState))
const rules = computed(() => {
	return {
		title: {
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('title')), required)
		},
		ip: {
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('ip')), required),			 
			ipAddress: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF(getLabel('ip')), ipAddress)
		},
		key: {
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('key')), required),
			alphaNum: helpers.withMessage(VALIDATE_MESSAGES.ALPHA_NUM(getLabel('key')), alphaNum)
		}
	}
})
const ENTITY_TYPE = ENTITY_TYPES.HOST
const v$ = useVuelidate(rules, state.form)


const canRemove = computed(() => {
	if(!props.model.id) return false
	if(props.model.active) return false
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
				<v-text-field :label="labels['title']"           
				v-model="state.form.title"
				:error-messages="v$.title.$errors.map(e => e.$message)"                     
				@input="v$.title.$touch"
				@blur="v$.title.$touch"
				/>
				<v-text-field :label="labels['ip']"           
				v-model="state.form.ip"
				:error-messages="v$.ip.$errors.map(e => e.$message)"                     
				@input="v$.ip.$touch"
				@blur="v$.ip.$touch"
				/>
			</v-col>
			<v-col cols="6">
				<v-text-field :label="labels['key']"           
				v-model="state.form.key"
				:error-messages="v$.key.$errors.map(e => e.$message)"                     
				@input="v$.key.$touch"
				@blur="v$.key.$touch"
				/>
			</v-col>
			<v-col cols="12">
				<v-textarea auto-grow :label="labels['ps']"  
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