<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ENTITY_TYPES, WIDTH } from '@/consts'
import { INIT_IT_DATABASES, FETCH_IT_DATABASES, CREATE_IT_DATABASE, STORE_IT_DATABASE } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile,
	onErrors, onSuccess, setValues, is400, 
	resolveErrorData
} from '@/utils'


const name = 'ITDatabasesIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.DATABASE
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
const query = computed(() => store.state.it_databases.query)
const labels = computed(() => store.state.it_databases.labels)
const type_options = computed(() => store.state.it_databases.type_options)
const providers = computed(() => store.state.it_databases.providers)
const pagedList = computed(() => store.state.it_databases.pagedList)
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
		store.dispatch(INIT_IT_DATABASES)
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
	store.dispatch(FETCH_IT_DATABASES, query)
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
	state.form.title = `新增Db`,
	store.dispatch(CREATE_IT_DATABASE)
	.then(model => {
		state.form.model = model
		state.form.action = STORE_IT_DATABASE
		state.form.width = WIDTH.M
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
		<ItDatabaseHead ref="head" :query="query" :labels="labels"
		:type_options="type_options"
		@submit="fetchData" @create="onCreate"
		/>
		<v-row dense>
			<v-col cols="12">
				<ItDatabaseTable v-if="!isEmptyObject(pagedList)" 
				:model="pagedList"
				@select="edit"
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
					<ItDatabaseForm :model="state.form.model"
					:labels="labels" :provider_options="provider_options"
					/>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
