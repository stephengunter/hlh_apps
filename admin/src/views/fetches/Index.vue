<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ACTION_TYPES, ENTITY_TYPES, WIDTH } from '@/consts'
import { INIT_FETCHES_RECORDS, FETCH_FETCHES_RECORDS, DOWNLOAD_FETCHES_RECORDS, TEMPLATE_FETCHES_RECORDS, STORE_FETCHES_SYSTEM
	, STORE_FETCHES_RECORDS, EXPORT_FETCHES_RECORDS_REPORT, EDIT_FETCHES_SYSTEM, UPDATE_FETCHES_SYSTEM 
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, bytesToBinary, getMimeType,
	resolveErrorData
} from '@/utils'

const name = 'FetchesIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.FETCHES_RECORDS
const initialState = {
	list: [],
	form: {
		title: '',
		active: false,
		model: {
		},
		action: '',
		width: WIDTH.L
	},
	system_selected:  null,
	has_template: false,
	can_report: false,
	summaries: []
}
const state = reactive(deepClone(initialState))

const query = computed(() => store.state.fetches_records.query)
const years = computed(() => store.state.fetches_records.years)
const list = computed(() => store.state.fetches_records.list)
const year_options = computed(() => {
	if(store.state.fetches_records.years && store.state.fetches_records.years.length) {
		let options = []
		store.state.fetches_records.years.forEach(x => {
			options.push({
				value: x, title: `${x}年`
			})
		})
		return options
	}
	return []
})
const month_options = computed(() => {
	if(store.state.fetches_records.month && store.state.fetches_records.month.length) {
		let options = []
		store.state.fetches_records.month.forEach(x => {
			options.push({
				value: x, title: `${x}月`
			})
		})
		return options
	}
	return []
})
const system_options = computed(() => {
	let options = [{ value: 0, title: `全部`}]
	if(store.state.fetches_systems.list && store.state.fetches_systems.list.length) {
		
		store.state.fetches_systems.list.forEach(x => {
			let department = x.department === 'JUD' ? '司法院' : '法務部'
			options.push({
				value: x.id, title: `${department} - ${x.title}`
			})
		})
		
	}
	return options
})
const systems = computed(() => store.state.fetches_systems.list)
const system_departments_options = computed(() => {
	if(store.state.fetches_systems.departments && store.state.fetches_systems.departments.length) {
		return store.state.fetches_systems.departments.map(x => ({ value: x.key, title: x.title }))
	}
	return []
})
const total = computed(() => {
	if(state.system_selected) {
		if(list.value) return list.value.length
		return 0
	} 
	let num = 0
	state.summaries.forEach(x => num += x.count)
	return num
})
const head = ref(null)

