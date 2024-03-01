<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FETCH_LOCATIONS, CREATE_LOCATION, STORE_LOCATION, EDIT_LOCATION, 
	UPDATE_LOCATION, REMOVE_LOCATION, ORDERS_LOCATION, EXPORT_LOCATION, IMPORT_LOCATION 
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, is400
} from '@/utils'
import { WIDTH, ENTITY_TYPES } from '@/consts'

const name = 'LocationsIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	form: {
		title: '',
		active: false,
		model: {},
		action: ''
	}
}
const state = reactive(deepClone(initialState))
const LOCATION = ENTITY_TYPES.LOCATION

const tree_AB = ref(null)
const tree_CB = ref(null)
const locations = computed(() => store.state.locations.all)
const roots  = computed(() => store.state.locations.roots)
const parent_options = computed(() => locations.value.map(item => ({ value: item.id, text: item.getFullText(locations.value) })))

onBeforeMount(fetchData)

function fetchData() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_LOCATIONS)
	.then(() => {
		nextTick(init)
	})
	.catch(error => onErrors(error))
}
function init() {
	tree_AB.value.init()
	tree_CB.value.init()
}
function getRoot(key) {
	if(roots.value && roots.value.length) return  roots.value.find(item => item.key === key)
}
function edit(id) {	
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_LOCATION, id)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.active = true
		state.form.title = `編輯${LOCATION.title}`
		state.form.action = UPDATE_LOCATION
	})
	.catch(error => onErrors(error))
}
function onAdd(parentId) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_LOCATION, parentId)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.active = true
		state.form.title = `新增${LOCATION.title}`
		state.form.action = STORE_LOCATION
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = { ...initialState.form }
}
function onSubmit(form) {
	setValues(form, state.form.model)
	if(state.form.action === EXPORT_LOCATION) {
		exporting()
		return
	}
	if(state.form.action === IMPORT_LOCATION) {
		importing()
		return
	}

	store.dispatch(state.form.action, state.form.model)
	.then(() => {
		fetchData()
		onSuccess()
		onCancel()
	})
	.catch(error => handleSubmitError(error))
}
function onRemove() {
	const id = state.form.model.id
	store.dispatch(REMOVE_LOCATION, id)
	.then(() => {
		fetchData()
		onCancel()
		onSuccess()
	})
	.catch(error => {
		let errors = resolveErrorData(error)
		if(errors) store.commit(SET_ERRORS, Object.values(errors))
		else onErrors(error)
	})
}

function onOrders(ids) {
	store.dispatch(ORDERS_LOCATION, ids)
	.then(() => {
		fetchData()
		onSuccess()
	})
	.catch(error => {
		let errors = resolveErrorData(error)
		if(errors) store.commit(SET_ERRORS, Object.values(errors))
		else onErrors(error)
	})
}
function exporting() {
	store.dispatch(EXPORT_LOCATION, state.form.model)
	.then(data => {
		downloadFile(data, 'locations.json')
		onCancel()
	})
	.catch(error => {
		if(is400(error)) {
			const fileReader = new FileReader()
			fileReader.onloadend = () => {
				let errors = JSON.parse(fileReader.result)
				if(errors) store.commit(SET_ERRORS, Object.values(errors))
				else onErrors(error)
			}
			fileReader.readAsText(error.data)
		}else onErrors(error)
	})
}
function importing() {
	store.dispatch(IMPORT_LOCATION, state.form.model)
	.then(() => {
		onCancel()
		fetchData()
		onSuccess('匯入成功')
	})
	.catch(error => handleSubmitError(error))
}

function handleSubmitError(error) {
	if(is400(error)) {
		let errors = resolveErrorData(error)
		if(errors) store.commit(SET_ERRORS, Object.values(errors))
		else onErrors(error)
	}else onErrors(error)
}

function onExport() {
	state.form.model = { key: '' }
	state.form.title = '匯出部門資料'
	state.form.action = EXPORT_LOCATION

	state.form.active = true
}
function onImport() {
	state.form.model = { key: '', files: [] }
	state.form.title = '匯入部門資料'
	state.form.action = IMPORT_LOCATION

	state.form.active = true
}
</script>

<template>
	<div>
		<v-row dense>
			<v-col cols="12">
				<v-menu>
					<template v-slot:activator="{ props }">
						<v-btn class="float-right" icon="mdi-content-save" v-bind="props" size="small" color="info"
						/>
					</template>
					<v-list min-width="160"  max-width="300">   
						<v-list-item title="匯出" prepend-icon="mdi-export"
						@click.prevent="onExport"
						/>
						<v-list-item title="匯入" prepend-icon="mdi-import"
						@click.prevent="onImport"
						/>
					</v-list> 
				</v-menu>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="6">
				<LocationTree ref="tree_AB"
				:root="getRoot('AB')"
				@select="edit" @add="onAdd" @orders="onOrders"
				/>
			</v-col>
			<v-col cols="6">
				<LocationTree ref="tree_CB"
				:root="getRoot('CB')"
				@select="edit" @add="onAdd" @orders="onOrders"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="WIDTH.S + 50">
			<v-card v-if="state.form.active" :max-width="WIDTH.S">
				<CommonCardTitle :title="state.form.title" 
				@cancel="onCancel"  
				/>
				<v-card-text>
					<AdminForm v-if="state.form.action === EXPORT_LOCATION || state.form.action === IMPORT_LOCATION"
					:model="state.form.model" :file_request="state.form.action === IMPORT_LOCATION"
					:file_accept="['.json']" file_label="上傳檔案"
					@submit="onSubmit"
					/>
					<LocationForm v-else
					:model="state.form.model" :parent_options="parent_options"
					@submit="onSubmit"  @remove="onRemove"
					/>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>