<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { INIT_IT_HOSTS, IT_HOST_DETAILS, PAGE_NOT_FOUND, FETCH_ROLES, EDIT_IT_HOST, UPDATE_IT_HOST, 
	CREATE_IT_CREDENTIALINFO, STORE_IT_CREDENTIALINFO, EDIT_PROFILES, UPDATE_PROFILES, DELETE_PROFILES 
} from '@/store/actions.type'

import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { deepClone , is404, is400, isEmptyObject, showConfirm, hideConfirm, getValue,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, resort, upperFirstLetter
} from '@/utils'
import { WIDTH, ENTITY_TYPES, ROUTE_NAMES, ACTION_TITLES, CREATE, EDIT, ERRORS } from '@/consts'


const name = 'HostDetailsView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const HOST = ENTITY_TYPES.HOST
const CREDENTIALINFO = ENTITY_TYPES.CREDENTIALINFO

const initialState = {
	host: {},
	form: {
		active: false,
		model: {},
		action: '',
		type: '',
		title: '',
		can_remove: false
	},
	tab: {
		value: CREDENTIALINFO.name,
		items: [{
			value: CREDENTIALINFO.name, title: CREDENTIALINFO.title
		}]
	} 
}

const state = reactive(deepClone(initialState))

const lastPage = computed(() => store.getters.lastPage)
const labels = computed(() => store.state.it_hosts.labels)
const credentialInfo_labels = computed(() => store.state.it_credentialInfoes.labels)

onBeforeMount(() => {
	if(!isEmptyObject(labels.value)) init()
	else {
		store.dispatch(INIT_IT_HOSTS)
		.then(() => {
			nextTick(init)
		})
		.catch(error => onErrors(error))
	}
})
watch(route, init)

function init() {
	if(route.params.id) fetchData(route.params.id)
	else store.dispatch(PAGE_NOT_FOUND, { router })
}
function fetchData(id) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(IT_HOST_DETAILS, id)
	.then(host => {
		state.host = deepClone(host)
	})
	.catch(error => {
		if(is404(error)) store.dispatch(PAGE_NOT_FOUND, { router })
		else onErrors(error)
	})
}

function getLabel(key) {
	if(isEmptyObject(labels.value)) return ''
   return getValue(labels.value, key)
}
function sortTabs(val) {
	state.tab.items = resort(state.tab.items, val, 'value').slice()
}
function edit() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_IT_HOST, state.host.id)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.type = HOST.name
		state.form.action = UPDATE_IT_HOST
		state.form.title = `編輯${HOST.title}資料`
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = { ...initialState.form }
}
function onSubmit(form) {
	setValues(form, state.form.model)
	if(state.form.type === HOST.name) updateHost()
	else if(state.form.type === CREDENTIALINFO.name) saveCredentialInfo()
}
function updateHost() {
	store.dispatch(UPDATE_IT_HOST, state.form.model)
	.then(() => {
		fetchData(state.host.id)
		onCancel()
		onSuccess()
	})
	.catch(error => handelSubmitError(error))
}
function addCredentialInfo() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_IT_CREDENTIALINFO)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.model.entityType = upperFirstLetter(HOST.name)
		state.form.model.entityId = state.host.id
		state.form.type = CREDENTIALINFO.name
		state.form.action = STORE_IT_CREDENTIALINFO
		state.form.title = `新增${CREDENTIALINFO.title}`
		state.form.can_remove = false
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function editProfiles() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_PROFILES, state.host.credentialInfoes.userId)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.type = CREDENTIALINFO.name
		state.form.action = UPDATE_PROFILES
		state.form.title = `編輯${CREDENTIALINFO.title}`
		state.form.can_remove = true
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function saveCredentialInfo() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(state.form.action, state.form.model)
	.then(() => {
		fetchData(state.host.id)
		onCancel()
		onSuccess()
	})
	.catch(error => handelSubmitError(error))
}
function removeProfiles() {
	showConfirm({
		type: ERRORS,
		title: `確定要刪除${CREDENTIALINFO.title}嗎`,
		on_ok: deleteProfiles,
		cancel: '取消',
		on_cancel: hideConfirm
	})
}
function deleteProfiles() {
	store.dispatch(DELETE_PROFILES, state.user.id)
	.then(() => {
		hideConfirm()
		fetchData(state.user.id)
		onCancel()
		onSuccess(`${CREDENTIALINFO.title}已刪除`)
	})
	.catch(error => handelSubmitError(error))
}
function handelSubmitError(error) {
	if(is400(error)) {
		const data = resolveErrorData(error)
		if(data) store.commit(SET_ERRORS, Object.values(data))
		else onErrors(error)
	}
	else onErrors(error)
}
function backToIndex() {
	if(lastPage.value && lastPage.value.name === ROUTE_NAMES.USERS) {
		router.back();
	}
	else router.push({ name: ROUTE_NAMES.USERS });
}
</script>

<template>
	<div>
		<div v-if="!isEmptyObject(state.host)">
			<v-card>
				<CommonCardTitle :id="state.host.id" :title="HOST.title"
				:tooltip="`編輯${HOST.title}資料`" :can_cancel="false"
				@edit="edit" 
				>
					<CommonButtonBack class_name="float-right ml-3"
					@back="backToIndex"
					/>
				</CommonCardTitle>
				<v-card-text>
					<ItHostView :model="state.host" :labels="labels"
					/>
				</v-card-text>
			</v-card>
			
			<v-card class="mt-3">
				<v-tabs v-model="state.tab.value" color="info" @update:modelValue="sortTabs">
					<v-tab v-for="item in state.tab.items" :key="item.value"  class="text-h6" :value="item.value">
						{{  item.title  }}
					</v-tab>
				</v-tabs>
				<v-window v-model="state.tab.value">
					<v-window-item :value="CREDENTIALINFO.name">
						<v-card :max-width="WIDTH.M">
							<CommonCardTitle :show_id="false" :title="state.host.credentialInfoes.length ? '' : '查無資料'"
							:can_cancel="false"
							@create="addCredentialInfo" :tooltip="`新增${CREDENTIALINFO.title}`"
							/>
							<v-card-text>
								<ItCredentialInfoTable :list="state.host.credentialInfoes"
								:labels="credentialInfo_labels"
								/>
							</v-card-text>
						</v-card>
					</v-window-item>
				</v-window>
			</v-card>
		</div>
		<v-dialog persistent v-model="state.form.active" :width="WIDTH.M + 50">
			<v-card v-if="state.form.active" :max-width="WIDTH.M">
				<CommonCardTitle :title="state.form.title" 
				@cancel="onCancel"
				/>
				<v-card-text>
					<ItHostForm v-if="state.form.type === HOST.name"
					:model="state.form.model" :labels="labels"
					@submit="onSubmit" 
					/>

					<ItCredentialInfoForm v-if="state.form.type === CREDENTIALINFO.name"
					:model="state.form.model" :active="true" :can_remove="state.form.can_remove"
					:labels="credentialInfo_labels"
					@submit="onSubmit" @remove="removeProfiles"
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
	</div>
</template>