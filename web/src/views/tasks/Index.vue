<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { STORE_ATTACHMENT, STORE_REFERENCE, FETCH_TASKS, CREATE_TASK, STORE_TASK, TASK_DETAILS, UPDATE_TASK } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone, resolveErrorData, is400,
	 onErrors, onSuccess, setValues
} from '@/utils'
import { WIDTH, ROUTE_NAMES, ACTION_TYPES, ENTITY_TYPES, POST_TYPES } from '@/consts'

const name = 'TaskIndexView'
const TASK = ENTITY_TYPES.TASK
const store = useStore()
const route = useRoute()
const router = useRouter()

const head = ref(null)

const initialState = {
	form: {
		title: '',
		action: '',
		active: false,
		model: {}		
	}
}

const state = reactive(deepClone(initialState))
const labels = computed(() => store.state.tasks.labels)
const pagedList = computed(() => store.state.tasks.pagedList)

watch(route, init)

onMounted(init)

function init() {
	head.value.init()
}
function onQueryChanged(query) {
	fetchTasks(query)
}
function onOptionChanged(option) {
	head.value.setPageOption(option)
}
function fetchTasks(query) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_TASKS, query)
	.then(() => {
		
	})
	.catch(error => onErrors(error))
}
function create() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_TASK)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.active = true
		state.form.title = `${ACTION_TYPES.CREATE['title']}${TASK.title}`
		state.form.action = STORE_TASK
	})
	.catch(error => onErrors(error))
}
function onSubmit({ model }) {
	setValues(model, state.form.model)
	store.commit(CLEAR_ERRORS)
	store.dispatch(state.form.action, state.form.model)
	.then(task => {
		onSelect(task.id)
		state.form = deepClone(initialState.form)
	})
	.catch(error => {
		if(is400(error)) {
			const data = resolveErrorData(error)
			if(data) store.commit(SET_ERRORS, Object.values(data))
			else onErrors(error)
		}else onErrors(error)
	})
	
}

function onTaskStoreSuccess() {
	state.form = deepClone(initialState.form)
	fetchTasks(head.value.getQuery())
}
function onRemove() {
	const id = state.form.model.id
	console.log('onRemove', id)
}

function onCancel() {
	state.form = { ...initialState.form }
}
function onSelect(id) {
	router.push({ name: ROUTE_NAMES.TASK_DETAILS, params: { id } })
}

</script>

<template>
<div>
   <TaskHead ref="head" 
	@submit="onQueryChanged" @add="create"
	/>
	<v-row dense>
		<v-col cols="12">
			<TaskTable v-if="!isEmptyObject(pagedList)" 
			:model="pagedList" 
			@select="onSelect"
			@options_changed="onOptionChanged"
			/>
		</v-col>
	</v-row>
	<v-row class="mt-1">
		<v-col cols="12">
			
		</v-col>
   </v-row>
	<v-dialog persistent v-model="state.form.active" :width="WIDTH.L + 50">
		<v-card v-if="state.form.active" :max-width="WIDTH.L">
			<CommonCardTitle :title="state.form.title" 
			@cancel="onCancel"  
			/>
			<v-card-text>
				<TaskRootForm :labels="labels"
				:model="state.form.model"
				@submit="onSubmit" @remove="onRemove"
				/>
				
			</v-card-text>
		</v-card>
	</v-dialog>
</div>
</template>