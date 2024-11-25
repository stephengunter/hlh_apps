<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { INIT_IT_DATABASES, IT_DATABASE_DETAILS, PAGE_NOT_FOUND, FETCH_ROLES, EDIT_IT_DATABASE, UPDATE_IT_DATABASE	
} from '@/store/actions.type'

import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { deepClone , is404, is400, isEmptyObject, showConfirm, hideConfirm, getValue,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, resort, upperFirstLetter
} from '@/utils'
import { WIDTH, ENTITY_TYPES, ROUTE_NAMES, ACTION_TITLES, CREATE, EDIT, ERRORS } from '@/consts'


const name = 'DatabaseDetailsView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const DATABASE = ENTITY_TYPES.DATABASE
const DBBACKUPPLAN = ENTITY_TYPES.DBBACKUPPLAN

const initialState = {
	database: {},
	form: {
		active: false,
		model: {},
		action: '',
		type: '',
		title: '',
		can_remove: false
	},
	tab: {
		value: DBBACKUPPLAN.name,
		items: [{
			value: DBBACKUPPLAN.name, title: DBBACKUPPLAN.title
		}]
	} 
}

const state = reactive(deepClone(initialState))
const lastPage = computed(() => store.getters.lastPage)
const labels = computed(() => store.state.it_databases.labels)
const backupPlans_labels = computed(() => store.state.it_dbBackupPlans.labels)
const servers = computed(() => store.state.it_databases.servers)
const server_options = computed(() => {
	if(servers.value && servers.value.length) {
		let options = []
		servers.value.forEach(item => {
			options.push({
				value: item.id, title: `${item.name}`
			})
		})
		return options
	}
	return []
})

onBeforeMount(() => {
	if(!isEmptyObject(labels.value)) init()
	else {
		store.dispatch(INIT_IT_DATABASES)
		.then(() => {
			nextTick(init)
		})
		.catch(error => onErrors(error))
	}
})
watch(route, init)

function init() {
	console.log(route.params)
	if(route.params.id) fetchData(route.params.id)
	else store.dispatch(PAGE_NOT_FOUND, { router })
}
function fetchData(id) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(IT_DATABASE_DETAILS, id)
	.then(database => {
		state.database = deepClone(database)
	})
	.catch(error => {
		if(is404(error)) store.dispatch(PAGE_NOT_FOUND, { router })
		else onErrors(error)
	})
}
function getEntityId() {
	if(state.database) return state.database.id
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
	store.dispatch(EDIT_IT_DATABASE, getEntityId())
	.then(model => {
		state.form.model = deepClone(model)
		state.form.type = DATABASE.name
		state.form.action = UPDATE_IT_DATABASE
		state.form.title = `編輯${DATABASE.title}資料`
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = { ...initialState.form }
}
function onSubmit(form) {
	setValues(form, state.form.model)
	if(state.form.type === DATABASE.name) updateDatabase()
}
function updateDatabase() {
	const id = getEntityId()
	const model = state.form.model
	store.dispatch(UPDATE_IT_DATABASE, { id, model })
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
	if(lastPage.value && lastPage.value.name === ROUTE_NAMES.DATABASES) {
		router.back()
	}
	else router.push({ name: ROUTE_NAMES.DATABASES })
}
</script>

<template>
	<div>
		<v-row dense v-if="!isEmptyObject(state.database)">
			<v-col cols="4">
				<v-card>
					<CommonCardTitle :id="getEntityId()" :title="DATABASE.title"
					:tooltip="`編輯${DATABASE.title}資料`" :can_cancel="false"
					@edit="edit" 
					>
						<CommonButtonBack class_name="float-right ml-3"
						@back="backToIndex"
						/>
					</CommonCardTitle>
					<v-card-text>
						<ItDatabaseView :model="state.database" :labels="labels"
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
						<v-window-item :value="DBBACKUPPLAN.name">
							<ItDbBackupPlanView :database="state.database" :max_width="WIDTH.L"
							:labels="backupPlans_labels"
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
					<ItDatabaseForm v-if="state.form.type === DATABASE.name"
					:id="getEntityId()"
					:model="state.form.model"
					:labels="labels" :server_options="server_options"
					@submit="onSubmit"
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
	</div>
</template>