<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ENTITY_TYPES, WIDTH, ACTION_TYPES } from '@/consts'
import { INIT_IT_SERVERS, FETCH_IT_SERVERS, CREATE_IT_SERVER, STORE_IT_SERVER } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile,
	onErrors, onSuccess, setValues, is400, 
	resolveErrorData
} from '@/utils'


const name = 'ITServersIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.SERVER
const initialState = {
	form: {
		title: '',
		active: false,
		model: {
		},
		action: '',
		width: WIDTH.L
	},
}
const state = reactive(deepClone(initialState))
const query = computed(() => store.state.it_servers.query)
const labels = computed(() => store.state.it_servers.labels)
const types = computed(() => store.state.it_servers.types)
const hosts = computed(() => store.state.it_servers.hosts)
const providers = computed(() => store.state.it_servers.providers)
const list = computed(() => store.state.it_servers.list)
const type_options = computed(() => {
	if(types.value && types.value.length) {
		let options = []
		types.value.forEach(item => {
			options.push({
				value: item, title: `${item} Server`
			})
		})
		return options
	}
	return []
})

const head = ref(null)

onMounted(() => {
	if(!isEmptyObject(query.value)) init()
	else {
		store.dispatch(INIT_IT_SERVERS)
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
	store.dispatch(FETCH_IT_SERVERS, query)
	.catch(error => onErrors(error))
}

function edit(id) {
	state.form.id = id
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_JUDGEBOOKFILE, id)
	.then(data => {
		state.form.title = `${ACTION_TYPES.EDIT.title}${ENTITY_TYPE.title}`,
		state.form.model = deepClone(data.model)
		state.form.actions = data.actions

		state.form.action = UPDATE_JUDGEBOOKFILE
		state.form.width = WIDTH.L
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCreate(query) {
	state.form.title = `${ACTION_TYPES.CREATE.title}${ENTITY_TYPE.title}`
	store.dispatch(CREATE_IT_SERVER)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.model.type = query.type
		state.form.action = STORE_IT_SERVER
		state.form.width = WIDTH.M
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = deepClone(initialState.form)
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
function details(item) {
	const id = item.id
	router.push({ name: ROUTE_NAMES.SERVER_DETAILS, params: { id } })
}
</script>

<template>
	<div>
		<ItServerHead ref="head" :query="query" :labels="labels"
		:type_options="type_options"
		@submit="fetchData" @create="onCreate"
		/>
		<v-row dense>
			<v-col cols="12">
				<ItServerTable
				:list="list" :labels="labels"
				@select="details"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="state.form.width + 50">
			<v-card v-if="state.form.active" :max-width="state.form.width">
				<CommonCardTitle :title="state.form.title"
				@cancel="onCancel"  
				/>
				<v-card-text v-if="state.form.active">
					<ItServerForm :model="state.form.model" :providers="providers"
					:labels="labels" :type_options="type_options" :hosts="hosts"
					@submit="onSubmit"
					/>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
