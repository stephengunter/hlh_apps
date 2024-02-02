<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FETCH_USERS, 
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , activeOptions, copyFromQuery,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest
} from '@/utils'
import { WIDTH } from '@/consts'

const name = 'UsersIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	params: {
		active: true,
		role: '',
		keyword: '',
		page: -1,
		pageSize: 10
	},
	form: {
		active: false,
		model: {}
	}
}

const active_options = activeOptions
const pagedList = computed(() => store.state.users.pagedList)
const roleOptions = computed(() => store.state.users.roleOptions)

const state = reactive(deepClone(initialState))

onBeforeMount(() => {
	loadParams()
	fetchData()
	// if(isEmptyObject(keys.value)) {
	// 	fetchData()
	// 	return
	// }
	// checkParams()
})

watch(route, () => {
	loadParams()
	fetchData()
	// if(isEmptyObject(keys.value)) {
	// 	fetchData()
	// 	return
	// }
	// checkParams()
})

function loadParams() {
	if(isEmptyObject(route.query)) state.params = deepClone(initialState.params)
	else copyFromQuery(state.params, route.query)
}
// function checkParams() {
// 	if(state.params.root) {
// 		if(keys.value.hasOwnProperty(state.params.root)) init()
// 		else badRequest('BAD_REQUEST 錯誤的 root key')
// 	}else {
// 		state.params.root = keys.value[ROOT_USER_KEYS.HLH]
// 		router.push({ path: route.path, query: { ...state.params } })
// 	}

// }
function fetchData() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_USERS, state.params)
	.then(model => {
		if(model.request) setValues(model.request, state.params)
		nextTick(() => {
			
		})
	})
	.catch(error => onErrors(error))
}
function onParamsChanged() {
	router.push({ path: route.path, query: { ...state.params } })
}
function init() {
	tree.value.init()
		
}
function edit(id) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_USER, id)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onAdd() {
	console.log('onAdd')
	return
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_USER, parentId)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onImport() {
	console.log('onImport')
	return
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_USER, parentId)
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
	const action = form.id ? UPDATE_USER : STORE_USER
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
	store.dispatch(REMOVE_USER, id)
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
	store.dispatch(ORDERS_USER, ids)
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
	<MqResponsive target="md+">
		<v-row dense>
			<v-col cols="4">
				<v-radio-group v-model="state.params.active" inline @update:modelValue="onParamsChanged">
					<v-radio v-for="(item, index) in active_options" :key="index"
					:label="item.text" :value="item.value"
					/>
				</v-radio-group>
			</v-col>
			<v-col cols="4">
				<v-select label="角色" density="compact" 
            :items="roleOptions" v-model="state.params.role"
				@update:modelValue="onParamsChanged"
            />
			</v-col>
			<v-col cols="4">
				<v-menu>
					<template v-slot:activator="{ props }">
						<v-btn icon="mdi-plus" v-bind="props" size="small" color="info"
						/>
					</template>
					<v-list min-width="160"  max-width="300">   
						<v-list-item title="手動新增" prepend-icon="mdi-pencil"
						@click.prepend="onAdd"
						/>
						<v-list-item title="匯入" prepend-icon="mdi-import"
						@click.prepend="onAdd"
						/>
					</v-list> 
				</v-menu>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<UserTable v-if="!isEmptyObject(pagedList)"
				:model="pagedList"  
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="WIDTH.S + 50">
			
		</v-dialog>
	</MqResponsive>
</template>