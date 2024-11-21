<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'

import {
   INIT_IT_CREDENTIALINFOS, FETCH_IT_CREDENTIALINFOS, CREATE_IT_CREDENTIALINFO, STORE_IT_CREDENTIALINFO, 
   IT_CREDENTIALINFO_DETAILS, EDIT_IT_CREDENTIALINFO, UPDATE_IT_CREDENTIALINFO, UPDATE_IT_CREDENTIALINFO_PASSWORD, 
   REMOVE_IT_CREDENTIALINFO, EDIT_IT_CREDENTIALINFO_PASSWORD
} from '@/store/actions.type'

import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { deepClone , is404, is400, isEmptyObject, showConfirm, hideConfirm, getValue,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, resort, upperFirstLetter
} from '@/utils'
import { WIDTH, ENTITY_TYPES, ROUTE_NAMES, ACTION_TITLES, CREATE, EDIT, ERRORS } from '@/consts'


const name = 'ITCredentialInfoView'
const store = useStore()
const CREDENTIALINFO = ENTITY_TYPES.CREDENTIALINFO
const props = defineProps({
	entity_type: {
      type: String,
      default: null
   },
	entity_id: {
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
	form: {
		active: false,
		model: {},
		action: '',
		type: '',
		title: '',
		can_remove: false
	}
}
const state = reactive(deepClone(initialState))
onBeforeMount(() => {
	fetchData()
})

function fetchData() {
	const query = {
		entity: props.entity_type, entityId: props.entity_id
	}
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_IT_CREDENTIALINFOS, query)
	.then(list => {
		state.list = list
	})
	.catch(error => onErrors(error))
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function addCredentialInfo() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_IT_CREDENTIALINFO)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.model.entityType = upperFirstLetter(props.entity_type)
		state.form.model.entityId = props.entity_id
		state.form.type = CREDENTIALINFO.name
		state.form.action = STORE_IT_CREDENTIALINFO
		state.form.title = `新增${CREDENTIALINFO.title}`
		state.form.can_remove = false
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = { ...initialState.form }
}
function editCredentialInfo(id) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_IT_CREDENTIALINFO, id)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.type = CREDENTIALINFO.name
		state.form.action = UPDATE_IT_CREDENTIALINFO
		state.form.title = `編輯${CREDENTIALINFO.title}`
		state.form.can_remove = model.canRemove
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function editCredentialInfoPw(id) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_IT_CREDENTIALINFO_PASSWORD, id)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.type = CREDENTIALINFO.name
		state.form.action = UPDATE_IT_CREDENTIALINFO_PASSWORD
		state.form.title = `修改密碼`
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onSubmit(form) {
	setValues(form, state.form.model)
	saveCredentialInfo()
}
function saveCredentialInfo() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(state.form.action, state.form.model)
	.then(() => {
		onSuccess()
		fetchData()
		onCancel()
	})
	.catch(error => handelSubmitError(error))
}
function removeCredentialInfo() {
	showConfirm({
		type: ERRORS,
		title: `確定要刪除${CREDENTIALINFO.title}嗎`,
		on_ok: deleteCredentialInfo,
		cancel: '取消',
		on_cancel: hideConfirm
	})
}
function deleteCredentialInfo() {
	store.dispatch(REMOVE_IT_CREDENTIALINFO, state.form.model.id)
	.then(() => {
		hideConfirm()
		fetchData()
		onCancel()
		onSuccess(`${CREDENTIALINFO.title}已刪除`)
	})
	.catch(error => handelSubmitError(error))
}
</script>

<template>
	<div>
		<v-card :max-width="max_width">
			<CommonCardTitle :show_id="false" :title="state.list.length ? '' : '查無資料'"
			:can_cancel="false"
			@create="addCredentialInfo" :tooltip="`新增${CREDENTIALINFO.title}`"
			/>
			<v-card-text>
				<ItCredentialInfoTable :list="state.list" v-show="state.list.length"
				:labels="labels"
				@edit="editCredentialInfo" @edit-pw="editCredentialInfoPw"
				/>
			</v-card-text>
		</v-card>
		<v-dialog persistent v-model="state.form.active" :width="WIDTH.M + 50">
			<v-card v-if="state.form.active" :max-width="WIDTH.M">
				<CommonCardTitle :title="state.form.title" 
				@cancel="onCancel"
				/>
				<v-card-text>
					<ItCredentialInfoPasswordForm v-if="state.form.action === UPDATE_IT_CREDENTIALINFO_PASSWORD"
					:model="state.form.model" 
					:labels="labels"
					@submit="onSubmit"
					/>
					<ItCredentialInfoForm v-else
					:model="state.form.model" :can_remove="state.form.can_remove"
					:labels="labels"
					@submit="onSubmit" @remove="removeCredentialInfo"
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
	</div>
</template>