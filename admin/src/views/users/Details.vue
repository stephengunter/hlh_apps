<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { USER_DETAILS, PAGE_NOT_FOUND, FETCH_ROLES, EDIT_USER, UPDATE_USER, 
	CREATE_PROFILES, STORE_PROFILES, EDIT_PROFILES, UPDATE_PROFILES, DELETE_PROFILES 
} from '@/store/actions.type'

import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { deepClone , is404, is400, isEmptyObject, showConfirm, hideConfirm,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, resort
} from '@/utils'
import { WIDTH, ENTITY_TYPES, ACTION_TITLES, CREATE, EDIT, ERRORS } from '@/consts'

const name = 'UsersDetailsView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	user: {},
	form: {
		active: false,
		model: {},
		action: '',
		type: '',
		title: '',
		can_remove: false
	},
	tab: {
		value: ENTITY_TYPES.PROFILES.name,
		items: [{
			value: ENTITY_TYPES.PROFILES.name, title: ENTITY_TYPES.PROFILES.title
		}]
	} 
}

const state = reactive(deepClone(initialState))

const roles = computed(() => store.state.users.roles)

onBeforeMount(init)

watch(route, init)

function init() {
	if(route.params.id) fetchData(route.params.id)
	else store.dispatch(PAGE_NOT_FOUND, { router })
}
function fetchData(id) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(USER_DETAILS, id)
	.then(user => {
		if(!roles.value.length) {
			store.dispatch(FETCH_ROLES)
			.then(() => {
				nextTick(() => state.user = deepClone(user))
			})
			.catch(error => onErrors(error))
		}else state.user = deepClone(user)
		
	})
	.catch(error => {
		if(is404(error)) store.dispatch(PAGE_NOT_FOUND, { router })
		else onErrors(error)
	})
}

function sortTabs(val) {
	state.tab.items = resort(state.tab.items, val, 'value').slice()
}
function edit() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_USER, state.user.id)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.type = ENTITY_TYPES.USER.name
		state.form.action = UPDATE_USER
		state.form.title = `編輯${ENTITY_TYPES.USER.title}資料`
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = { ...initialState.form }
}
function onSubmit(form) {
	setValues(form, state.form.model)
	if(state.form.type === ENTITY_TYPES.USER.name) updateUser()
	else if(state.form.type === ENTITY_TYPES.PROFILES.name) saveProfiles()
}
function updateUser() {
	store.dispatch(UPDATE_USER, state.form.model)
	.then(() => {
		fetchData(state.user.id)
		onCancel()
		onSuccess()
	})
	.catch(error => handelSubmitError(error))
}
function addProfiles() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_PROFILES, state.user.id)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.type = ENTITY_TYPES.PROFILES.name
		state.form.action = STORE_PROFILES
		state.form.title = `新增${ENTITY_TYPES.PROFILES.title}`
		state.form.can_remove = false
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function editProfiles() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_PROFILES, state.user.profiles.userId)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.type = ENTITY_TYPES.PROFILES.name
		state.form.action = UPDATE_PROFILES
		state.form.title = `編輯${ENTITY_TYPES.PROFILES.title}`
		state.form.can_remove = true
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function saveProfiles() {
	store.dispatch(state.form.action, state.form.model)
	.then(() => {
		fetchData(state.user.id)
		onCancel()
		onSuccess()
	})
	.catch(error => handelSubmitError(error))
}
function removeProfiles() {
	showConfirm({
		type: ERRORS,
		title: `確定要刪除${ENTITY_TYPES.PROFILES.title}嗎`,
		on_ok: deleteProfiles,
		cancel: '取消',
		on_cancel: hideConfirm
	})
}
function deleteProfiles() {
	store.dispatch(DELETE_PROFILES, state.user.id)
	.then(() => {
		hideConfirm()
		fetchData(state.user.id)
		onCancel()
		onSuccess(`${ENTITY_TYPES.PROFILES.title}已刪除`)
	})
	.catch(error => handelSubmitError(error))
}
function handelSubmitError(error) {
	if(is400(error)) {
		const data = resolveErrorData(error)
		if(data) store.commit(SET_ERRORS, Object.values(data))
		else onErrors(error)
	}
	else onErrors(error)
}
</script>

<template>
	<MqResponsive target="md+">
		<template v-if="!isEmptyObject(state.user)">
			<v-card>
				<CommonCardTitle :id="state.user.id" :title="ENTITY_TYPES.USER.title"
				:tooltip="`編輯${ENTITY_TYPES.USER.title}資料`"
				@edit="edit"
				/>
				<v-card-text>
					<UserView :model="state.user" :roles="roles" />
				</v-card-text>
			</v-card>
			
			<v-card class="mt-3">
				<v-tabs v-model="state.tab.value" color="info" @update:modelValue="sortTabs">
					<v-tab v-for="item in state.tab.items" :key="item.value"  class="text-h6" :value="item.value">
						{{  item.title  }}
					</v-tab>
				</v-tabs>
				<v-window v-model="state.tab.value">
					<v-window-item :value="ENTITY_TYPES.PROFILES.name">
						<v-card v-if="isEmptyObject(state.user.profiles)" :max-width="WIDTH.M">
							<CommonCardTitle title="查無資料" :tooltip="`新增${ENTITY_TYPES.PROFILES.title}`" @create="addProfiles"
							/>
						</v-card>
						<v-card v-else :max-width="WIDTH.M">
							<CommonCardTitle :id="state.user.profiles.userId" :show_id="false"
							@edit="editProfiles" :tooltip="`編輯${ENTITY_TYPES.PROFILES.title}`"
							/>
							<v-card-text>
								<ProfilesView :model="state.user.profiles"  :roles="roles" />
							</v-card-text>
						</v-card>
					</v-window-item>
				</v-window>
			</v-card>
		</template>
		<v-dialog persistent v-model="state.form.active" :width="WIDTH.M + 50">
			<v-card v-if="state.form.active" :max-width="WIDTH.M">
				<CommonButtonClose tooltip="取消" @close="onCancel" />
				<CommonCardTitle :title="state.form.title" />
				
				<v-card-text>
					<UserForm v-if="state.form.type === ENTITY_TYPES.USER.name"
					:model="state.form.model" :active="true"
					@submit="onSubmit"
					/>
					<ProfilesForm v-if="state.form.type === ENTITY_TYPES.PROFILES.name"
					:model="state.form.model" :active="true" :can_remove="state.form.can_remove"
					@submit="onSubmit" @remove="removeProfiles"
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
	</MqResponsive>
</template>