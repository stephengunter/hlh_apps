<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ACTION_TYPES, ENTITY_TYPES, WIDTH } from '@/consts'
import { INIT_FIXES, FETCH_FIXES, EXPORT_FIXES_REPORT } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, bytesToBinary, getMimeType,
	resolveErrorData
} from '@/utils'

const name = 'FixesIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.FIX
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

const query = computed(() => store.state.fixes.query)
const labels = computed(() => store.state.fixes.labels)
const list = computed(() => store.state.fixes.list)
const year_options = computed(() => {
	if(store.state.fixes.years && store.state.fixes.years.length) {
		let options = []
		store.state.fixes.years.forEach(x => {
			options.push({
				value: x, title: `${x}年`
			})
		})
		return options
	}
	return []
})
const month_options = computed(() => {
	if(store.state.fixes.month && store.state.fixes.month.length) {
		let options = []
		store.state.fixes.month.forEach(x => {
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
		store.dispatch(INIT_FIXES)
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
	store.dispatch(FETCH_FIXES, query)
	.then(list => {
		state.can_report = list.length > 0
	})
	.catch(error => onErrors(error))
}
function onReport(model) {
	store.dispatch(EXPORT_FIXES_REPORT, model)
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
	<FixHead ref="head" :labels="labels" :query="query" :can_report="state.can_report"
	:year_options="year_options" :month_options="month_options"
	@submit="fetchData"  @report="onReport"
	/>
	<v-row dense>
		<v-col cols="12">
			<FixTable :labels="labels"
			:list="list"
			/>
		</v-col>
	</v-row>
</div>
</template>
