<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ENTITY_TYPES, WIDTH, ACTION_TYPES, WARNING, ERRORS } from '@/consts'
import { INIT_ITEMS, FETCH_ITEMS, CREATE_ITEM, STORE_ITEM, EDIT_ITEM, UPDATE_ITEM, 
	REMOVE_ITEM, CREATE_ITEM_TRANSACTION, STORE_ITEM_TRANSACTION 
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, now,
	resolveErrorData
} from '@/utils'


const name = 'ItemsIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ITEM = ENTITY_TYPES.ITEM
const ITEM_TRANSACTION = ENTITY_TYPES.ITEM_TRANSACTION
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
	}
}
const head = ref(null)
const state = reactive(deepClone(initialState))
const query = computed(() => store.state.items.query)
const labels = computed(() => store.state.items.labels)
const transactionLabels = computed(() => store.state.items.transactionLabels)
const item_options = computed(() => store.state.items.item_options)

const lastReport = computed(() => store.state.items.lastReport)
const list = computed(() => store.state.items.list)
const users = computed(() => store.getters.users)
const departments = computed(() => store.getters.departments)


onBeforeMount(() => {
	if(head.value) init()
	else {
		store.dispatch(INIT_ITEMS)
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
	state.active = query.active
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_ITEMS, query)
	.catch(error => onErrors(error))
}
function onCreate() {
	state.form.title = `${ACTION_TYPES.CREATE.title}${ITEM.title}`
	store.dispatch(CREATE_ITEM)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.action = STORE_ITEM
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
	store.dispatch(EDIT_ITEM, id)
	.then(model => {
		state.form.title = `${ACTION_TYPES.EDIT.title}${ITEM.title}`,
		state.form.model = deepClone(model)
		state.form.actions = []

		state.form.action = UPDATE_ITEM
		state.form.width = WIDTH.L
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onSubmit(form) {
	if(state.form.action === UPDATE_ITEM) updateItem(form)
	else if(state.form.action === STORE_ITEM) storeItem(form)
	else if(state.form.action === STORE_ITEM_TRANSACTION) storeTransaction(form)	
}
function storeItem(form) {
	let model = state.form.model
	setValues(form, model)
	store.dispatch(state.form.action, model)
	.then(() => {
		onCancel()
		onSuccess()
		fetchData()
	})
	.catch(error => onSubmitError(error))
}
function storeTransaction(form) {
	setValues(form, state.form.model)
	store.dispatch(STORE_ITEM_TRANSACTION, state.form.model)
	.then(() => {
		onCancel()
		onSuccess()
		fetchData()
	})
	.catch(error => onSubmitError(error))
}
function updateItem(form) {
	let model = state.form.model
	let id = state.form.id
	setValues(form, model)
	store.dispatch(state.form.action, { id, model })
	.then(() => {
		onCancel()
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
function select(id) {
	const date = now()
	const year = date.getFullYear() - 1911
	const month = date.getMonth() + 1
	const item = id
	router.push({ name: ROUTE_NAMES.ITEM_TRANSACTIONS, query: { year, month, item } })	
}
function addTran(id) {
	
	store.dispatch(CREATE_ITEM_TRANSACTION, id)
	.then(model => {
		state.form.id = 0
		state.form.title = `${ACTION_TYPES.CREATE.title}${ITEM_TRANSACTION.title}`
		state.form.labels = model.labels
		
		state.form.model = deepClone(model)
		state.form.actions = []

		state.form.action = STORE_ITEM_TRANSACTION
		state.form.width = WIDTH.L
		state.form.active = true
		console.log('addTran', state.form)
	})
	.catch(error => onErrors(error))
}
function confirmRemove() {
	let confirm = {
		type: ERRORS, 
		title: '確定要刪除?', 
		text: '', 
		ok:'確定', 
		cancel: '取消', 
		on_ok: remove, 
		on_cancel: null, 
		max_width: 0 
	}
	showConfirm(confirm)
}
function remove() {
	let id = state.form.id
	store.dispatch(REMOVE_ITEM, id)
	.then(() => {
		hideConfirm()
		onCancel()
		onSuccess()

		fetchData()
	})
	.catch(error => onSubmitError(error))
}
</script>

<template>
	<div>
		<ItemHead ref="head" :last_close="lastReport"
		:query="query" :labels="labels" 
		@submit="fetchData" @create="onCreate"
		/>
		<v-row dense>
			<v-col cols="12">
				<ItemTable 
				:list="list" :labels="labels" :active="state.active"
				@edit="edit" @select="select" @add-tran="addTran"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="state.form.width + 50">
			<v-card v-if="state.form.active" :max-width="state.form.width">
				<CommonCardTitle :title="state.form.title"
				@cancel="onCancel"  
				/>
				<v-card-text v-if="state.form.active">
					<ItemTransactionForm v-if="state.form.action === STORE_ITEM_TRANSACTION" :id="state.form.id" 
					:model="state.form.model" :item_options="item_options"
					:labels="transactionLabels" 
					:users="users" :departments="departments"
					@submit="onSubmit"
					/>
					<ItemForm v-else :id="state.form.id" 
					:model="state.form.model" :item="state.form.item" 
					:labels="labels" 
					@submit="onSubmit" @remove="confirmRemove"
					/>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
