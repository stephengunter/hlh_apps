<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ACTION_TYPES, ENTITY_TYPES, WIDTH } from '@/consts'
import { INIT_KEYINS_BRANCHES, FETCH_KEYINS_BRANCHES, UPLOAD_KEYINS_BRANCHES, STORE_KEYINS_BRANCHES, EXPORT_KEYINS_BRANCHES_REPORT } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, bytesToBinary, getMimeType,
	resolveErrorData
} from '@/utils'

const name = 'KeyinBranchesView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.KEYIN
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

const query = computed(() => store.state.keyins_branches.query)
const labels = computed(() => store.state.keyins_branches.labels)
const branches = computed(() => store.state.keyins_branches.branches)
const list = computed(() => store.state.keyins_branches.list)
const year_options = computed(() => {
	if(store.state.keyins_branches.years && store.state.keyins_branches.years.length) {
		let options = []
		store.state.keyins_branches.years.forEach(x => {
			options.push({
				value: x, title: `${x}年`
			})
		})
		return options
	}
	return []
})
const month_options = computed(() => {
	if(store.state.keyins_branches.month && store.state.keyins_branches.month.length) {
		let options = []
		store.state.keyins_branches.month.forEach(x => {
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
		store.dispatch(INIT_KEYINS_BRANCHES)
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
	store.dispatch(FETCH_KEYINS_BRANCHES, query)
	.then(list => {
		state.can_report = list.length > 0
	})
	.catch(error => onErrors(error))
}
function onUpload(query) {
	state.form.title = `上傳${ENTITY_TYPE.title} - 法院成績`,
	state.form.model = {
		year: query.year,
		month: query.month,
		file: null,
		records: []
	}

	state.form.action = UPLOAD_KEYINS_BRANCHES
	state.form.width = WIDTH.L
	state.form.active = true
}
function onReport(model) {
	store.dispatch(EXPORT_KEYINS_BRANCHES_REPORT, model)
	.then(model => {
		const ext = '.pdf'
		const fileName = model.fileName
		const fileBytes = bytesToBinary(model.fileBytes)
		const blob = new Blob([fileBytes], { type: getMimeType(ext) })
		downloadFile(blob, fileName)
	})
	.catch(error => onErrors(error))
	// state.form.title = `上傳${ENTITY_TYPE.title}`,
	// state.form.model = {
	// 	year: query.year,
	// 	month: query.month,
	// 	file: null,
	// 	records: []
	// }

	// state.form.action = UPLOAD_KEYINS_BRANCHES
	// state.form.width = WIDTH.L
	// state.form.active = true
}

function onSubmit(form) {
	setValues(form, state.form.model)
	const query = {
		year: state.form.model.year,
		month: state.form.model.month
	}
	store.dispatch(FETCH_KEYINS_BRANCHES, query)
	.then(list => {
		if(list.length) {
			showConfirm({
				type: '',
				title: '資料有重複，是否覆蓋？',
				text: '',
				ok: '確定',
				cancel: '取消',
				on_ok: () => {
					hideConfirm()
					submit()
				}
			})
		}else submit()
	})
	.catch(error => onErrors(error))

	
}
function submit() {
	let model = {
		year: state.form.model.year,
		month: state.form.model.month,
		records: state.form.model.records
	}
	store.dispatch(STORE_KEYINS_BRANCHES, model)
	.then(() => {
		const query = {
			year: state.form.model.year,
			month: state.form.model.month
		}
		fetchData(query)
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
	<KeyinBranchHead ref="head" :labels="labels" :query="query" :can_report="state.can_report"
	:branches="branches" :year_options="year_options" :month_options="month_options"
	@submit="fetchData" @upload="onUpload" @report="onReport"
	/>
	<v-row dense>
		<v-col cols="12">
			<KeyinBranchTable 
			:list="list"
			/>
		</v-col>
	</v-row>
	<v-dialog persistent v-model="state.form.active" :width="state.form.width + 50">
		<v-card v-if="state.form.active" :max-width="state.form.width">
			<CommonCardTitle :title="state.form.title"
			@cancel="onCancel"  
			/>
			<v-card-text>
				<KeyinBranchForm v-if="state.form.active"
				:model="state.form.model" :year_options="year_options" :month_options="month_options"
				@submit="onSubmit"
				/>
			</v-card-text>
		</v-card>
	</v-dialog>
</div>
</template>
