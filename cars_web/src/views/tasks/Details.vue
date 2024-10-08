<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { EDIT_TASK, STORE_TASK, TASK_DETAILS, UPDATE_TASK, STORE_ATTACHMENT, CREATE_TASK,
	STORE_REFERENCE, UPDATE_REFERENCE, REMOVE_REFERENCE } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , tryParseInt, badRequest,
	 onErrors, onSuccess, setValues, is400, isDirty, isValidDate
} from '@/utils'
import { WIDTH, ROUTE_NAMES, POST_TYPES, ACTION_TYPES, ENTITY_TYPES } from '@/consts'

import date from '@/plugins/date'


const name = 'TaskDetailsView'
const TASK = ENTITY_TYPES.TASK
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	action: '',
	model: null,
	form: {
		title: '',
		active: false,
		model: {},
		action: ''
	},
}

const state = reactive(deepClone(initialState))
const labels = computed(() => store.state.tasks.labels)
const query = computed(() => store.state.tasks.query)

const sub_tasks = computed(() => {
	if(state.model) return state.model.subItems
	return []
})

watch(route, init)

onBeforeMount(init)

function init(id) {
	if(!id) {
		id = getIdFromParams()
		if(!id) {
			badRequest('錯誤的id', '錯誤的查詢參數，請回上一頁')
			return
		}
	}
	fetchData(id)
}
function getIdFromParams() {
	if(!route.params) return 0
	return tryParseInt(route.params.id)	
}
function fetchData(id) {
	store.dispatch(TASK_DETAILS, id)
	.then(model => {
		state.action = ''
		state.model = model
	})
	.catch(error => onErrors(error))
}
function back() {
	router.push({ name: ROUTE_NAMES.TASKS_INDEX, query: { ...query.value } })
}
function edit(id) {
	if(!id) id = state.model.id
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_TASK, id)
	.then(model => {
		state.form.model = deepClone(model)

		let deadLine = state.form.model.deadLine
		if(deadLine && isValidDate(deadLine)) {
			if(!(deadLine instanceof Date)) state.form.model.deadLine = new Date(deadLine)
		}

		state.form.active = true
		state.form.title = `${ACTION_TYPES.EDIT['title']}${TASK.title}`
		state.form.action = UPDATE_TASK
	})
	.catch(error => onErrors(error))
}
function onTaskUpdated() {
	state.form = deepClone(initialState.form)
	const id = state.model.id
	state.model = null
	init(id)
}
function onSubmit({ model, removed }) {
	let id = state.form.model.id
	let references = model.references
	const excepts = ['references']
	let dirty = id ? isDirty(model, state.form.model, excepts) : true
	if(dirty) {
		setValues(model, state.form.model)
		store.commit(CLEAR_ERRORS)
		store.dispatch(state.form.action, state.form.model)
		.then(task => {
			references.forEach(item => {
				item.postType = POST_TYPES.TASKS
				item.postId = id ? id : task.id
			})
			storeReferences(references)
			.then(() => {
				removeReferences(removed.reference_ids)
				.then(() => {
					onSuccess()
					onTaskUpdated(id ? id : task.id)
				})
				.catch(error => onErrors(error))
			})
			.catch(error => onErrors(error))
		})
		.catch(error => onErrors(error))
	}else {
		references.forEach(item => {
			item.postType = POST_TYPES.TASKS
			item.postId = id
		})
		storeReferences(references)
		.then(() => {
			removeReferences(removed.reference_ids)
			.then(() => {
				onSuccess()
				onTaskUpdated(id ? id : task.id)
			})
			.catch(error => onErrors(error))
		})
		.catch(error => onErrors(error))
	}
}
function removeReferences(ids) {
	if(!ids.length) return new Promise((resolve) => resolve())

	return new Promise((resolve, reject) => {
		store.commit(CLEAR_ERRORS)
		store.dispatch(REMOVE_REFERENCE, ids.join())
		.then(() => resolve())
		.catch(error => reject(error))
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
				const actionName = model.id ? UPDATE_REFERENCE : STORE_REFERENCE
				store.commit(CLEAR_ERRORS)
				store.dispatch(actionName, model)
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

function storeItems(items) {
	if(!items.length) return new Promise((resolve) => resolve([]))

	return new Promise((resolve, reject) => {
		let results = []
		let attachments = item.files.map()
		items.forEach(item => {
			item.files.forEach(file => {
				attachments.push({
					uuid: item.uuid,
					postType: POST_TYPES.ITEM,
					postId: item.id ? item.id : 0,
					title: item.title,
					description: '',
					file: file
				})
			})
			const actionName = item.id ? UPDATE_ITEM : STORE_ITEM
			store.commit(CLEAR_ERRORS)
			store.dispatch(actionName, model)
			.then(data => {
				if(data) results.push(data.id)
				else results.push(item.id)
				
				if(results.length === items.length) {
					//resolve(results)
					storeAttachments(attachments)
					.then(attachment_results => {
						attachment_results.forEach(result => { 
							let item = items.find(x => x.uuid === result.uuid)
							reference.attachmentId = result.id
						})
						references.forEach(model => {
							const actionName = model.id ? UPDATE_REFERENCE : STORE_REFERENCE
							store.commit(CLEAR_ERRORS)
							store.dispatch(actionName, model)
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
				}
			})
			.catch(error => reject(error))
		})


		
		storeAttachments(attachments)
		.then(attachment_results => {
			attachment_results.forEach(result => { 
				let item = items.find(x => x.uuid === result.uuid)
				reference.attachmentId = result.id
			})
			references.forEach(model => {
				const actionName = model.id ? UPDATE_REFERENCE : STORE_REFERENCE
				store.commit(CLEAR_ERRORS)
				store.dispatch(actionName, model)
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
function onCancel() {
	state.form = { ...initialState.form }
}
function onRemove(id) {
	console.log('remove', id)
}
function addSub() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_TASK)
	.then(model => {
		model.parentId = state.model.id
		state.form.model = deepClone(model)

		let deadLine = state.form.model.deadLine
		if(deadLine && isValidDate(deadLine)) {
			if(!(deadLine instanceof Date)) state.form.model.deadLine = new Date(deadLine)
		}

		state.form.active = true
		state.form.title = `${ACTION_TYPES.CREATE['title']}子任務`
		state.form.action = STORE_TASK
	})
	.catch(error => onErrors(error))
}

</script>

<template>
<div v-if="state.model">	
	<v-row>
		<v-col cols="6">
			<v-row>
				<v-col cols="9">
					<span class="text-h5 font-weight-black mt-3">任務： {{ state.model.title }}</span>					
				</v-col>
				<v-col cols="3">
					<CommonButtonBack size="x-small" class_name="float-left"
					@back="back"	
					/>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12">
					<TaskView :labels="labels" :model="state.model"
					:hide_title="true"
					@edit="edit"		
					/>
				</v-col>
			</v-row>
			
		</v-col>
		<v-col cols="6">
			<v-row>
				<v-col cols="3">
					<span class="text-h5 font-weight-black mt-3">子任務</span>
				</v-col>
				<v-col cols="3">
					
				</v-col>
				<v-col cols="3">
					

				</v-col>
				<v-col cols="3">
					<CommonButtonCreate  class_name="float-right" tooltip="新增子任務" size="x-small"
					@create="addSub"	
					/>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12">
					<TaskView v-for="(subItem, index) in sub_tasks" :labels="labels"
					elevation="16" class="ma-1"
					:model="subItem" @edit="edit(subItem.id)"
					/>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
	<v-dialog persistent v-model="state.form.active" :width="WIDTH.L + 50">
		<v-card v-if="state.form.active" :max-width="WIDTH.L">
			<CommonCardTitle :title="state.form.title" 
			@cancel="onCancel"  
			/>
			<v-card-text>
				<TaskForm :labels="labels" 
				:model="state.form.model"
				@submit="onSubmit"  @remove="onRemove"
				/>
			</v-card-text>
		</v-card>
	</v-dialog>
</div>	
</template>