<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ACTION_TYPES, ENTITY_TYPES, WIDTH } from '@/consts'
import { INIT_CRIMINALS_RECORDS, FETCH_CRIMINALS_RECORDS, UPLOAD_CRIMINALS_RECORDS
	, STORE_CRIMINALS_RECORDS, EXPORT_CRIMINALS_RECORDS_REPORT 
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, bytesToBinary, getMimeType,
	resolveErrorData
} from '@/utils'

const name = 'CriminalsIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.CRIMINALS_RECORDS
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

const query = computed(() => store.state.criminals_records.query)
const years = computed(() => store.state.criminals_records.years)
const pagedList = computed(() => store.state.criminals_records.pagedList)
const year_options = computed(() => {
	if(store.state.criminals_records.years && store.state.criminals_records.years.length) {
		let options = []
		store.state.criminals_records.years.forEach(x => {
			options.push({
				value: x, title: `${x}年`
			})
		})
		return options
	}
	return []
})
const month_options = computed(() => {
	if(store.state.criminals_records.month && store.state.criminals_records.month.length) {
		let options = []
		store.state.criminals_records.month.forEach(x => {
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
	if(!isEmptyObject(query.value)) init()
	else {
		store.dispatch(INIT_CRIMINALS_RECORDS)
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
	store.dispatch(FETCH_CRIMINALS_RECORDS, query)
	.then(() => {
		//console.log(list)
		//state.can_report = list.length > 0
	})
	.catch(error => onErrors(error))
}
function onUpload(query) {
	state.form.title = `上傳${ENTITY_TYPE.title}`,
	state.form.model = {
		year: query.year,
		month: query.month,
		file: null,
		records: []
	}

	state.form.action = UPLOAD_CRIMINALS_RECORDS
	state.form.width = WIDTH.L
	state.form.active = true
}
function onReport(model) {
	store.dispatch(EXPORT_KEYINS_PERSONS_REPORT, model)
	.then(model => {
		const ext = '.pdf'
		const fileName = model.fileName
		const fileBytes = bytesToBinary(model.fileBytes)
		const blob = new Blob([fileBytes], { type: getMimeType(ext) })
		downloadFile(blob, fileName)
	})
	.catch(error => onErrors(error))
}

function onSubmit(form) {
	setValues(form, state.form.model)
	submit()
}
function submit() {
	let model = {
		year: state.form.model.year,
		month: state.form.model.month,
		records: state.form.model.records
	}
	store.dispatch(STORE_CRIMINALS_RECORDS, model)
	.then(() => {
		const query = {
			year: state.form.model.year,
			month: state.form.model.month
		}
		fetchData(query)
		onSuccess()
		onCancel()
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = deepClone(initialState.form)
}
</script>

<template>
<div>
	<CriminalsHead ref="head" :query="query" :can_report="state.can_report"
	:year_options="year_options" :month_options="month_options"
	@submit="fetchData" @upload="onUpload" @report="onReport"
	/>
	<v-row dense>
		<v-col cols="12">
			<CriminalsTable 
			:model="pagedList"
			/>
		</v-col>
	</v-row>
	<v-dialog persistent v-model="state.form.active" :width="state.form.width + 50">
		<v-card v-if="state.form.active" :max-width="state.form.width">
			<CommonCardTitle :title="state.form.title"
			@cancel="onCancel"  
			/>
			<v-card-text>
				<CriminalsForm v-if="state.form.active"
				:model="state.form.model" :year_options="year_options" :month_options="month_options"
				@submit="onSubmit"
				/>
			</v-card-text>
		</v-card>
	</v-dialog>
</div>
</template>
