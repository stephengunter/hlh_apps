<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { INIT_USERS, FETCH_USERS, CREATE_USER, STORE_USER, SYNC_USERS
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , activeOptions, copyFromQuery,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, is400
} from '@/utils'
import { WIDTH, ROUTE_NAMES, ROOT_DEPARTMENT_KEYS } from '@/consts'

const name = 'UsersIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {	
	form: {
		title: '新增用戶',
		active: false,
		model: {},
		action: ''
	},
	can_down: false
}
const head = ref(null)
const table = ref(null)
const active_options = activeOptions
const query = computed(() => store.state.users.query)
const pagedList = computed(() => store.state.users.pagedList)
const roles = computed(() => store.state.users.roles)
const departments = computed(() => store.state.users.departments)
const root_hlh  = computed(() => store.state.departments.roots.find(x => x.key === ROOT_DEPARTMENT_KEYS.HLH))


const state = reactive(deepClone(initialState))

onMounted(() => {
	if(roles.length) init()
	else {
		store.dispatch(INIT_USERS)
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
	store.dispatch(FETCH_USERS, query)
	.then(() => {
		// if(query.role) state.admin_only = true
		// else state.admin_only = false		
	})
	.catch(error => onErrors(error))
}
function onOptionChanged(option) {
	head.value.setPageOption(option)
}

function details(id) {
	router.push({ name: ROUTE_NAMES.USER_DETAILS, params: { id } })
}

function onCreate() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_USER)
	.then(model => {
		state.form.title = '新增用戶'
		state.form.action = STORE_USER
		state.form.model = deepClone(model)
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = deepClone(initialState.form)
}
function onSubmit(form) {
	setValues(form, state.form.model)
	if(state.form.action === SYNC_USERS) {
		sync()
		return
	}
	store.dispatch(STORE_USER, state.form.model)
	.then(() => {
		fetchData()
		onCancel()
		onSuccess()
	})
	.catch(error => handleSubmitError(error))
}
function onCheckChanged(ids) {
	if(ids.length) state.can_down = true
	else state.can_down = false
}

function onSync() {
	state.form.title = '從AD同步用戶'
	state.form.action = SYNC_USERS
	state.form.model = { key: '' }
	state.form.active = true
}

function sync() {
	store.dispatch(SYNC_USERS, state.form.model)
	.then(data => {
		console.log(data)
		onCancel()
		fetchData()
		onSuccess('同步成功')
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
</script>

<template>
	<div>
		<UserHead ref="head" :query="query" :active_options="active_options"
		:departments="departments" :root_hlh="root_hlh"
		:show_down="state.can_down"
		@submit="fetchData" @create="onCreate" @sync="onSync"
		/>
		<v-row dense>
			<v-col cols="12">
				<UserTable ref="table"
				:model="pagedList" :roles="roles" :departments="departments"
				@options_changed="onOptionChanged"
				@select="details" @check="onCheckChanged"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="WIDTH.M + 50">
			<v-card v-if="state.form.active" :max-width="WIDTH.M">
				<CommonCardTitle :title="state.form.title" 
				@cancel="onCancel"
				/>
				<v-card-text>
					<AdminForm v-if="state.form.action === SYNC_USERS"
					:model="state.form.model" :file_request="false"
					@submit="onSubmit"
					/>
					<UserForm v-else
					:model="state.form.model"
					@submit="onSubmit"
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
	</div>
</template>