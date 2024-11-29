<script setup>
import { ref, reactive, computed, onBeforeMount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, alphaNum, ipAddress, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES, SERVER_TYPES } from '@/consts'
import { setValues, getValue, isAlphaNumeric, deepClone, isEmptyObject } from '@/utils'
import TypeSelector from './TypeSelector.vue'

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
		root: '',
		title: '',
		key: '',
		ps: ''
   },
   type_selected: null,
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
		},
		root: {
			isValid: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('root')), checkRoot)
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
const isFTP = computed(() => state.form.type.toLowerCase() === SERVER_TYPES.FTP.name.toLowerCase())

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)

	state.type_selected = props.type_options.find(x => x.value === props.model.type)   
	onTypeSelected(state.form.type)
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
function checkHost(val) {
	return val > 0
}
function checkRoot(val) {
	if(state.form.type.toLowerCase() === SERVER_TYPES.FTP.name.toLowerCase()) {
		if(val) return true
		return false
	}
	return true
}

function onTypeSelected(val) {
	state.type_selected = props.type_options.find(x => x.value === val)
   state.form.type = val

	state.providers_options = props.providers[val.toLowerCase()]
	if(!state.providers_options.includes(state.form.provider)) {
		if(props.id) state.form.provider = ''
		else state.form.provider = state.providers_options[0]
	}
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
			<v-col cols="6">
				<TypeSelector :type_options="type_options" :type_selected="state.type_selected"
            @selected="onTypeSelected"
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
			<v-col cols="6">
				<v-select :label="getLabel('host')" 
				:items="state.host_options" v-model="state.form.hostId"
				:error-messages="v$.hostId.$errors.map(e => e.$message)" 
				/>
			</v-col>
			<v-col cols="6">
				<v-text-field v-if="isFTP" :label="labels['root']"           
				v-model="state.form.root"
				:error-messages="v$.root.$errors.map(e => e.$message)"
				@input="v$.root.$touch"
				@blur="v$.root.$touch"
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