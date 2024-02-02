<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FETCH_DEPARTMENTS, CREATE_DEPARTMENT, STORE_DEPARTMENT, EDIT_DEPARTMENT, 
	UPDATE_DEPARTMENT, REMOVE_DEPARTMENT, ORDERS_DEPARTMENT 
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , activeOptions, copyFromQuery,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest
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
		active: false,
		model: {}
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
	})
	.catch(error => onErrors(error))
}
function onAdd(parentId) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_DEPARTMENT, parentId)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = { ...initialState.form }
}
function onSubmit(form) {
	setValues(form, state.form.model)
	const action = form.id ? UPDATE_DEPARTMENT : STORE_DEPARTMENT
	store.dispatch(action, state.form.model)
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
</script>

<template>
	<div>
		<v-row>
			<v-col cols="12">
				<DepartmentTree ref="tree"
				:root="root"
				@select="edit" @add="onAdd" @orders="onOrders"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="WIDTH.S + 50">
			<DepartmentForm v-if="state.form.active"
			:model="state.form.model" :parent_options="parent_options"
			@submit="onSubmit" @cancel="onCancel"
			@remove="onRemove"
			/>
		</v-dialog>
	</div>
</template>