onMounted(() => {
	if(!isEmptyObject(query.value)) init()
	else {
		store.dispatch(INIT_FETCHES_RECORDS)
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
	state.system_selected = null
	state.has_template = false
	if(query.system) {
		state.summaries = []
		state.system_selected = systems.value.find(x => x.id === query.system)
		state.has_template = state.system_selected.department === 'JUD'
	}	
	state.can_report = false
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_FETCHES_RECORDS, query)
	.then(data => {
		if(!query.system) {
			state.summaries = data.summaries
			state.can_report = true
		} 
	})
	.catch(error => onErrors(error))
}
function createSystem() {
	state.form.title = `新增系統`,
	state.form.model = {
		title: '',
		department: system_departments_options.value[0].value
	}

	state.form.action = STORE_FETCHES_SYSTEM
	state.form.width = WIDTH.M
	state.form.active = true
}
function editSystem(id) {
	state.form.title = `編輯系統`,
	store.dispatch(EDIT_FETCHES_SYSTEM, id)
	.then(model => {
		state.form.model = model
		state.form.action = UPDATE_FETCHES_SYSTEM
		state.form.width = WIDTH.M
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onStore(query) {
	state.form.title = `上傳${ENTITY_TYPE.title}`,
	state.form.model = {
		system: query.system,
		year: query.year,
		month: query.month,
		records: []
	}

	state.form.action = STORE_FETCHES_RECORDS
	state.form.width = WIDTH.L
	state.form.active = true
}

function onTemplate() {
	store.dispatch(TEMPLATE_FETCHES_RECORDS, state.system_selected.department)
	.then(data => {
		const blob = new Blob([data])
		downloadFile(blob, `查詢紀錄範本.xlsx`)
	})
	.catch(error => onErrors(error))
}
function onReport(model) {
	store.dispatch(EXPORT_FETCHES_RECORDS_REPORT, model)
	.then(data => {
		const ext = '.pdf'
		const fileName = data.fileName
		const fileBytes = bytesToBinary(data.fileBytes)
		const blob = new Blob([fileBytes], { type: getMimeType(ext) })		
		downloadFile(blob, fileName)

		nextTick(download(model))
		
	})
	.catch(error => onErrors(error))
}
function download(model) {
	const year = model.year
	const month = model.month
	store.dispatch(DOWNLOAD_FETCHES_RECORDS, model)
	.then(data => {
		const blob = new Blob([data])
		downloadFile(blob, `${year}年${month}月 對外查詢紀錄明細.xlsx`)
	})
	.catch(error => onErrors(error))
}	
function onSubmit(form) {
	if(state.form.action === STORE_FETCHES_SYSTEM || state.form.action === UPDATE_FETCHES_SYSTEM) {
		setValues(form, state.form.model)
		submitSystem()
	}else if(state.form.action === STORE_FETCHES_RECORDS) {
		setValues(form, state.form.model)
		store.dispatch(state.form.action, state.form.model)
		.then(() => {
			onSuccess()
			fetchData()
			onCancel()
		})
		.catch(error => onErrors(error))
	}
}
function submitSystem() {
	store.dispatch(state.form.action, state.form.model)
	.then(() => {
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
	<FetchesHead ref="head" :query="query" :can_report="state.can_report"
	:system_options="system_options" :has_template="state.has_template"
	:year_options="year_options" :month_options="month_options"
	@create-system="createSystem" @edit-system="editSystem"
	@submit="fetchData" @upload="onStore" @report="onReport" @template="onTemplate"
	/>
	<v-row dense>
		<v-col cols="12">
			共 {{ total }} 筆
		</v-col>
		<v-col cols="12">
			<div v-if="state.system_selected">
				<FetchesTableMoj v-if="state.system_selected.department === 'MOJ'" :preview="false"
				:records="list" 
				/>
				<FetchesTableJud v-if="state.system_selected.department === 'JUD'" :preview="false"
				:records="list" 
				/>
			</div>
			<div v-else>
				<v-table style="width: 600px">
					<thead>
						<tr>
							<th>
								系統名稱
							</th>
							<th class="text-left">
								查詢紀錄筆數
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in state.summaries" :key="index">
							<td>{{ item.system }}</td>
							<td>{{ item.count }}</td>
						</tr>
					</tbody>
				</v-table>
			</div>	
			
			
		</v-col>
	</v-row>
	<v-dialog persistent v-model="state.form.active" :width="state.form.width + 50">
		<v-card v-if="state.form.active" :max-width="state.form.width">
			<CommonCardTitle :title="state.form.title"
			@cancel="onCancel"  
			/>
			<v-card-text v-if="state.form.active">
				<FetchesForm v-if="state.form.action === STORE_FETCHES_RECORDS" 
				:systems="systems" :system_options="system_options"
				:model="state.form.model" :year_options="year_options" :month_options="month_options"
				@submit="onSubmit"
				/>
				<FetchesSystemForm v-if="state.form.action === STORE_FETCHES_SYSTEM || state.form.action === UPDATE_FETCHES_SYSTEM"
				:department_options="system_departments_options"
				:model="state.form.model" :year_options="year_options" :month_options="month_options"
				@submit="onSubmit"
				/>
			</v-card-text>
		</v-card>
	</v-dialog>
</div>
</template>
