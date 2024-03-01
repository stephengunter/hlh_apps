<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FETCH_DEPARTMENTS, FETCH_JOBS, CREATE_JOB, 
	UPDATE_JOB, STORE_JOB, JOB_DETAILS, EDIT_JOB } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , activeOptions, copyFromQuery,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest
} from '@/utils'
import { WIDTH, ROOT_DEPARTMENT_KEYS, ROUTE_NAMES, ENTITY_TYPES, ACTION_TITLES } from '@/consts'

const name = 'JobsView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	params: {
		root: ''
	},
	form: {
		active: false,
		title: '',
		model: {},
		department: null,
		jobTitle: null
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
const root  = computed(() => {
	const roots = store.state.departments.roots
	if(selectedKey.value) return roots.find(x => x.key === selectedKey.value)
	else return null
})

const departments = computed(() => root.value ? store.state.departments.all.filter(c => c.hasParent(root.value.id)) : [])

const job_titles = computed(() => store.state.departments.job_titles)
const roleOptions = computed(() => store.state.jobs.role_options)


onBeforeMount(() => {
	loadParams()
	if(isEmptyObject(keys.value)) {
		fetchDepartments()
		return
	}
	checkParams()
})

watch(route, () => {
	loadParams()
	if(isEmptyObject(keys.value)) {
		fetchDepartments()
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
		if(keys.value.hasOwnProperty(state.params.root)) fetchData()
		else badRequest('BAD_REQUEST 錯誤的 root key')
	}else {
		state.params.root = keys.value[ROOT_DEPARTMENT_KEYS.HLH]
		router.push({ path: route.path, query: { ...state.params } })
	}

}
function fetchDepartments() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_DEPARTMENTS)
	.then(() => {
		nextTick(() => {
			checkParams()
		})
	})
	.catch(error => onErrors(error))
}
function fetchData() {
	const depIds = departments.value.map(d => d.id).join()
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_JOBS, { depIds })
	.then(() => {
		nextTick(init)
	})
	.catch(error => onErrors(error))
}

function init() {
	tree.value.init()		
}
function findDepartment(id) {
	return departments.value.find(x => x.id === id)
}
function edit(id) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_JOB, id)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onAdd(depId) {
	const department = findDepartment(depId)
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_JOB)
	.then(model => {
		if(state.form.jobTitle) state.form.model.jobTitleId = state.form.jobTitle.id
		state.form.model = deepClone(model)
		state.form.model.departmentId = department.id
		state.form.title = `新增${ENTITY_TYPES.JOB.title}`
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = { ...initialState.form }
}
function onSubmit(form) {
	setValues(form, state.form.model)
	state.form.jobTitle = job_titles.value.find(item => item.id === form.jobTitleId)

	const action = form.id ? UPDATE_JOB : STORE_JOB
	store.dispatch(action, state.form.model)
	.then(() => {
		fetchDepartments()
		onCancel()
		onSuccess()
	})
	.catch(error => {
		let errors = resolveErrorData(error)
		if(errors) store.commit(SET_ERRORS, Object.values(errors))
		else onErrors(error)
	})
}

function details(id) {
	router.push({ name: ROUTE_NAMES.JOB_DETAILS, params: { id } })
}
function onRemove() {
	const id = state.form.model.id
	store.dispatch(REMOVE_DEPARTMENT, id)
	.then(() => {
		fetchDepartments()
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
		fetchDepartments()
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
				<JobTree ref="tree"
				:root="root" :allow_edit="false"
				@add="onAdd" 
				@orders="onOrders" @details="details"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="WIDTH.M + 50">
			<v-card :max-width="WIDTH.M">
				<CommonCardTitle :title="state.form.title" 
				@cancel="onCancel"
				/>
				<v-card-text>
					<JobForm v-if="state.form.active"
					:model="state.form.model" :departments="departments"
					:job_titles="job_titles" :role_options="roleOptions"
					@submit="onSubmit" @cancel="onCancel"
					@remove="onRemove"
					/>
				</v-card-text>
			</v-card>
			
		</v-dialog>
	</div>
</template>