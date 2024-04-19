<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FETCH_USERS, CREATE_USER, STORE_USER, IMPORT_USERS
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , activeOptions, copyFromQuery,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, is400, isNumeric,
	formatNumberWithLeadingZeros, tryParseInt
} from '@/utils'
import Judgebook from '@/models/judgebook'
import { WIDTH, ROUTE_NAMES } from '@/consts'

const name = 'JudgebooksIndexView'
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
	upload: {
		title: '上傳文書',
		active: false
	},
	form: {
		title: '上傳文書',
		active: false,
		model: {},
		action: ''
	}
}
const file_upload = ref(null)

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

// onBeforeMount(loadParams)

// watch(route, loadParams)

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
function onUpload(active) {
	state.upload.active = active
}
function upload(models) {
	console.log('upload', models)
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
		<v-row dense>
			<v-col cols="9">
			</v-col>
			<v-col cols="3">
				
				<v-tooltip text="上傳">
					<template v-slot:activator="{ props }">
						<v-btn class="float-right" icon="mdi-upload" v-bind="props" size="small" color="info"
						@click.prevent="onUpload(true)"
						/>
					</template>
				</v-tooltip>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<span v-for="model in state.upload.models">{{ model.year }}</span>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.upload.active" :width="WIDTH.L + 50">
			<v-card v-if="state.upload.active" :max-width="WIDTH.L">
				<CommonCardTitle :title="state.upload.title" 
				@cancel="onUpload(false)"
				/>
				<v-card-text>
					<JudgebookUpload
					@submit="upload"
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
</template>