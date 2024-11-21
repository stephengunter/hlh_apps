<script setup>
import { ref, reactive, computed, onBeforeMount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, alphaNum, ipAddress, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, getValue, statusText, deepClone, isEmptyObject } from '@/utils'

const name = 'ITServerForm'
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
	},
	providers: {
		type: Object,
		default: null
	},
	hosts: {
		type: Array,
      default: () => []
	}
})
const emit = defineEmits(['submit', 'cancel', 'remove'])
const store = useStore()

const initialState = {
   form: {
		hostId: 0,
		type: '',
		provider: '',
		title: '',
		key: '',
		ps: ''
   },
	providers_options: [],
	host_options: []
}
const state = reactive(deepClone(initialState))
const rules = computed(() => {
	return {
		provider: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('provider')), required)
		},
		hostId: {
			isValid: helpers.withMessage(VALIDATE_MESSAGES.MUST_SELECT(getLabel('host')), checkHost)
		}
	}
})
const ENTITY_TYPE = ENTITY_TYPES.SERVER
const v$ = useVuelidate(rules, state.form)


const canRemove = computed(() => {
	if(!props.id) return false
	if(props.model.active) return false
	return true
})

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
	onTypeChanged(state.form.type)
	let options = props.hosts.map(host => {
		return {
			value: host.id,
			title: host.ip
		}
	})

	options.unshift({ value: 0, title: '-------' });
	state.host_options = options

}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function onTypeChanged(val) {
	let providers = []
	if(val.toLowerCase() === 'web') {
		providers = getProviders('web')
	}else if(val.toLowerCase() === 'db') {
		providers = getProviders('db')
	}
	if(providers.length) {
		if(!providers.includes(state.form.provider)) {
			console.log('4545', props.id)
			if(!props.id) state.form.provider = providers[0]
		}
		state.providers_options = providers.map(item => ({
			value: item, title: item
		}))
	}else {
		state.form.provider = ''
		state.providers_options = []
	}
	
}
function getProviders(key) {
	if(isEmptyObject(props.providers)) return []
   return getValue(props.providers, key)
}
function checkHost(val) {
	console.log('checkHost', val)
	return val > 0
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
			<v-col cols="6">
				<v-select :label="getLabel('type')"
				:items="props.type_options" v-model="state.form.type"
				@update:modelValue="onTypeChanged"
				/>
			</v-col>
			<v-col cols="6">
				<v-select :label="getLabel('provider')"
				:items="state.providers_options" v-model="state.form.provider"
				:error-messages="v$.provider.$errors.map(e => e.$message)" 
				/>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<v-select :label="getLabel('host')" 
				:items="state.host_options" v-model="state.form.hostId"
				:error-messages="v$.hostId.$errors.map(e => e.$message)" 
				/>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="6">
				<v-text-field :label="labels['title']"           
				v-model="state.form.title"
				/>
			</v-col>
			<v-col cols="6">
				<v-text-field :label="labels['key']"           
				v-model="state.form.key"
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