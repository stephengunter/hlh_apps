<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FETCH_USERS, CREATE_USER, STORE_USER, IMPORT_USERS
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , activeOptions, copyFromQuery,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, is400
} from '@/utils'
import { WIDTH, ROUTE_NAMES } from '@/consts'

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
		title: '新增用戶',
		active: false,
		model: {},
		action: ''
	}
}

const active_options = activeOptions
const pagedList = computed(() => store.state.users.pagedList)
const roles = computed(() => store.state.users.roles)
const roleOptions = computed(() => {
	let options = roles.value.map(role => ({ value: role.name, title: role.title }))
	options.splice(0, 0, {
	   value: '',
	   title: 'All'
	})
	return options
})

const state = reactive(deepClone(initialState))

onBeforeMount(loadParams)

watch(route, loadParams)

function loadParams() {
	if(isEmptyObject(route.query)) router.push({ path: route.path, query: { ...state.params } })
	else {
		copyFromQuery(state.params, route.query)
		fetchData()
	}
}
function checkParams() {
	if(!state.params.role) state.params.role = ''
	if(!state.params.keyword) state.params.keyword = ''
}
function fetchData() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_USERS, state.params)
	.then(model => {
		if(model.request) {
			setValues(model.request, state.params)
			checkParams() 
		}
	})
	.catch(error => onErrors(error))
}
function search(val) {
	state.params.keyword = val
	onParamsChanged()
}
function onOptionChanged(option) {
	if(option.hasOwnProperty('page')) state.params.page = option.page
	if(option.hasOwnProperty('size')) state.params.pageSize = option.size
	onParamsChanged()
}
function onParamsChanged() {
	router.push({ path: route.path, query: { ...state.params } })
}

function details(id) {
	router.push({ name: ROUTE_NAMES.USER_DETAILS, params: { id } })
}

function onAdd() {
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
function onImport() {
	state.form.title = '匯入用戶'
	state.form.action = IMPORT_USERS
	state.form.model = { key: '', files: [] }
	state.form.active = true
}
function onFileAdded(files) {
	store.dispatch(IMPORT_USERS, files)
	.then(() => {
		
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = deepClone(initialState.form)
}
function onSubmit(form) {
	setValues(form, state.form.model)
	if(state.form.action === IMPORT_USERS) {
		importing()
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

function importing() {
	store.dispatch(IMPORT_USERS, state.form.model)
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
</script>

<template>
	<MqResponsive target="md+">
		<v-row dense>
			<v-col cols="3">
				<v-radio-group v-model="state.params.active" inline @update:modelValue="onParamsChanged">
					<v-radio v-for="(item, index) in active_options" :key="index"
					:label="item.text" :value="item.value"
					/>
				</v-radio-group>
			</v-col>
			<v-col cols="3">
				<v-select label="角色" density="compact" 
            :items="roleOptions" v-model="state.params.role"
				@update:modelValue="onParamsChanged"
            />
			</v-col>
			<v-col cols="3">
				<CommonInputSearch 
				:keyword="state.params.keyword"
				@search="search"
				/>
			</v-col>
			<v-col cols="3">
				<v-menu>
					<template v-slot:activator="{ props }">
						<v-btn icon="mdi-plus" v-bind="props" size="small" color="info"
						/>
					</template>
					<v-list min-width="160"  max-width="300">   
						<v-list-item title="手動新增" prepend-icon="mdi-pencil"
						@click.prevent="onAdd"
						/>
						<v-list-item title="匯入" prepend-icon="mdi-import"
						@click.prevent="onImport"
						/>
					</v-list> 
				</v-menu>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<UserTable v-if="!isEmptyObject(pagedList)"
				:model="pagedList" :roles="roles"
				@options_changed="onOptionChanged"
				@select="details"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="WIDTH.M + 50">
			<v-card v-if="state.form.active" :max-width="WIDTH.M">
				<CommonCardTitle :title="state.form.title" 
				@cancel="onCancel"
				/>
				<v-card-text>
					<AdminForm v-if="state.form.action === IMPORT_USERS"
					:model="state.form.model" :file_request="true"
					:file_accept="['.csv']" file_label="上傳檔案"
					@submit="onSubmit"
					/>
					<UserForm v-else
					:model="state.form.model"
					@submit="onSubmit"
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
	</MqResponsive>
</template>