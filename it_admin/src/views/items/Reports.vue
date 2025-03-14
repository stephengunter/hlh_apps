<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ENTITY_TYPES, WIDTH, ACTION_TYPES, WARNING, ERRORS } from '@/consts'
import { INIT_ITEM_REPORTS, FETCH_ITEM_REPORTS, CREATE_ITEM_REPORT, STORE_ITEM_REPORT, EDIT_ITEM_REPORT, UPDATE_ITEM_REPORT, 
	REMOVE_ITEM_REPORT, ITEM_REPORT_DETAILS 
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, 
	resolveErrorData
} from '@/utils'


const name = 'ItemReprtsView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ITEM_REPORT_REPORT = ENTITY_TYPES.ITEM_REPORT_REPORT
const initialState = {
	report: {
		id: '',
		title: '',
		active: false,
		model: {
		},
		action: '',
		width: WIDTH.L
	}
}
const state = reactive(deepClone(initialState))
const query = computed(() => store.state.item_reports.query)
const labels = computed(() => store.state.item_reports.labels)
const balanceSheetLabels = computed(() => store.state.item_reports.balanceSheetLabels)
const year_options = computed(() => store.state.item_reports.year_options)
const list = computed(() => store.state.item_reports.list)

const head = ref(null)

onBeforeMount(() => {
	if(!isEmptyObject(query.value)) init()
	else {
		store.dispatch(INIT_ITEM_REPORTS)
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
	store.dispatch(FETCH_ITEM_REPORTS, query)
	.catch(error => onErrors(error))
}
function onCreate(query) {
	state.report.title = `${ACTION_TYPES.CREATE.title}${ITEM_REPORT.title}`
	store.dispatch(CREATE_ITEM_REPORT)
	.then(model => {
		state.report.model = deepClone(model)
		state.report.model.type = query.type
		state.report.action = STORE_ITEM_REPORT
		state.report.width = WIDTH.L
		state.report.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.report = deepClone(initialState.report)
}
function details(id) {
	state.report.id = id
	store.commit(CLEAR_ERRORS)
	store.dispatch(ITEM_REPORT_DETAILS, id)
	.then(model => {
		state.report.model = deepClone(model)
		if(model.month) {
			state.report.title = `${model.year}年${model.month}月 耗材報表`
			state.report.title += `日期 ${model.date}`
		}else {
			state.report.title = `${model.year - 1}年度 耗材結存帳`
			state.report.title += ` (${model.date})`
		}
		
		
		state.report.actions = []

		//state.report.action = UPDATE_ITEM_REPORT
		state.report.width = WIDTH.L
		state.report.active = true
	})
	.catch(error => onErrors(error))
}
function onSubmit(form) {
	if(state.report.id) updateItem(form)
	else storeItem(form)
	
}
function storeItem(form) {
	setValues(form, state.report.model)
	store.dispatch(state.report.action, state.report.model)
	.then(() => {
		onCancel()
		onSuccess()
		fetchData()
	})
	.catch(error => onSubmitError(error))
}
function updateItem(form) {
	let model = state.report.model
	let id = state.report.id
	setValues(form, model)
	store.dispatch(state.report.action, { id, model })
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
function resetClientSecret() {
	let id = state.reset_pw.id
	store.dispatch(RESET_ITEM_REPORT_CLIENT_SECRET, id)
	.then(() => {
		hideConfirm()
		onCancel()
		onSuccess()

		fetchData()
	})
	.catch(error => onSubmitError(error))
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
	let id = state.report.id
	store.dispatch(REMOVE_ITEM_REPORT, id)
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
		<ItemReportHead ref="head" :year_options="year_options"
		:query="query" :labels="labels"
		@submit="fetchData" @create="onCreate"
		/>
		<v-row dense>
			<v-col cols="12">
				<ItemReportTable 
				:list="list" :labels="labels"
				@details="details"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.report.active" :width="state.report.width + 50">
			<v-card v-if="state.report.active" :max-width="state.report.width">
				<CommonCardTitle :title="state.report.title"
				@cancel="onCancel"  
				/>
				<v-card-text v-if="state.report.active">
					<ItemBalanceTable 
					:labels="balanceSheetLabels"
					:list="state.report.model.itemBalanceSheets"
					/>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
