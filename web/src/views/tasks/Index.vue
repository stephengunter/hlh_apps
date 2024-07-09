<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { STORE_ATTACHMENT, STORE_REFERENCE, FETCH_TASKS, CREATE_TASK, STORE_TASK, TASK_DETAILS, UPDATE_TASK } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone,
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
function onSubmit(model) {
	console.log('model', model)
	let references = model.references
	console.log('references', references)
	setValues(model, state.form.model)


	console.log('state.form.action', state.form.action)
	store.commit(CLEAR_ERRORS)
	store.dispatch(state.form.action, state.form.model)
	.then(task => {
		let id = task.id
		references.forEach(item => {
			item.postType = POST_TYPES.TASKS
			item.postId = id
		})
		storeReferences(references)
		.then(onTaskStoreSuccess)
		.catch(error => onErrors(error))
		// model.uuid = attachment.uuid
		// //attachment.id = model.id
		// results.push(model)
		// if(results.length === attachments.length) {
		// 	resolve(results)
		// }
	})
	.catch(error => {
		console.log(error)
	})
	
}
function storeReferences(references) {
	if(!references.length) return new Promise((resolve) => resolve([]))

	return new Promise((resolve, reject) => {
		let attachments = []
		references.forEach(reference => {
			if(reference.file) {
				attachments.push({
					uuid: reference.uuid,
					postType: POST_TYPES.REFERENCE,
					postId: reference.id ? reference.id : 0,
					title: reference.title,
					description: '',
					file: reference.file
				})
			}
		})
		let results = []
		storeAttachments(attachments)
		.then(attachment_results => {
			attachment_results.forEach(result => { 
				let reference = references.find(item => item.uuid === result.uuid)
				reference.attachmentId = result.id
			})
			references.forEach(model => {
				store.commit(CLEAR_ERRORS)
				store.dispatch(STORE_REFERENCE, model)
				.then(data => {
					results.push(data)
					if(results.length === references.length) {
						resolve(results)
					}
				})
				.catch(error => reject(error))
			})
		})
		.catch(error => reject(error))
		
	})
}

function storeAttachments(attachments) {
	if(!attachments.length) return new Promise((resolve) => resolve([]))
	return new Promise((resolve, reject) => {
		let results = []
		attachments.forEach(attachment => {
			store.commit(CLEAR_ERRORS)
			store.dispatch(STORE_ATTACHMENT, attachment)
			.then(model => {
				model.uuid = attachment.uuid
				results.push(model)
				if(results.length === attachments.length) {
					resolve(results)
				}
			})
			.catch(error => reject(error))
		})
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