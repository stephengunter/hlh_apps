<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FETCH_DEPARTMENTS, CREATE_DEPARTMENT, STORE_DEPARTMENT, EDIT_DEPARTMENT, 
	UPDATE_DEPARTMENT, REMOVE_DEPARTMENT, ORDERS_DEPARTMENT, EXPORT_DEPARTMENTS, IMPORT_DEPARTMENTS 
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , activeOptions, copyFromQuery, downloadFile,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, is400
} from '@/utils'
import { WIDTH, ROOT_DEPARTMENT_KEYS } from '@/consts'

const name = 'DepartmentsIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	params: {
		root: ''
	},
	form: {
		title: '',
		active: false,
		model: {},
		action: ''
	}
}


const state = reactive(deepClone(initialState))

const tree = ref(null)

const keys  = computed(() => store.state.departments.keys)
const selectedKey = computed(() => {
	if(isEmptyObject(keys.value)) return ''
	if(!state.params.root) return ''
	return keys.value[state.params.root]
})
const roots  = computed(() => store.state.departments.roots)
const root  = computed(() => selectedKey.value ? roots.value.find(x => x.key === selectedKey.value) : null)

const departments = computed(() => root.value ? store.state.departments.all.filter(c => c.hasParent(root.value.id)) : [])
const parent_options = computed(() => {
	if(!root.value) return []
	let parents = [root.value].concat(departments.value)
	return parents.map(item => ({ value: item.id, text: item.getFullText(parents) }))
})

onBeforeMount(() => {
	loadParams()
	if(isEmptyObject(keys.value)) {
		fetchData()
		return
	}
	checkParams()
})

watch(route, () => {
	loadParams()
	if(isEmptyObject(keys.value)) {
		fetchData()
		return
	}
	checkParams()
})

function loadParams() {
	if(isEmptyObject(route.query)) state.params = deepClone(initialState.params)
	else copyFromQuery(state.params, route.query)
}
function checkParams() {
	if(state.params.root) {
		if(keys.value.hasOwnProperty(state.params.root)) init()
		else badRequest('BAD_REQUEST 錯誤的 root key')
	}else {
		state.params.root = keys.value[ROOT_DEPARTMENT_KEYS.HLH]
		router.push({ path: route.path, query: { ...state.params } })
	}

}
function fetchData() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_DEPARTMENTS)
	.then(() => {
		nextTick(() => {
			checkParams()
		})
	})
	.catch(error => onErrors(error))
}
function init() {
	tree.value.init()
		
}
function edit(id) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_DEPARTMENT, id)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.active = true
		state.form.title = '編輯部門'
		state.form.action = UPDATE_DEPARTMENT
	})
	.catch(error => onErrors(error))
}
function onAdd(parentId) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_DEPARTMENT, parentId)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.active = true
		state.form.title = '新增部門'
		state.form.action = STORE_DEPARTMENT
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = { ...initialState.form }
}
function onSubmit(form) {
	setValues(form, state.form.model)
	if(state.form.action === EXPORT_DEPARTMENTS) {
		exporting()
		return
	}
	if(state.form.action === IMPORT_DEPARTMENTS) {
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
	store.dispatch(REMOVE_DEPARTMENT, id)
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
	store.dispatch(ORDERS_DEPARTMENT, ids)
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
	store.dispatch(EXPORT_DEPARTMENTS, state.form.model)
	.then(data => {
		const blob = new Blob([data])
		downloadFile(blob, 'departments.json')
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
	store.dispatch(IMPORT_DEPARTMENTS, state.form.model)
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
	store.commit(CLEAR_ERRORS)
	state.form.model = { key: '' }
	state.form.title = '匯出部門資料'
	state.form.action = EXPORT_DEPARTMENTS

	state.form.active = true
}
function onImport() {
	store.commit(CLEAR_ERRORS)
	state.form.model = { key: '', files: [] }
	state.form.title = '匯入部門資料'
	state.form.action = IMPORT_DEPARTMENTS

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
			<v-col cols="12">
				<DepartmentTree ref="tree"
				:root="root" :show_key="true"
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
					<AdminForm v-if="state.form.action === EXPORT_DEPARTMENTS || state.form.action === IMPORT_DEPARTMENTS"
					:model="state.form.model" :file_request="state.form.action === IMPORT_DEPARTMENTS"
					:file_accept="['.json']" file_label="上傳檔案"
					@submit="onSubmit"
					/>
					<DepartmentForm v-else
					:model="state.form.model" :parent_options="parent_options"
					@submit="onSubmit"  @remove="onRemove"
					/>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>