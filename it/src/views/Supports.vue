<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ACTION_TYPES, ENTITY_TYPES, WIDTH } from '@/consts'
import { INIT_SUPPORTS, FETCH_SUPPORTS, EXPORT_SUPPORTS_SUMMARY_REPORT, EXPORT_SUPPORTS_REPORT } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, bytesToBinary, getMimeType,
	resolveErrorData
} from '@/utils'

const name = 'SupportsIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.SUPPORT
const initialState = {
	list: [],
	form: {
		title: '',
		active: false,
		model: {
			year: 0,
			month: 0,
			file: null,
			records: []
		},
		action: '',
		width: WIDTH.L
	},
	can_report: false
}
const state = reactive(deepClone(initialState))

const query = computed(() => store.state.supports.query)
const labels = computed(() => store.state.supports.labels)
const list = computed(() => store.state.supports.list)
const total = computed(() => {
	if(list.value && list.value.length) {
		return list.value.reduce((sum, item) => sum + item.personCount, 0);
	}
	return 0
})
const year_options = computed(() => {
	if(store.state.supports.years && store.state.supports.years.length) {
		let options = []
		store.state.supports.years.forEach(x => {
			options.push({
				value: x, title: `${x}年`
			})
		})
		return options
	}
	return []
})
const month_options = computed(() => {
	if(store.state.supports.month && store.state.supports.month.length) {
		let options = []
		store.state.supports.month.forEach(x => {
			options.push({
				value: x, title: `${x}月`
			})
		})
		return options
	}
	return []
})
const head = ref(null)

onMounted(() => {
	if(!isEmptyObject(labels.value)) init()
	else {
		store.dispatch(INIT_SUPPORTS)
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
	state.can_report = false
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_SUPPORTS, query)
	.then(list => {
		state.can_report = list.length > 0
	})
	.catch(error => onErrors(error))
}
function onReport(request) {
	store.dispatch(EXPORT_SUPPORTS_REPORT, request)
	.then(model => {
		const ext = '.pdf'
		const fileName = model.fileName
		const fileBytes = bytesToBinary(model.fileBytes)
		const blob = new Blob([fileBytes], { type: getMimeType(ext) })
		downloadFile(blob, fileName)
	})
	.catch(error => onErrors(error))
}
function onSumReport(request) {
	store.dispatch(EXPORT_SUPPORTS_SUMMARY_REPORT, request)
	.then(model => {
		const ext = '.pdf'
		const fileName = model.fileName
		const fileBytes = bytesToBinary(model.fileBytes)
		const blob = new Blob([fileBytes], { type: getMimeType(ext) })
		downloadFile(blob, fileName)
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = deepClone(initialState.form)
}
</script>

<template>
<div>
	<SupportHead ref="head" :labels="labels" :query="query" :can_report="state.can_report"
	:year_options="year_options" :month_options="month_options" :total="total"
	@submit="fetchData"  @report="onReport" @sum_report="onSumReport"
	/>
	<v-row dense>
		<v-col cols="12">
			<SupportTable :labels="labels"
			:list="list"
			/>
		</v-col>
	</v-row>
</div>
</template>
