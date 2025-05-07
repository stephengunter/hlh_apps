<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ENTITY_TYPES, WIDTH, ACTION_TYPES, WARNING, ERRORS } from '@/consts'
import { INIT_ITEM_TRANSACTIONS, FETCH_ITEM_TRANSACTIONS, CREATE_ITEM_TRANSACTION, STORE_ITEM_TRANSACTION, 
	EDIT_ITEM_TRANSACTION, UPDATE_ITEM_TRANSACTION, REMOVE_ITEM_TRANSACTION
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, 
	resolveErrorData
} from '@/utils'


const name = 'ItemsTransactionsView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ITEM_TRANSACTION = ENTITY_TYPES.ITEM_TRANSACTION
const initialState = {
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
const query = computed(() => store.state.item_transactions.query)
const labels = computed(() => store.state.item_transactions.labels)
const year_options = computed(() => store.state.item_transactions.year_options)
const month_options = computed(() => store.state.item_transactions.month_options)
const inout_options = computed(() => store.state.item_transactions.inout_options)
const item_options = computed(() => store.state.item_transactions.item_options)
const list = computed(() => store.state.item_transactions.list)
const users = computed(() => store.getters.users)
const departments = computed(() => store.getters.departments)


onBeforeMount(() => {
	if(head.value) init()
	else {
		store.dispatch(INIT_ITEM_TRANSACTIONS)
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
	store.dispatch(FETCH_ITEM_TRANSACTIONS, query)
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = deepClone(initialState.form)
}
function onCreate(query) {
	const item = query.item
	state.form.id = 0
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_ITEM_TRANSACTION, item)
	.then(model => {
		state.form.title = `${ACTION_TYPES.CREATE.title}${ITEM_TRANSACTION.title}`
		state.form.model = deepClone(model)
		state.form.actions = []

		state.form.action = STORE_ITEM_TRANSACTION
		state.form.width = WIDTH.L
		state.form.active = true
	})
	.catch(error => onErrors(error))
}

function edit(id) {
	state.form.id = id
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_ITEM_TRANSACTION, id)
	.then(model => {
		state.form.title = `${ACTION_TYPES.EDIT.title}${ITEM_TRANSACTION.title}`
		state.form.model = deepClone(model)
		state.form.actions = []

		state.form.action = UPDATE_ITEM_TRANSACTION
		state.form.width = WIDTH.L
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onSubmit(form) {
	if(state.form.action === STORE_ITEM_TRANSACTION) storeTransaction(form)
	else if(state.form.action === UPDATE_ITEM_TRANSACTION) updateTransaction(form)
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
function updateTransaction(form) {
	let model = state.form.model
	let id = state.form.id
	setValues(form, model)
	store.dispatch(UPDATE_ITEM_TRANSACTION, { id, model })
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
function confirmResetClientSecret(id) {
	state.reset_pw.id = id
	let confirm = {
		type: WARNING, 
		title: '確定要重設密碼?', 
		text: '', 
		ok:'確定', 
		cancel: '取消', 
		on_ok: resetClientSecret, 
		on_cancel: null, 
		max_width: 0 
	}
	showConfirm(confirm)
}
function select(id) {
	store.dispatch(CREATE_ITEM_TRANSACTION, id)
	.then(model => {
		state.form.id = 0
		state.form.title = `${ACTION_TYPES.CREATE.title}${ITEM_TRANSACTION.title}`
		state.form.labels = model.labels
		state.form.item = deepClone(model.item)
		state.form.model = deepClone(model.form)
		state.form.actions = []

		state.form.action = UPDATE_ITEM
		state.form.width = WIDTH.L
		state.form.active = true
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
	store.dispatch(REMOVE_ITEM_TRANSACTION, id)
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
		<ItemTransactionHead ref="head" :query="query" :labels="labels" 
		:year_options="year_options" :month_options="month_options"
		:inout_options="inout_options" :item_options="item_options"
		@submit="fetchData" @create="onCreate"
		/>
		<v-row dense>
			<v-col cols="12">
				<ItemTransactionTable :item_options="state.itemOptions"
				:departments="departments" :users="users"
				:list="list" :labels="labels"
				@edit="edit"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="state.form.width + 50">
			<v-card v-if="state.form.active" :max-width="state.form.width">
				<CommonCardTitle :title="state.form.title"
				@cancel="onCancel"  
				/>
				<v-card-text v-if="state.form.active">
					<ItemTransactionForm :id="state.form.id" 
					:model="state.form.model" :item="state.form.item" 
					:labels="labels" :item_options="item_options"
					:users="users" :departments="departments"
					@submit="onSubmit" @remove="confirmRemove"
					/>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
