<script setup>
import { reactive, computed, onBeforeMount, watch } from 'vue'
import { useStore } from 'vuex'

import {
   INIT_IT_DBBACKUPPLANS, FETCH_IT_DBBACKUPPLANS, CREATE_IT_DBBACKUPPLAN, STORE_IT_DBBACKUPPLAN, 
   IT_DBBACKUPPLAN_DETAILS, EDIT_IT_DBBACKUPPLAN, UPDATE_IT_DBBACKUPPLAN, 
   REMOVE_IT_DBBACKUPPLAN
} from '@/store/actions.type'

import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { deepClone , is404, is400, isEmptyObject, showConfirm, hideConfirm, getValue,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, resort, upperFirstLetter
} from '@/utils'
import { WIDTH, ENTITY_TYPES, ROUTE_NAMES, ACTION_TITLES, CREATE, EDIT, ERRORS } from '@/consts'
import { version } from 'vuex/dist/vuex.cjs.js'


const name = 'ITDbBackupPlanView'
const store = useStore()
const DBBACKUPPLAN = ENTITY_TYPES.DBBACKUPPLAN
const props = defineProps({
	database: {
      type: Object,
      default: null
   },
	version: {
      type: Number,
      default: 0
   },
	labels: {
		type: Object,
		default: null
	},
	max_width: {
      type: Number,
      default: 600
   },
})

const initialState = {
	list: [],
	type_options: [],
	form: {
		id: 0,
		active: false,
		model: {},
		action: '',
		type: '',
		title: '',
		can_remove: false
	}
}
const state = reactive(deepClone(initialState))
watch(() => props.version, () => {
   init()
})
onBeforeMount(init)

const db_options = computed(() => {
	if(props.database) {
		let options = []
		options.push({
			value: props.database.id, title: `${props.database.name}`
		})
		return options
	}
	return []
})

function init() {
	if(props.database) fetchData()
}
function fetchData() {
	const query = {
		dbId: props.database.id
	}
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_IT_DBBACKUPPLANS, query)
	.then(list => {
		state.list = list
	})
	.catch(error => onErrors(error))
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function add() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_IT_DBBACKUPPLAN)
	.then(model => {
		state.form.id = 0
		state.type_options = model.typeOptions
		state.form.model = deepClone(model.form)
		state.form.model.databaseId = props.database.id
		state.form.model.type = state.type_options[0].value

		state.form.type = DBBACKUPPLAN.name
		state.form.action = STORE_IT_DBBACKUPPLAN
		state.form.title = `新增${DBBACKUPPLAN.title}`
		state.form.can_remove = false
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = { ...initialState.form }
}
function edit(id) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_IT_DBBACKUPPLAN, id)
	.then(model => {
		state.form.id = id
		state.form.model = deepClone(model)
		state.form.type = DBBACKUPPLAN.name
		state.form.action = UPDATE_IT_DBBACKUPPLAN
		state.form.title = `編輯${DBBACKUPPLAN.title}`
		state.form.can_remove = model.canRemove
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onSubmit(form) {
	setValues(form, state.form.model)
	if(state.form.id) update()
	else {
		store.commit(CLEAR_ERRORS)
		store.dispatch(state.form.action, state.form.model)
		.then(() => {
			onSuccess()
			fetchData()
			onCancel()
		})
		.catch(error => handelSubmitError(error))
	}
}
function update() {
	const id = state.form.id
	const model = state.form.model
	store.commit(CLEAR_ERRORS)
	store.dispatch(state.form.action, { id, model })
	.then(() => {
		onSuccess()
		fetchData()
		onCancel()
	})
	.catch(error => handelSubmitError(error))
}
function confirmRemove() {
	showConfirm({
		type: ERRORS,
		title: `確定要刪除${DBBACKUPPLAN.title}嗎`,
		on_ok: remove,
		cancel: '取消',
		on_cancel: hideConfirm
	})
}
function remove() {
	store.dispatch(REMOVE_IT_DBBACKUPPLAN, state.form.id)
	.then(() => {
		hideConfirm()
		fetchData()
		onCancel()
		onSuccess(`${DBBACKUPPLAN.title}已刪除`)
	})
	.catch(error => handelSubmitError(error))
}
</script>

<template>
	<div>
		<v-card :max-width="max_width">
			<CommonCardTitle :show_id="false" :title="state.list.length ? '' : '查無資料'"
			:can_cancel="false"
			@create="add" :tooltip="`新增${DBBACKUPPLAN.title}`"
			/>
			<v-card-text>
				<ItDbBackupPlanTable :list="state.list" v-show="state.list.length"
				:labels="labels"
				@edit="edit"
				/>
			</v-card-text>
		</v-card>
		<v-dialog persistent v-model="state.form.active" :width="WIDTH.M + 50">
			<v-card v-if="state.form.active" :max-width="WIDTH.M">
				<CommonCardTitle :title="state.form.title" 
				@cancel="onCancel"
				/>
				<v-card-text>
					<ItDbBackupPlanForm :id="state.form.id"
					:model="state.form.model" :can_remove="state.form.can_remove"
					:labels="labels" :type_options="state.type_options" :db_options="db_options"
					@submit="onSubmit" @remove="confirmRemove"
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
	</div>
</template>