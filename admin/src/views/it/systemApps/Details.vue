<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { INIT_IT_SYSTEM_APPS, IT_SYSTEM_APP_DETAILS, PAGE_NOT_FOUND, EDIT_IT_SYSTEM_APP, UPDATE_IT_SYSTEM_APP	
} from '@/store/actions.type'

import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { deepClone , is404, is400, isEmptyObject, showConfirm, hideConfirm, getValue,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, resort, upperFirstLetter
} from '@/utils'
import { WIDTH, ENTITY_TYPES, ROUTE_NAMES } from '@/consts'


const name = 'SystemAppDetailsView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const SYSTEM_APP = ENTITY_TYPES.SYSTEM_APP
const CREDENTIALINFO = ENTITY_TYPES.CREDENTIALINFO

const initialState = {
	systemApp: {},
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
const labels = computed(() => store.state.it_systemApps.labels)
const credentialInfo_labels = computed(() => store.state.it_credentialInfoes.labels)
const servers = computed(() => store.state.it_systemApps.servers)
const options = computed(() => store.state.it_systemApps.options)
const server_options = computed(() => {
	if(servers.value) {
		return servers.value.map(item => ({
			value: item.id, title: item.name
		}))
	}
	return []
})

onBeforeMount(() => {
	if(!isEmptyObject(labels.value)) init()
	else {
		store.dispatch(INIT_IT_SYSTEM_APPS)
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
	store.dispatch(IT_SYSTEM_APP_DETAILS, id)
	.then(model => {
		state.systemApp = deepClone(model)
		console.log('systemApp', state.systemApp)
	})
	.catch(error => {
		if(is404(error)) store.dispatch(PAGE_NOT_FOUND, { router })
		else onErrors(error)
	})
}
function getEntityId() {
	if(state.systemApp) return state.systemApp.id
	return 0
}
function getLabel(key) {
	if(isEmptyObject(labels.value)) return ''
   return getValue(labels.value, key)
}
function getOptions(key) {
	if(options.value) {
		if(isEmptyObject(options.value)) return []
   	return getValue(options.value, key)
	}
	return []
}
function sortTabs(val) {
	state.tab.items = resort(state.tab.items, val, 'value').slice()
}
function edit() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_IT_SYSTEM_APP, getEntityId())
	.then(model => {
		state.form.model = deepClone(model)
		state.form.type = SYSTEM_APP.name
		state.form.action = UPDATE_IT_SYSTEM_APP
		state.form.title = `編輯${SYSTEM_APP.title}資料`
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = { ...initialState.form }
}
function onSubmit(form) {
	setValues(form, state.form.model)
	if(state.form.type === SYSTEM_APP.name) updateSystemApp()
}
function updateSystemApp() {
	const id = getEntityId()
	const model = state.form.model
	store.dispatch(UPDATE_IT_SYSTEM_APP, { id, model })
	.then(() => {
		fetchData(getEntityId())
		onCancel()
		onSuccess()
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
	if(lastPage.value && lastPage.value.name === ROUTE_NAMES.SYSTEM_APPS) {
		router.back()
	}
	else router.push({ name: ROUTE_NAMES.SYSTEM_APPS })
}
</script>

<template>
	<div>
		<v-row dense v-if="!isEmptyObject(state.systemApp)">
			<v-col cols="4">
				<v-card>
					<CommonCardTitle :id="getEntityId()" :title="SYSTEM_APP.title"
					:tooltip="`編輯${SYSTEM_APP.title}資料`" :can_cancel="false"
					@edit="edit" 
					>
						<CommonButtonBack class_name="float-right ml-3"
						@back="backToIndex"
						/>
					</CommonCardTitle>
					<v-card-text>
						<ItSystemAppView :model="state.systemApp" :labels="labels"
						:type_options="getOptions('type')"
						/>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="8">
				<v-card>
					<v-tabs v-model="state.tab.value" color="info" @update:modelValue="sortTabs">
						<v-tab v-for="item in state.tab.items" :key="item.value"  class="text-h6" :value="item.value">
							{{  item.title  }}
						</v-tab>
					</v-tabs>
					<v-window v-model="state.tab.value">
						<v-window-item :value="CREDENTIALINFO.name">
							{{ credentialInfo_labels }}
							<!-- <ItCredentialInfoView :entity_type="SYSTEM_APP.name" :max_width="WIDTH.M"
							:entity_id="getEntityId()" :labels="credentialInfo_labels"
							/> -->
						</v-window-item>
					</v-window>
				</v-card>
			</v-col>
		</v-row dense>
		<v-dialog persistent v-model="state.form.active" :width="WIDTH.M + 50">
			<v-card v-if="state.form.active" :max-width="WIDTH.M">
				<CommonCardTitle :title="state.form.title" 
				@cancel="onCancel"
				/>
				<v-card-text>
					<ItSystemAppForm v-if="state.form.type === SYSTEM_APP.name"
					:id="getEntityId()"
					:model="state.form.model" :providers="providers"
					:labels="labels" :type_options="getOptions('type')" :hosts="hosts"
					@submit="onSubmit"
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
	</div>
</template>