<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ENTITY_TYPES, WIDTH, ACTION_TYPES } from '@/consts'
import { INIT_APPS, FETCH_APPS, CREATE_APP, STORE_APP, EDIT_APP, UPDATE_APP } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile,
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
	}
}
const state = reactive(deepClone(initialState))
const query = computed(() => store.state.apps.query)
const labels = computed(() => store.state.apps.labels)
const type_options = computed(() => store.state.apps.type_options)
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
		state.form.width = WIDTH.M
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
	.catch(error => {
		let data = resolveErrorData(error)
		if(data && data.errors) store.commit(SET_ERRORS, data.errors)
		else onErrors(error)
	})
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
	.catch(error => {
		let data = resolveErrorData(error)
		if(data && data.errors) store.commit(SET_ERRORS, data.errors)
		else onErrors(error)
	})
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
				:list="list" :labels="labels"
				@edit="edit"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="state.form.width + 50">
			<v-card v-if="state.form.active" :max-width="state.form.width">
				<CommonCardTitle :title="state.form.title"
				@cancel="onCancel"  
				/>
				<v-card-text v-if="state.form.active">
					<AppForm :model="state.form.model" 
					:labels="labels" :type_options="type_options"
					@submit="onSubmit"
					/>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
