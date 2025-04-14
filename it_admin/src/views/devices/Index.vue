<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ENTITY_TYPES, WIDTH, ACTION_TYPES, WARNING, ERRORS } from '@/consts'
import { INIT_DEVICES, FETCH_DEVICES, CREATE_DEVICE, STORE_DEVICE, EDIT_DEVICE, UPDATE_DEVICE, 
	REMOVE_DEVICE, IMPORT_DEVICES
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, now,
	resolveErrorData
} from '@/utils'


const name = 'DevicesIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const DEVICE = ENTITY_TYPES.DEVICE
const DEVICE_TRANSACTION = ENTITY_TYPES.DEVICE_TRANSACTION
const initialState = {
	active: true,
	form: {
		id: '',
		title: '',
		active: false,
		labels: null,
		item: null,
		model: {
		},
		action: '',
		width: WIDTH.L
	},
	fired: false,
	category: null,
	category_tree: {
		title: '',
      active: false,
		width: WIDTH.L
   },
}
const head = ref(null)
const tree = ref(null)
const state = reactive(deepClone(initialState))
const query = computed(() => store.state.devices.query)
const labels = computed(() => store.state.devices.labels)
const locations = computed(() => store.state.devices.locations)
const categories = computed(() => store.state.devices.categories)
const root_category = computed(() => store.state.devices.rootCategory)
const category_ids = computed(() => {
	if(categories.value && categories.value.length) return categories.value.map(x => x.id)
	return []
})

const pagedList = computed(() => store.state.devices.pagedList)
const list = computed(() => store.state.devices.list)
const users = computed(() => store.getters.users)
const departments = computed(() => store.getters.departments)


onBeforeMount(() => {
	if(!isEmptyObject(labels.value)) {
		nextTick(init)
	}
	else {
		store.dispatch(INIT_DEVICES)
		.then(() => {
			nextTick(init)
		})
		.catch(error => onErrors(error))
	}
})
function init() {
	head.value.init()
	//console.log('init index', tree.value)
	//tree.value.init()
}
function fetchData(query) {
	if(!query) query = head.value.getQuery()
	if(query.category) {
		if(!state.category) {
			const category = categories.value.find(x => x.id === query.category)
			state.category = category
		}
	}else state.category = null
	state.fired = query.fired
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_DEVICES, query)
	.catch(error => onErrors(error))
}
function selectCategory(val) {
	if(val) {
		state.category_tree.active = true
	}else {
		state.category_tree = deepClone(initialState.category_tree)
	}
	
}
function initCategoryTree() {
   tree.value.init()
}
function onCategorySelected(category) {
	if(category) {
		head.value.setCategory({ id: category.id, title: category.title })
		state.category = deepClone(category)
	}else {
		head.value.setCategory(null)
		state.category = null
	}
	selectCategory(false)
}
function onOptionChanged(option) {
	head.value.setPageOption(option)
}
function onCreate() {
	state.form.title = `${ACTION_TYPES.CREATE.title}${DEVICE.title}`
	store.dispatch(CREATE_DEVICE)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.action = STORE_DEVICE
		state.form.width = WIDTH.L
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = deepClone(initialState.form)
}
function edit(id) {
	state.form.id = id
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_DEVICE, id)
	.then(model => {
		state.form.title = `${ACTION_TYPES.EDIT.title}${DEVICE.title}`,
		state.form.model = deepClone(model)
		state.form.actions = []

		state.form.action = UPDATE_DEVICE
		state.form.width = WIDTH.L
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onSubmit(form) {
	if(state.form.action === UPDATE_DEVICE) updateItem(form)
	else if(state.form.action === STORE_DEVICE) storeItem(form)
	else if(state.form.action === STORE_DEVICE_TRANSACTION) storeTransaction(form)	
}
function imports() {
   store.dispatch(IMPORT_DEVICES)
	.then(() => {
		onSuccess()
		fetchData()
	})
	.catch(error => onSubmitError(error))
}
function onSubmitError(error) {
	let data = resolveErrorData(error)
	if(data && data.errors) store.commit(SET_ERRORS, data.errors)
	else onErrors(error)
}
</script>

<template>
	<div>
		{{ labels }}
		<DeviceHead ref="head"
		:query="query" :labels="labels" :root_category="root_category"
		:category="state.category"
		@selectCategory="selectCategory" @imports="imports"
		@submit="fetchData" @create="onCreate"
		/>
		
		<v-row dense>
			<v-col cols="12">
				<DeviceTable :labels="labels" :fired="state.fired"
				:locations="locations" :users="users"
				:model="pagedList" :categories="categories"
				@options_changed="onOptionChanged"
				/>
			</v-col>
		</v-row>
		
		<v-dialog persistent v-model="state.category_tree.active" :width="state.category_tree.width + 50">
			<v-card v-if="state.category_tree.active" :max-width="state.category_tree.width">
				<CommonCardTitle :title="state.category_tree.title"
				@cancel="() => selectCategory(false)"  
				/>
				<v-card-text>
					<CategoryTree ref="tree"
               :root="root_category" :categories="categories"
					:active_ids="category_ids" 
               @mounted="initCategoryTree"
					@select="onCategorySelected"
               />
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
