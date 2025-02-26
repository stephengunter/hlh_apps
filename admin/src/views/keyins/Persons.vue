<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ACTION_TYPES, ENTITY_TYPES, WIDTH, ERRORS } from '@/consts'
import { FETCH_KEYINS_PASSES, STORE_KEYINS_PASSES, 
	EDIT_KEYINS_PASSES, UPDATE_KEYINS_PASSES, REMOVE_KEYINS_PASSES, EXPORT_KEYINS_PASSES_REPORT 
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm, tryParseInt,
	onErrors, onSuccess, setValues, is400, bytesToBinary, getMimeType, isTrue,
	resolveErrorData, areObjectsEqual
} from '@/utils'

const name = 'KeyinsPersonsView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.KEYIN
const initialState = {
	query: {
		pass: 0
	},
	options: [{
		value: 0, title: '全部'
	},{
		value: 1, title: '免測人員'
	}],
	list: [],
	form: {
		title: '',
		active: false,
		model: {
		},
		// model: {
		// 	file: null,
		// 	records: []
		// },
		action: '',
		width: WIDTH.L
	}
}

const labels = {
	'name': '姓名',
	'unit': '股別',
	'account': '帳號',
	'highRun': '最佳成績',
	'leaveAtText': '離職日期'
}
const state = reactive(deepClone(initialState))
const query_match_route = computed(() => {
	if(route.query) {
		return areObjectsEqual(state.query, route.query, true)
	} return false
})

watch(route, init)
onBeforeMount(init)

function init() {
   initQuery()
	fetchData(state.query)
}
function initQuery() {
	if(isEmptyObject(route.query)) {
		router.push({ path: route.path, query: { ...state.query } })
      return
	}
	
	state.query = { ...route.query }
	state.query.pass = tryParseInt(state.query.pass)
}
function onQueryChanged() {
	if(query_match_route.value) emit('submit', state.query)
	else router.push({ path: route.path, query: { ...state.query } })	
}
function fetchData(query) {
	state.can_report = false
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_KEYINS_PASSES, query)
	.then(list => {
		state.list = list
	})
	.catch(error => onErrors(error))
}
function create() {
	state.form.id = 0
	state.form.model = {
		account: '',
		unit: '',
		name: '',
		highRun: '',
		leaveAtText: ''
   }
	state.form.title = `${ACTION_TYPES.CREATE.title}人員資料`

	state.form.action = STORE_KEYINS_PASSES
	state.form.width = WIDTH.M
	state.form.active = true
}
function onSubmit(form) {
	if(state.form.id) onUpdate(form)
	else storePerson(form)
}
function storePerson(form) {
	setValues(form, state.form.model)
	const model = state.form.model
	store.dispatch(state.form.action, model)
	.then(() => {
		onCancel()
		onSuccess()
		fetchData(state.query)
	})
	.catch(error => {
		let errors = resolveErrorData(error)
		if(errors) store.commit(SET_ERRORS, Object.values(errors))
		else onErrors(error)
	})
}
function onCancel() {
	state.form = deepClone(initialState.form)
}

function edit(id) {
	state.form.id = id
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_KEYINS_PASSES, id)
	.then(model => {
		state.form.title = `${ACTION_TYPES.EDIT.title}人員資料`,
		state.form.model = deepClone(model)

		state.form.action = UPDATE_KEYINS_PASSES
		state.form.width = WIDTH.M
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onUpdate(form) {
	setValues(form, state.form.model)
	const id = state.form.id
	const model = state.form.model
	store.dispatch(state.form.action, { id, model })
	.then(() => {
		onCancel()
		onSuccess()
		fetchData(state.query)
	})
	.catch(error => {
		let errors = resolveErrorData(error)
		if(errors) store.commit(SET_ERRORS, Object.values(errors))
		else onErrors(error)
	})
}
function onReport() {
	store.dispatch(EXPORT_KEYINS_PASSES_REPORT, {})
	.then(model => {
		const ext = '.pdf'
		const fileName = model.fileName
		const fileBytes = bytesToBinary(model.fileBytes)
		const blob = new Blob([fileBytes], { type: getMimeType(ext) })
		downloadFile(blob, fileName)
	})
	.catch(error => onErrors(error))
}
function onRemove() {
	console.log('onRemove')
	showConfirm({
		type: ERRORS,
		title: `確定要刪除聽打人員嗎`,
		on_ok: removePerson,
		cancel: '取消',
		on_cancel: hideConfirm
	})
}
function removePerson() {
	store.dispatch(REMOVE_KEYINS_PASSES, state.form.id)
	.then(() => {
		hideConfirm()
		
		onSuccess(`聽打人員已刪除`)
		onCancel()
		fetchData(state.query)
	})
	.catch(error => {
		let errors = resolveErrorData(error)
		if(errors) store.commit(SET_ERRORS, Object.values(errors))
		else onErrors(error)
	})
}
</script>

<template>
<div>
	<v-row dense>
		<v-col cols="3">
			<v-radio-group v-model="state.query.pass" inline @update:modelValue="onQueryChanged">
				<v-radio v-for="(item, index) in state.options" :key="index"
				:label="item.title" :value="item.value"
				/>
			</v-radio-group>
		</v-col>
		<v-col cols="6">
			
		</v-col>
		<v-col cols="3">
			<CommonButtonCreate class_name="float-right ml-1" v-if="!isTrue(state.query.pass)"
			tooltip="新增人員"
			@create="create"
			/>
			<v-tooltip text="報表" v-if="state.list.length" >
				<template v-slot:activator="{ props }">
					<v-btn class="float-right" :disabled="!isTrue(state.query.pass)"
					icon="mdi-file-document" v-bind="props" size="small" color="warning"
					@click.prevent="onReport"
					/>
				</template>
			</v-tooltip>
			
		</v-col>
	</v-row>
	<v-row dense>
		<v-col cols="12">
			<KeyinPassesTable :labels="labels"
			:pass="isTrue(state.query.pass)"
			:list="state.list"
			@edit="edit"
			/>
		</v-col>
	</v-row>
	<v-dialog persistent v-model="state.form.active" :width="state.form.width + 50">
		<v-card v-if="state.form.active" :max-width="state.form.width">
			<CommonCardTitle :title="state.form.title"
			@cancel="onCancel"  
			/>
			<v-card-text>
				<KeyinPassesForm :labels="labels"
				:id="state.form.id" :model="state.form.model"
				@submit="onSubmit" @remove="onRemove"
				/>
			</v-card-text>
		</v-card>
	</v-dialog>
</div>
</template>
