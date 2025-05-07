<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ENTITY_TYPES, WIDTH, ACTION_TYPES, ERRORS, ACTION_TITLES } from '@/consts'
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
const ITEM_REPORT = ENTITY_TYPES.ITEM_REPORT
const initialState = {
	report: {
		id: '',
		title: '',
		active: false,
		model: null,
		forms: [],
		action: '',
		width: WIDTH.M
	},
	form: {
		id: '',
		title: '',
		active: false,
		model: null,
		list: [],
		action: '',
		width: WIDTH.M
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
	if(head.value) init()
	else {
		store.dispatch(INIT_ITEM_REPORTS)
		.then(() => {
			nextTick(init)
		})
		.catch(error => onErrors(error))
	}
})
function init() {
	//if(head.value)
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
	.then(forms => {
		state.form.title = '新增報表'
		state.form.list = forms.slice(0)
		state.form.action = STORE_ITEM_REPORT
		state.form.width = WIDTH.M
		state.form.active = true
	})
	.catch(error => onErrors(error))
}

function onCancelCreate() {
	state.form = deepClone(initialState.form)
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
			state.report.title += `  (${model.date})`
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
	store.commit(CLEAR_ERRORS)
	state.form.model = deepClone(form)
	store.dispatch(STORE_ITEM_REPORT, form)
	.then(id => {
		onCancelCreate()
		onSuccess()

		fetchData()
	})
	.catch(error => onSubmitError(error))
}

function onSubmitError(error) {
	let data = resolveErrorData(error)
	if(isEmptyObject(data)) onErrors(error)
	else store.commit(SET_ERRORS, data)
}
function onRemove() {
	console.log('onRemove')
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
				<v-card-text>
					<v-row dense>
						<v-col cols="12">
							<ItemBalanceTable :month="state.report.model.month"
							:labels="balanceSheetLabels"
							:list="state.report.model.itemBalanceSheets"
							/>
						</v-col>
					</v-row>
					<v-row dense>
						<v-col cols="12">
							<v-btn v-if="state.report.model.canDelete"  class="float-right" color="error"
							@click.prevent="confirmRemove" 
							>
								{{ ACTION_TITLES.REMOVE }}
							</v-btn>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-dialog>
		<v-dialog persistent v-model="state.form.active" :width="state.form.width + 50">
			<v-card v-if="state.form.active" :max-width="state.form.width">
				<CommonCardTitle :title="state.form.title"
				@cancel="onCancelCreate"  
				/>
				<v-card-text>
					<v-row dense>
						<v-col cols="12">
							<ItemReportForm 
							:list="state.form.list"
							@submit="onSubmit"
							/>
						</v-col>
					</v-row>
					<v-row dense>
						<v-col cols="12">
							<CommonErrorsList />
						</v-col> 
					</v-row>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
