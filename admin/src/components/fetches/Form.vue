<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { UPLOAD_FETCHES_RECORDS } from '@/store/actions.type'
import { deepClone, onErrors, setValues } from '@/utils'

const name = 'FetchesForm'
const store = useStore()
const emit = defineEmits(['submit'])
const props = defineProps({
	model: {
		type: Object,
		default: null
	},
	systems: {
      type: Array,
      default: () => []
   },
	system_options: {
      type: Array,
      default: () => []
   },
	year_options: {
      type: Array,
      default: () => []
   },
	month_options: {
      type: Array,
      default: () => []
   }
})

const initialState = {
	text: '',
	form: {
		system: 0,
		year: 0,
		month: 0,
		records: []
   }
}
const state = reactive(deepClone(initialState))

const system_selected = computed(() => {
	if(state.form.system && props.systems.length) {
		return  props.systems.find(x => x.id === state.form.system) 
	}
	return null
})

const has_records = computed(() => {
	if(state.form.records && state.form.records.length) {
		return true
	}
	return false
})

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
}
function onSubmit() {
	emit('submit', state.form)
}
function onResolve() {
	let system = system_selected.value
	if(!system) return

	if(system.department === 'JUD') resolveJUD()
	else resolveMOJ()
}
function resolveJUD() {
	var htmlString = state.text
	var parser = new DOMParser()
	// Parse the HTML string into a DOM Document
	var doc = parser.parseFromString(htmlString, 'text/html')

	// Find the table rows in the parsed HTML
	//var rows = doc.querySelectorAll('tbody tr')
	var rows = doc.querySelectorAll('.txtsmall tbody tr')
	// Create an array to store the parsed data
	var tableData = []

	// Loop through each row (skip the header row)
	for (var i = 1; i < rows.length; i++) {
		var cells = rows[i].querySelectorAll('td')
		if(!cells.length) continue
		// Extract the cell values (name, identifier, etc.)
		var name = cells[0].innerText
		if(name === '姓名')  continue

		// Push the row data into the tableData array
		tableData.push({
			name: cells[0].innerText.trim(),
			identifier: cells[1].innerText.trim(),
			courtType: cells[2].innerText.trim(),
			caseNumber: cells[3].innerText.trim(),
			queryTime: cells[4].innerText.trim(),
			queryKey: cells[5].innerText.trim(),
			ip: cells[6].innerText.trim(),
			ps: cells[7].innerText.trim()
		})
	}
	
	state.form.records = tableData
}
function resolveMOJ() {
	var htmlString = state.text
	var parser = new DOMParser()
	// Parse the HTML string into a DOM Document
	var doc = parser.parseFromString(htmlString, 'text/html')

	// Find the table rows in the parsed HTML
	var rows = doc.querySelectorAll('tbody tr')
	// Create an array to store the parsed data
	var tableData = []

	// Loop through each row (skip the header row)
	for (var i = 1; i < rows.length; i++) {
		var cells = rows[i].querySelectorAll('td font')
		if(!cells.length) continue
		// Extract the cell values (name, identifier, etc.)
		var name = cells[0].innerText
		if(name === '姓名')  continue

		var systemId = state.form.system
		var identifier = cells[1].innerText
		var caseNumber = cells[2].innerText
		var queryTime = cells[3].innerText
		//var responseTime = cells[4].innerText
		var queryKey = cells[5].innerText
		var ip = cells[6].innerText

		// Push the row data into the tableData array
		tableData.push({
			systemId, 
			name,
			identifier,
			caseNumber,
			queryTime,
			queryKey,
			ip
		})
	}
	state.form.records = tableData
}

function onFileAdded(files) {
	if(!files.length) {
		state.form.records = []
		return
	} 
	store.dispatch(UPLOAD_FETCHES_RECORDS, { file: files[0]})
	.then(records => {
		state.form.records = records.slice(0)
	})
	.catch(error => onErrors(error))
}
</script>

<template>
	<form @submit.prevent="onSubmit">
		<v-row dense>
			<v-col cols="2">
				<CommonInputUpload ref="file_upload" :multiple="false" :show_button="true"
				:is_media="false" :allow_types="['.xlsx', '.xls']"
				@file-added="onFileAdded" @file-removed="onFileAdded"
				/>
			</v-col>
			<v-col cols="3">
				<v-select density="compact" label="系統"
				:items="system_options" v-model="state.form.system"
				/>
			</v-col>
			<v-col cols="2">
				<v-select density="compact"
				:items="year_options" v-model="state.form.year"
				/>
			</v-col>
			<v-col cols="2">
				<v-select density="compact"
				:items="month_options" v-model="state.form.month"
				/>
			</v-col>
			<v-col cols="3">
				<v-btn color="success" :disabled="!state.form.records.length"
				type="submit"
				>
				存檔
				</v-btn>
			</v-col>
		</v-row>
		<v-row dense v-show="system_selected.department !== 'JUD'">
			<v-col cols="12">
				<v-textarea variant="filled" v-model="state.text" label="Text" />
			</v-col>
			<v-col cols="12">
				<v-btn class="float-right" color="info"
				:disabled="!state.text"
				@click.prevent="onResolve" 
				>
					確定
				</v-btn>
			</v-col>
		</v-row>
		<v-row dense v-show="has_records">
			<v-col cols="12">
				共 {{ state.form.records.length }} 筆
			</v-col>
			<v-col cols="12">
				<FetchesTableMoj v-if="system_selected && system_selected.department === 'MOJ'" :preview="true"
				:records="state.form.records" 
				/>
				<FetchesTableJud v-if="system_selected && system_selected.department === 'JUD'" :preview="true"
				:records="state.form.records" 
				/>
			</v-col>
		</v-row>
	</form>
</template>