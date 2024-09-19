<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ACTION_TYPES, ENTITY_TYPES, WIDTH } from '@/consts'
import { INIT_IT_SYSTEM_APPS, FETCH_IT_SYSTEM_APPS, CREATE_IT_SYSTEM_APP, STORE_IT_SYSTEM_APP,
	EDIT_IT_SYSTEM_APP } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile,
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
		width: WIDTH.M
	},
}
const state = reactive(deepClone(initialState))

const query = computed(() => store.state.it_systemApps.query)
const labels = computed(() => store.state.it_systemApps.labels)
const pagedList = computed(() => store.state.it_systemApps.pagedList)
const head = ref(null)

onMounted(() => {
	//init()
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
	console.log('fetchData', query)
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_IT_SYSTEM_APPS, query)
	.catch(error => onErrors(error))
}
function onCreate() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_IT_SYSTEM_APP)
	.then(model => {
		state.form.title = `${ACTION_TYPES.CREATE.title}${ENTITY_TYPE.title}`,
		state.form.model = deepClone(model)

		state.form.action = STORE_IT_SYSTEM_APP
		state.form.width = WIDTH.M
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
function onCancel() {
	state.form = deepClone(initialState.form)
}
</script>

<template>
	<div>
		<ItSystemAppHead ref="head" :labels="labels" :query="query"
		@submit="fetchData" @create="onCreate"
		/>
		<v-row dense>
			<v-col cols="12">
				<!-- <ItDatabaseTable v-if="!isEmptyObject(pagedList)" 
				:model="pagedList"
				@select="edit"
				@options_changed="onOptionChanged"
				/> -->
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="state.form.width + 50">
			<v-card v-if="state.form.active" :max-width="state.form.width">
				<CommonCardTitle :title="state.form.title"
				@cancel="onCancel"  
				/>
				<v-card-text>
					<div style="padding-right: 10px;">
						<ItSystemAppForm 
						:model="state.form.model" :labels="labels"
						@submit="onFormSubmit" @remove="remove"
						/>
					</div>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
