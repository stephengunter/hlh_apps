<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { INIT_IT_SERVERS, IT_SERVER_DETAILS, PAGE_NOT_FOUND, FETCH_ROLES, EDIT_IT_SERVER, UPDATE_IT_SERVER	
} from '@/store/actions.type'

import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { deepClone , is404, is400, isEmptyObject, showConfirm, hideConfirm, getValue,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, resort, upperFirstLetter
} from '@/utils'
import { WIDTH, ENTITY_TYPES, ROUTE_NAMES } from '@/consts'


const name = 'ServerDetailsView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const SERVER = ENTITY_TYPES.SERVER
const CREDENTIALINFO = ENTITY_TYPES.CREDENTIALINFO

const initialState = {
	server: {},
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
const labels = computed(() => store.state.it_servers.labels)
const credentialInfo_labels = computed(() => store.state.it_credentialInfoes.labels)
const hosts = computed(() => store.state.it_servers.hosts)
const providers = computed(() => store.state.it_servers.providers)
const type_options = computed(() => store.state.it_servers.type_options)

onBeforeMount(() => {
	if(!isEmptyObject(labels.value)) init()
	else {
		store.dispatch(INIT_IT_SERVERS)
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
	store.dispatch(IT_SERVER_DETAILS, id)
	.then(server => {
		state.server = deepClone(server)
	})
	.catch(error => {
		if(is404(error)) store.dispatch(PAGE_NOT_FOUND, { router })
		else onErrors(error)
	})
}
function getEntityId() {
	if(state.server) return state.server.id
	return 0
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
	store.dispatch(EDIT_IT_SERVER, getEntityId())
	.then(model => {
		state.form.model = deepClone(model)
		state.form.type = SERVER.name
		state.form.action = UPDATE_IT_SERVER
		state.form.title = `編輯${SERVER.title}資料`
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = { ...initialState.form }
}
function onSubmit(form) {
	setValues(form, state.form.model)
	if(state.form.type === SERVER.name) updateServer()
}
function updateServer() {
	const id = getEntityId()
	const model = state.form.model
	store.dispatch(UPDATE_IT_SERVER, { id, model })
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
	if(lastPage.value && lastPage.value.name === ROUTE_NAMES.SERVERS) {
		router.back()
	}
	else router.push({ name: ROUTE_NAMES.SERVERS })
}
</script>

<template>
	<div>
		<v-row dense v-if="!isEmptyObject(state.server)">
			<v-col cols="4">
				<v-card>
					<CommonCardTitle :id="getEntityId()" :title="SERVER.title"
					:tooltip="`編輯${SERVER.title}資料`" :can_cancel="false"
					@edit="edit" 
					>
						<CommonButtonBack class_name="float-right ml-3"
						@back="backToIndex"
						/>
					</CommonCardTitle>
					<v-card-text>
						<ItServerView :model="state.server" :labels="labels"
					:type_options="type_options"
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
							<ItCredentialInfoView :entity_type="SERVER.name" :max_width="WIDTH.M"
							:entity_id="getEntityId()" :labels="credentialInfo_labels"
							/>
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
					<ItServerForm v-if="state.form.type === SERVER.name"
					:id="getEntityId()"
					:model="state.form.model" :providers="providers"
					:labels="labels" :type_options="type_options" :hosts="hosts"
					@submit="onSubmit"
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
	</div>
</template>