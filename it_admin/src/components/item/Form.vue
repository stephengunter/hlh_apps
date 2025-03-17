<script setup>
import { ref, reactive, computed, onBeforeMount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, alphaNum, url, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, getValue, statusText, isAlphaNumeric, deepClone, isEmptyObject } from '@/utils'

const name = 'ItemForm'
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
	}
})
const emit = defineEmits(['submit', 'cancel', 'remove'])
const store = useStore()
const initialState = {
   form: {
		name: '',
		code: '',
		ps: '',
		active: false
   }
}
const state = reactive(deepClone(initialState))
const status_text = computed(() => statusText(state.form.active))
const rules = computed(() => {
	return {
		name: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('name')), required)
		},
		code: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('code')), required)
		}
	}
	
})
const APP = ENTITY_TYPES.APP
const v$ = useVuelidate(rules, state.form)

const canRemove = computed(() => {
	if(!props.id) return false
	if(props.model.hasOwnProperty('canRemove')) return props.model.canRemove
	return false
})

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
		<v-row dense>
			<v-col cols="4">
				<v-text-field :label="labels['name']"    
				density="compact" variant="outlined" 
				v-model="state.form.name"
				:error-messages="v$.name.$errors.map(e => e.$message)"
            @input="v$.name.$touch"
            @blur="v$.name.$touch"
				/>
			</v-col>
			<v-col cols="4">
				<v-text-field density="compact" variant="outlined"
				:label="labels['code']" 
				v-model="state.form.code"
				:error-messages="v$.code.$errors.map(e => e.$message)"
            @input="v$.code.$touch"
            @blur="v$.code.$touch"
				/>
			</v-col>
			<v-col cols="4">
				
				
			</v-col>
			<v-col cols="2">
				<v-switch 
				v-model="state.form.active"
				color="success" :label="status_text"
				/>
			</v-col>
			<v-col cols="10">
				<v-textarea auto-grow :label="labels['ps']" 
				rows="2" density="compact" 
				v-model="state.form.ps"	
				/>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<CommonErrorsList />
			</v-col> 
		</v-row>
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