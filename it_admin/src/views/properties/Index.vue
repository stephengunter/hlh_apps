<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ENTITY_TYPES, WIDTH, ACTION_TYPES, ACTION_TITLES, ERRORS } from '@/consts'
import { INIT_PROPERTIES, FETCH_PROPERTIES, UPLOAD_PROPERTIES, IMPORT_PROPERTIES, 
	EDIT_PROPERTY, UPDATE_PROPERTY, REPORT_PROPERTIES,
	REMOVE_PROPERTY} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, now,
	resolveErrorData
} from '@/utils'


const name = 'PropertiesIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const PROPERTY = ENTITY_TYPES.PROPERTY
const initialState = {
	active: true,
	form: {
		id: '',
		title: '',
		model: null,
		active: false,
		labels: null,
		action: '',
		width: WIDTH.L
	},
	remove: 0,
	deprecated: false,
	category: null,
	category_tree: {
		title: '',
      active: false,
		width: WIDTH.L
   },
}
const head = ref(null)
const state = reactive(deepClone(initialState))
const query = computed(() => store.state.properties.query)
const labels = computed(() => store.state.properties.labels)
const type_options = computed(() => store.state.properties.type_options)
const device_options = computed(() => store.state.properties.device_options)
const groupViews = computed(() => store.state.properties.groupViews)
const categories = computed(() => store.state.properties.categories)
const locations = computed(() => store.state.properties.locations)

const pagedList = computed(() => store.state.properties.pagedList)
const users = computed(() => store.getters.users)


onBeforeMount(() => {
	if(!isEmptyObject(labels.value)) {
		nextTick(init)
	}
	else {
		store.dispatch(INIT_PROPERTIES)
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
	console.log('query', query)
	if(!query) query = head.value.getQuery()
	state.deprecated = query.deprecated
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_PROPERTIES, query)
	.catch(error => onErrors(error))
}

function edit(item) {
	let id = item.id
	store.dispatch(EDIT_PROPERTY, id)
	.then(model => {
		state.form.id = id
		state.form.model = model.property
		state.form.form = model.form
		state.form.title = `編輯資訊財產`
		state.form.width = WIDTH.L
		state.form.action = UPDATE_PROPERTY
		state.form.active = true
		console.log(model)
		// hideConfirm()
		// onSuccess()

		// fetchData()
	})
	.catch(error => onSubmitError(error))
}
function onUpdate(form) {
	const id = state.form.id
	store.dispatch(UPDATE_PROPERTY, { id, model: form })
	.then(() => {
		cancelForm()
		onSuccess()
		fetchData()
	})
	.catch(error => onSubmitError(error))
}
function cancelForm() {
	state.form = deepClone(initialState.form)
}
function report(query) {
	const location = locations.value.find(x => x.id == query.location)
	store.dispatch(REPORT_PROPERTIES, query)
	.then(data => {
		
		const blob = new Blob([data])
		downloadFile(blob, `${location.title}資訊財產清單.xlsx`)
	})
	.catch(error => onErrors(error))
}
function onUpload() {
	state.form.title = `匯入資訊財產`
	state.form.width = WIDTH.L
	state.form.action = UPLOAD_PROPERTIES
	state.form.active = true
}
function confirmRemove(item) {
	state.remove = item.id
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
function onRemove(item) {
	console.log('onRemove', item)
	// if(state.form.action === IMPORT_PROPERTIES) {
	// 	const index = state.form.model.allItems.findIndex(x => x.uid === item.uid)
	// 	state.form.model.allItems.splice(index, 1)
	// }
	
}
function remove() {
	let id = state.remove
	store.dispatch(REMOVE_PROPERTY, id)
	.then(() => {
		hideConfirm()
		onSuccess()

		fetchData()
	})
	.catch(error => onSubmitError(error))
}
function importProps(list) {
	store.dispatch(IMPORT_PROPERTIES, { list })
	.then(() => {
		cancelForm()
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
function onOptionChanged(option) {
	head.value.setPageOption(option)
}
</script>

<template>
	<div>
		<PropertyHead ref="head" :type_options="type_options" :device_options="device_options"
		:query="query" :labels="labels" :groupViews="groupViews"
		:categories="categories" :locations="locations" 
		@submit="fetchData" @report="report" @upload="onUpload"
		/>
		<v-row dense>
			<v-col cols="12">
				<PropertyTable :labels="labels" :deprecated="state.deprecated"
				:locations="locations" :users="users" :can_edit="true" :can_remove="false"
				:model="pagedList" :categories="categories"
				@remove="confirmRemove" @edit="edit"
				@options_changed="onOptionChanged"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="state.form.width + 50">
			<v-card v-if="state.form.active" :max-width="state.form.width">
				<CommonCardTitle :title="state.form.title"
				@cancel="cancelForm"  
				/>
				<v-card-text>
					<PropertyForm v-if="state.form.action === UPDATE_PROPERTY"
					:id="state.form.id" :model="state.form.model" :labels="labels" 
					:categories="categories" :locations="locations"
					@submit="onUpdate"
					/>
					<PropertyUploadForm v-if="state.form.action === UPLOAD_PROPERTIES"
					:labels="labels" :type_options="type_options"
					@submit="importProps"
					/>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
