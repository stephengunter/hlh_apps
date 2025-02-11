<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, getValue, statusText, deepClone, isEmptyObject } from '@/utils'

const name = 'ITDatabaseForm'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	labels: {
		type: Object,
		default: null
	},
	server_options: {
		type: Array,
		default: () => []
	}
})
const emit = defineEmits(['submit', 'cancel', 'remove'])
const store = useStore()

const initialState = {
   form: {
		id: 0,
		title: '',
		name: '',
		serverId: '',
		ps: ''
   },
	errors: {
		'title': false
	}
}
const state = reactive(deepClone(initialState))
const rules = computed(() => {
	return {
		serverId: {
			isValid: helpers.withMessage(VALIDATE_MESSAGES.MUST_SELECT(getLabel('server')), checkServer)
		}
	}
})
const ENTITY_TYPE = ENTITY_TYPES.DATABASE
const v$ = useVuelidate(rules, state.form)


const canRemove = computed(() => {
	if(!props.model.id) return false
	if(props.model.active) return false
	return true
})

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
}
function onSubmit() {
	v$.value.$validate().then(valid => {
		if(!valid) return
		emit('submit', state.form)
	})
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}

function checkServer(val) {
	return val > 0
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
				<v-select :label="getLabel('server')" 
				:items="server_options" v-model="state.form.serverId"
				:error-messages="v$.serverId.$errors.map(e => e.$message)" 
				/>
			</v-col>
			<v-col cols="6">

			</v-col>
			<v-col cols="6">
				<v-text-field :label="labels['name']"           
				v-model="state.form.name"
				/>
			</v-col>
			<v-col cols="6">
				<v-text-field :label="labels['title']"           
				v-model="state.form.title"
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