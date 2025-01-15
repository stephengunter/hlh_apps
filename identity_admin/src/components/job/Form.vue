<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, randomItem, statusText, deepClone, isEmptyObject } from '@/utils'

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
	job_titles: {
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
		jobTitleId: 0,
		departmentId: null,
		role: 0,
		tel: '',
		subTel: '',
		ps: '',
      active: true
   },
	errors: {
		'title': false
	}
}
const state = reactive(deepClone(initialState))
const departmentOptions = computed(() => props.departments.map(item => ({ value: item.id, text: item.title })))
const titleOptions = computed(() => props.job_titles.map(item => ({ value: item.id, text: item.title })))
const title = computed(() => props.model.id ? `${ACTION_TITLES.EDIT}${entity.title}` : `${ACTION_TITLES.CREATE}${entity.title}`)
const rules = computed(() => {
	return {
		
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
	if(!state.form.jobTitleId) {
		state.form.jobTitleId = randomItem(props.job_titles).id
	}
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
				<v-select :label="labels['department']"  item-title="text"
				:items="departmentOptions" v-model="state.form.departmentId"
				/>
				<v-select :label="labels['role']"  item-title="text"
				:items="role_options" v-model="state.form.role"
				/>
				<v-text-field :label="labels['tel']"           
				v-model="state.form.tel"
				/>
			</v-col>
			
			<v-col cols="6">
				<span v-if="state.errors.title" class="text-red ml-2">{{ `*${VALIDATE_MESSAGES.MUST_SELECT(labels['title'])}`  }}</span>
				<v-autocomplete :label="labels['title']"
				v-model="state.form.jobTitleId"
				:items="titleOptions" item-title="text"
				/>
				<v-switch
				v-model="state.form.active"
				color="success" :label="status_text"
				/>
				<v-text-field :label="labels['subTel']"           
				v-model="state.form.subTel"
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