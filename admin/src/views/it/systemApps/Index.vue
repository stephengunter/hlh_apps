<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ACTION_TYPES, ENTITY_TYPES, WIDTH } from '@/consts'
import { INIT_IT_SYSTEM_APPS, FETCH_IT_SYSTEM_APPS, CREATE_IT_SYSTEM_APP, STORE_IT_SYSTEM_APP,
	EDIT_IT_SYSTEM_APP } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, getValue,
	onErrors, onSuccess, setValues, is400, 
	resolveErrorData
} from '@/utils'

const name = 'ITSystemAppsIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.SYSTEM_APP
const initialState = {
	form: {
		id: 0,
		title: '',
		active: false,
		model: {},
		action: '',
		actions: [],
		width: WIDTH.L
	},
}
const state = reactive(deepClone(initialState))

const query = computed(() => store.state.it_systemApps.query)
const labels = computed(() => store.state.it_systemApps.labels)
const servers = computed(() => store.state.it_systemApps.servers)
const pagedList = computed(() => store.state.it_systemApps.pagedList)
const options = computed(() => store.state.it_systemApps.options)

const server_options = computed(() => {
	if(servers.value) {
		return servers.value.map(item => ({
			value: item.id, title: item.name
		}))
	}
	return []
})

const head = ref(null)

onMounted(() => {
	if(!isEmptyObject(labels.value)) init()
	else {
		store.dispatch(INIT_IT_SYSTEM_APPS)
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
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_IT_SYSTEM_APPS, query)
	.catch(error => onErrors(error))
}
function getOptions(key) {
	if(options.value) {
		if(isEmptyObject(options.value)) return []
   	return getValue(options.value, key)
	}
	return []
}
function onCreate(query) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_IT_SYSTEM_APP)
	.then(model => {
		state.form.model = deepClone(model)
		//state.form.model.type = query.type
		state.form.action = STORE_IT_SYSTEM_APP
		state.form.width = WIDTH.L
		state.form.active = true
	})
	.catch(error => onErrors(error))
}

function onOptionChanged(option) {
	head.value.setPageOption(option)
}

function edit(id) {
	state.form.id = id
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_IT_SYSTEM_APP, id)
	.then(data => {
		state.form.title = `${ACTION_TYPES.EDIT.title}${ENTITY_TYPE.title}`,
		state.form.model = deepClone(data.model)
		state.form.actions = data.actions

		state.form.action = UPDATE_IT_SYSTEM_APP
		state.form.width = WIDTH.L
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onSubmit(form) {
	setValues(form, state.form.model)
	store.dispatch(state.form.action, state.form.model)
	.then(() => {
		onCancel()
		onSuccess()
		fetchData()
	})
	.catch(error => {
		let errors = resolveErrorData(error)
		if(errors) store.commit(SET_ERRORS, Object.values(errors))
		else onErrors(error)
	})
}
function onCancel() {
	state.form = deepClone(initialState.form)
}
function details(id) {
	router.push({ name: ROUTE_NAMES.SYSTEM_APP_DETAILS, params: { id } })
}
</script>

<template>
	<div>
		<ItSystemAppHead ref="head" :labels="labels" :query="query"
		:centralized_options="getOptions('centralized')"
		@submit="fetchData" @create="onCreate"
		/>
		<v-row dense>
			<v-col cols="12">
				<ItSystemAppTable v-if="!isEmptyObject(pagedList)" 
				:model="pagedList" :labels="labels"
				@select="details"
				@options_changed="onOptionChanged"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="state.form.width + 50">
			<v-card v-if="state.form.active" :max-width="state.form.width">
				<CommonCardTitle :title="state.form.title"
				@cancel="onCancel"  
				/>
				<v-card-text v-if="state.form.active">
					<ItSystemAppForm :model="state.form.model" :server_options="server_options"
					:labels="labels" :type_options="getOptions('type')" :importance_options="getOptions('importance')"
					@submit="onSubmit"
					/>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
