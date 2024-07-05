<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { EDIT_TASK, STORE_TASK, TASK_DETAILS, UPDATE_TASK, STORE_ATTACHMENT, STORE_REFERENCE } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , tryParseInt, badRequest,
	 onErrors, onSuccess, setValues, is400, dateToText, toYearTW,
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

watch(route, init)

onBeforeMount(init)

function init() {
	const id = getIdFromParams()
	if(!id) {
		badRequest('錯誤的id', '錯誤的查詢參數，請回上一頁')
		return
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
function edit() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_TASK, state.model.id)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.active = true
		state.form.title = `${ACTION_TYPES.EDIT['title']}${TASK.title}`
		state.form.action = UPDATE_TASK
	})
	.catch(error => onErrors(error))
}
function onTaskUpdated() {
	state.form = deepClone(initialState.form)
}
function onSubmit(model) {
	setValues(model, state.form.model)
	storeReferences(state.form.model.references)
	.then(reference_results => {
		console.log(reference_results)
		state.form.model.references = reference_results
		// store.commit(CLEAR_ERRORS)
		// store.dispatch(STORE_TASK, state.form.model)
		// .then(data => console.log(data))
		// .catch(error => onErrors(error))
	})
	.catch(error => onErrors(error))
	
}
function storeReferences(references) {
	if(!references.length) return new Promise((resolve, reject) => resolve([]))

	return new Promise((resolve, reject) => {
		let attachments = []
		let models = []
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
			models.push({
				uuid: reference.uuid,
				postType: POST_TYPES.TASKS,
				postId: state.model.id,
				title: reference.title,
				url: reference.url,
				attachmentId: 0
			})
		})
		let results = []
		storeAttachments(attachments)
		.then(attachment_results => {
			attachment_results.forEach(result => { 
				let model = models.find(item => item.uuid === result.uuid)
				model.attachmentId = result.id
			})
			models.forEach(model => {
				store.commit(CLEAR_ERRORS)
				store.dispatch(STORE_REFERENCE, model)
				.then(data => {
					results.push(data)
					if(results.length === models.length) {
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
	if(!attachments.length) return new Promise((resolve, reject) => resolve([]))
	return new Promise((resolve, reject) => {
		let results = []
		attachments.forEach(attachment => {
			store.commit(CLEAR_ERRORS)
			store.dispatch(STORE_ATTACHMENT, attachment)
			.then(model => {
				attachment.id = model.id
				results.push(attachment)
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

</script>

<template>
<div>	
	<v-row >
		<v-col cols="12">
			<v-card v-if="state.model">
				<CommonCardTitle :id="state.model.id" :show_id="false"
				tooltip="編輯" :can_cancel="false"
				@edit="edit"
				/>
				<v-card-text>
					<TaskView :labels="labels"
					:model="state.model"
					/>
					
				</v-card-text>
			</v-card>
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
				@submit="onSubmit"  @remove="onRemove"
				/>
				
			</v-card-text>
		</v-card>
	</v-dialog>
</div>	
</template>