<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, statusText, deepClone, isEmptyObject } from '@/utils'

const name = 'JobForm'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	departments: {
		type: Array,
		default: () => []
	},
	role_options: {
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
		departmentId: null,
		role: 0,
		tel: '',
		subTel: '',
		ps: '',
      active: true
   }
}
const state = reactive(deepClone(initialState))
const departmentOptions = computed(() => props.departments.map(item => ({ value: item.id, text: item.title })))
const title = computed(() => props.model.id ? `${ACTION_TITLES.EDIT}${entity.title}` : `${ACTION_TITLES.CREATE}${entity.title}`)
const rules = computed(() => {
	return {
		title: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['title']), required)
		}
	}
})

const labels = {
	'title': '職稱',
	'department': ENTITY_TYPES.DEPARTMENT.title,
	'role': '角色',
	'tel': '專線',
	'subTel': '分機',
	'ps': '備註',
	'active': '狀態'
}
const entity = ENTITY_TYPES.JOB
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
	console.log(departmentOptions.value)
}

function cancel() {
	emit('cancel')
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
	<div>
		<v-card :max-width="WIDTH.M">
			<v-toolbar>
				<v-card-title>
					<span class="text-h5 font-weight-black">{{ title }}</span>
					<span v-if="props.model.id" class="headline ml-3">Id : {{ props.model.id }} </span>           
				</v-card-title>
				<template v-slot:append>
					<v-tooltip :text="ACTION_TITLES.CANCEL">
						<template v-slot:activator="{ props }">
							<v-btn v-bind="props" icon="mdi-window-close" 
							@click.prevent="cancel" 
							/>
						</template>
					</v-tooltip>
				</template>
			</v-toolbar>
			<v-card-text>
				<v-container>
					<form @submit.prevent="onSubmit" @input="onInputChanged">
						<v-row>
							<v-col cols="12">
								<v-select :label="labels['department']"  item-title="text"
								:items="departmentOptions" v-model="state.form.departmentId"
								/>
							</v-col>
							
							<v-col cols="12">
								<v-text-field :label="labels['title']"           
								v-model="state.form.title"
								:error-messages="v$.title.$errors.map(e => e.$message)"                     
								@input="v$.title.$touch"
								@blur="v$.title.$touch"
								/>
							</v-col>
							<v-col cols="12">
								<v-select :label="labels['role']"  item-title="text"
								:items="role_options" v-model="state.form.role"
								/>
							</v-col>
							<v-col cols="6">
								<v-text-field :label="labels['tel']"           
								v-model="state.form.tel"
								/>
							</v-col>
							<v-col cols="6">
								<v-text-field :label="labels['subTel']"           
								v-model="state.form.subTel"
								/>
							</v-col>
							<v-col cols="12">
								<v-textarea auto-grow :label="labels['ps']"  
								v-model="state.form.ps"	
								/>
							</v-col>
							<v-col cols="6">
								<v-switch
								v-model="state.form.active"
								color="success" :label="status_text"
								/>
							</v-col>
							<v-col cols="6">
								
							</v-col>
						</v-row>
						<v-col cols="12">
							<CoreErrorList />
						</v-col> 
						<v-row>
							<v-col cols="6">
								<v-btn type="submit" color="success">
								{{ ACTION_TITLES.SAVE }}
								</v-btn>
							</v-col>
							<v-col cols="6" class="text-right">
								<v-btn v-if="canRemove" @click.prevent="onRemove" color="error">
									{{ ACTION_TITLES.REMOVE }}
								</v-btn>
							</v-col>
						</v-row>
					</form>
				</v-container>
			</v-card-text>
		</v-card>
   </div>
</template>