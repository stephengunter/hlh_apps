<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ENTITY_TYPES, WIDTH, ACTION_TYPES } from '@/consts'
import { INIT_IT_HOSTS, FETCH_IT_HOSTS, CREATE_IT_HOST, STORE_IT_HOST } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile,
	onErrors, onSuccess, setValues, is400, 
	resolveErrorData
} from '@/utils'


const name = 'ITHostsIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.HOST
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
const query = computed(() => store.state.it_hosts.query)
const labels = computed(() => store.state.it_hosts.labels)
const providers = computed(() => store.state.it_hosts.providers)
const pagedList = computed(() => store.state.it_hosts.pagedList)
const provider_options = computed(() => {
	if(providers.value && providers.value.length) {
		let options = []
		providers.value.forEach(item => {
			options.push({
				value: item, title: item
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
		store.dispatch(INIT_IT_HOSTS)
		.then(() => {
			nextTick(init)
		})
		.catch(error => onErrors(error))
	}
	// if(types.value.length && departments.value.length) init()
	// else {
	// 	store.dispatch(INIT_JUDGEBOOKFILES)
	// 	.then(() => {
	// 		nextTick(init)
	// 	})
	// 	.catch(error => onErrors(error))
	// }
})
function init() {
	head.value.init()
}
function fetchData(query) {
	if(!query) query = head.value.getQuery()
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_IT_HOSTS, query)
	.catch(error => onErrors(error))
}
function onOptionChanged(option) {
	head.value.setPageOption(option)
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
function onCreate() {
	state.form.title = `${ACTION_TYPES.CREATE.title}${ENTITY_TYPE.title}`,
	store.dispatch(CREATE_IT_HOST)
	.then(model => {
		state.form.model = model
		state.form.action = STORE_IT_HOST
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
function details(id) {
	router.push({ name: ROUTE_NAMES.HOST_DETAILS, params: { id } })
}
</script>

<template>
	<div>
		<ItHostHead ref="head" :query="query" 
		@submit="fetchData" @create="onCreate"
		/>
		<v-row dense>
			<v-col cols="12">
				<ItHostTable v-if="!isEmptyObject(pagedList)" 
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
					<ItHostForm :model="state.form.model"
					:labels="labels"
					@submit="onSubmit"
					/>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
