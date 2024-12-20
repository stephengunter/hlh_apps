<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, randomItem, statusText, deepClone, isEmptyObject, getValue } from '@/utils'
import Errors from '@/common/errors'

const name = 'ITSystemAppForm'
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
	server_options: {
      type: Array,
      default: () => []
   },
	type_options: {
      type: Array,
      default: () => []
   },
	importance_options: {
      type: Array,
      default: () => []
   }
})
const emit = defineEmits(['submit', 'cancel', 'remove'])
const store = useStore()

const initialState = {
   form: {
		centralized: false,
		parentId: null,
		serverId: null,
		importance: 0,
		type: '',
		title: '',
		key: '',
		url: '',
		ps: ''
   },
	errors: new Errors()
}
const state = reactive(deepClone(initialState))
const rules = computed(() => {
	return {
		title: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('title')), required)
		}
	}
})
const entity = ENTITY_TYPES.SYSTEM_APP
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
	if(props.id) {

	}else {
		if(!state.form.type) {
			if(props.type_options.length) state.form.type = props.type_options[0].value
		}
	}
	onCentralizedChanged(state.form.centralized)
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function onTypeChanged(val) {
	console.log('onTypeChanged', val)
}
function onCentralizedChanged(val) {
	if(val) {
		state.form.serverId = null
	}
}
function checkUrl(val) {
	console.log('checkUrl', val)
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
			<v-col cols="12">
				{{ state.form }}
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field :label="labels['parentId']" 
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field :label="labels['title']"           
				v-model="state.form.title"
				:error-messages="v$.title.$errors.map(e => e.$message)"
				@input="v$.title.$touch"
				@blur="v$.title.$touch"
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field :label="labels['key']"           
				v-model="state.form.key"
				/>
			</v-col>
			<v-col cols="3">
				<v-switch class="ml-3"
				v-model="state.form.active"
				color="success" :label="status_text"
				/>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="3">
				<v-switch :label="labels['centralized']"
				v-model="state.form.centralized" 
				color="success"
				@update:modelValue="onCentralizedChanged"
				/>
			</v-col>
			<v-col cols="3">
				<v-select :label="getLabel('type')" 
				:items="type_options" v-model="state.form.type"
				@update:modelValue="onTypeChanged"
				/>
			</v-col>
			<v-col cols="3">
				<v-select :label="getLabel('server')"
				:disabled="state.form.centralized"
				:items="server_options" v-model="state.form.serverId"
				/>
			</v-col>
			<v-col cols="3">
				
			</v-col>
		</v-row>	
		<v-row dense>	
			<v-col cols="4">
				<span v-text="getLabel('importance')" class="mr-3"></span>
				<v-btn-toggle v-model="state.form.importance" color="info" 
				rounded="0" group density="compact"
				>
					<v-btn v-for="item in importance_options" :key="item.value">
						{{ item.title }}
					</v-btn>
				</v-btn-toggle>
			</v-col>
			<v-col cols="8">
				<v-text-field :label="labels['url']"           
				v-model="state.form.url"
				:error_message="state.errors.get('url')"
				@input="checkUrl"
				@blur="checkUrl"
				/>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<v-textarea auto-grow :label="labels['ps']"  
				v-model="state.form.ps"	
				/>
			</v-col>
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