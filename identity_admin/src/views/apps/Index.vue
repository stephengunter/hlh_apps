<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ENTITY_TYPES, WIDTH, ACTION_TYPES, WARNING, ERRORS } from '@/consts'
import { INIT_APPS, FETCH_APPS, CREATE_APP, STORE_APP, EDIT_APP, UPDATE_APP, 
	RESET_APP_CLIENT_SECRET, REMOVE_APP 
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, 
	resolveErrorData
} from '@/utils'


const name = 'AppsIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const APP = ENTITY_TYPES.APP
const initialState = {
	form: {
		id: '',
		title: '',
		active: false,
		model: {
		},
		action: '',
		width: WIDTH.L
	},
	reset_pw: {
		id: ''
	}
}
const state = reactive(deepClone(initialState))
const query = computed(() => store.state.apps.query)
const labels = computed(() => store.state.apps.labels)
const type_options = computed(() => store.state.apps.type_options)
const role_options = computed(() => store.state.apps.role_options)
const api_options = computed(() => store.state.apps.api_options)
const list = computed(() => store.state.apps.list)

const head = ref(null)

onBeforeMount(() => {
	if(!isEmptyObject(query.value)) init()
	else {
		store.dispatch(INIT_APPS)
		.then(() => {
			nextTick(init)
		})
		.catch(error => onErrors(error))
	}
})
function init() {
	head.value.init()
}
function fetchData(query) {
	if(!query) query = head.value.getQuery()
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_APPS, query)
	.catch(error => onErrors(error))
}
function onCreate(query) {
	state.form.title = `${ACTION_TYPES.CREATE.title}${APP.title}`
	store.dispatch(CREATE_APP)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.model.type = query.type
		state.form.action = STORE_APP
		state.form.width = WIDTH.L
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = deepClone(initialState.form)
}
function edit(id) {
	state.form.id = id
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_APP, id)
	.then(model => {
		state.form.title = `${ACTION_TYPES.EDIT.title}${APP.title}`,
		state.form.model = deepClone(model)
		state.form.actions = []

		state.form.action = UPDATE_APP
		state.form.width = WIDTH.L
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onSubmit(form) {
	if(state.form.id) updateApp(form)
	else storeApp(form)
	
}
function storeApp(form) {
	setValues(form, state.form.model)
	store.dispatch(state.form.action, state.form.model)
	.then(() => {
		onCancel()
		onSuccess()
		fetchData()
	})
	.catch(error => onSubmitError(error))
}
function updateApp(form) {
	let model = state.form.model
	let id = state.form.id
	setValues(form, model)
	store.dispatch(state.form.action, { id, model })
	.then(() => {
		onCancel()
		onSuccess()
		fetchData()
	})
	.catch(error => onSubmitError(error))
}
function onSubmitError(error) {
	let data = resolveErrorData(error)
	if(data && data.errors) store.commit(SET_ERRORS, data.errors)
	else onErrors(error)
}
function confirmResetClientSecret(id) {
	state.reset_pw.id = id
	let confirm = {
		type: WARNING, 
		title: '確定要重設密碼?', 
		text: '', 
		ok:'確定', 
		cancel: '取消', 
		on_ok: resetClientSecret, 
		on_cancel: null, 
		max_width: 0 
	}
	showConfirm(confirm)
}
function resetClientSecret() {
	let id = state.reset_pw.id
	store.dispatch(RESET_APP_CLIENT_SECRET, id)
	.then(() => {
		hideConfirm()
		onCancel()
		onSuccess()

		fetchData()
	})
	.catch(error => onSubmitError(error))
}
function confirmRemove() {
	let confirm = {
		type: ERRORS, 
		title: '確定要刪除?', 
		text: '', 
		ok:'確定', 
		cancel: '取消', 
		on_ok: remove, 
		on_cancel: null, 
		max_width: 0 
	}
	showConfirm(confirm)
}
function remove() {
	let id = state.form.id
	store.dispatch(REMOVE_APP, id)
	.then(() => {
		hideConfirm()
		onCancel()
		onSuccess()

		fetchData()
	})
	.catch(error => onSubmitError(error))
}
</script>

<template>
	<div>
		<AppHead ref="head" :type_options="type_options"
		:query="query" :labels="labels"
		@submit="fetchData" @create="onCreate"
		/>
		<v-row dense>
			<v-col cols="12">
				<AppTable 
				:list="list" :roles="role_options" :labels="labels"
				@edit="edit" @reset-pw="confirmResetClientSecret"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="state.form.width + 50">
			<v-card v-if="state.form.active" :max-width="state.form.width">
				<CommonCardTitle :title="state.form.title"
				@cancel="onCancel"  
				/>
				<v-card-text v-if="state.form.active">
					<AppForm :id="state.form.id" :model="state.form.model" 
					:api_options="api_options" :role_options="role_options"
					:labels="labels" :type_options="type_options"
					@submit="onSubmit" @remove="confirmRemove"
					/>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
