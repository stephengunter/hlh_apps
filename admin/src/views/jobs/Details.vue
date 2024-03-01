<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FETCH_DEPARTMENTS, JOB_DETAILS, EDIT_JOB, UPDATE_JOB, 
	FETCH_JOB_USER_PROFILES_BY_JOB, CREATE_JOB_USER_PROFILES, STORE_JOB_USER_PROFILES, EDIT_JOB_USER_PROFILES, UPDATE_JOB_USER_PROFILES,
	PAGE_NOT_FOUND, FETCH_ALL_PROFILES	
} from '@/store/actions.type'

import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { deepClone , is404, is400, isEmptyObject, showConfirm, hideConfirm,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, resort
} from '@/utils'
import { WIDTH, ENTITY_TYPES, ACTION_TITLES, CREATE, EDIT, ERRORS } from '@/consts'

const name = 'JobsDetailsView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	job: {},
	department: {},
	userProfiles: [],
	form: {
		active: false,
		model: {},
		action: '',
		type: '',
		title: '',
		can_remove: false
	},
	tab: {
		value: 'current',
		items: [{
			value: 'current', title: '現任人員'
		}, {
			value: 'records', title: ENTITY_TYPES.JOB_USER_PROFILES.title
		}]
	} 
}

const state = reactive(deepClone(initialState))
const departments = computed(() => store.state.departments.all)
const job_titles = computed(() => store.state.departments.job_titles)
const roleOptions = computed(() => store.state.jobs.role_options)
const allProfiles = computed(() => store.state.profiles.all)

const currentJobUserProfiles = computed(() => {
	if(!state.userProfiles.length) return null
	return state.userProfiles[0]
})

onBeforeMount(init)

watch(route, init)

function init() {
	if(!route.params.id) {
		store.dispatch(PAGE_NOT_FOUND, { router })
		return
	}
	checkDepartments().then(() => fetchData(route.params.id))
}
function checkDepartments() {
	return new Promise((resolve, reject) => {
		if(departments.value.length) resolve()
		store.dispatch(FETCH_DEPARTMENTS)
		.then(resolve())
		.catch(error => onErrors(error))
	})
}
function checkAllProfiles() {
	return new Promise((resolve, reject) => {
		if(allProfiles.value.length) resolve()

		store.dispatch(FETCH_ALL_PROFILES)
		.then(resolve())
		.catch(error => onErrors(error))
	})
}
function fetchData(id) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(JOB_DETAILS, id)
	.then(job => {
		state.job = deepClone(job)
		state.department = departments.value.find(d => d.id === job.departmentId)
		fetchUserProfiles()
	})
	.catch(error => {
		if(is404(error)) store.dispatch(PAGE_NOT_FOUND, { router })
		else onErrors(error)
	})
}
function fetchUserProfiles() {
	store.dispatch(FETCH_JOB_USER_PROFILES_BY_JOB, state.job.id)
	.then(list => state.userProfiles = list.slice(0))
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
	store.dispatch(EDIT_JOB, state.job.id)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.type = ENTITY_TYPES.JOB.name
		state.form.action = UPDATE_JOB
		state.form.title = `編輯${ENTITY_TYPES.JOB.title}資料`
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = { ...initialState.form }
}
function onSubmit(form) {
	setValues(form, state.form.model)
	store.dispatch(state.form.action, state.form.model)
	.then(() => {
		fetchData(state.job.id)
		onSuccess()
		onCancel()
	})
	.catch(error => handleSubmitError(error))
	// return
	// if(state.form.type === ENTITY_TYPES.JOB.name) update()
	// else if(state.form.type === ENTITY_TYPES.USER.name) updateUser()
	// else if(state.form.type === ENTITY_TYPES.JOB_USER_PROFILES.name) saveJobUser()
}
function addJobUser() {
	checkAllProfiles().then(() => {
		store.commit(CLEAR_ERRORS)
		store.dispatch(CREATE_JOB_USER_PROFILES, state.job.id)
		.then(model => {
			state.form.model = deepClone(model)
			state.form.type = ENTITY_TYPES.JOB_USER_PROFILES.name
			state.form.action = STORE_JOB_USER_PROFILES
			state.form.title = `新增${ENTITY_TYPES.JOB_USER_PROFILES.title}`
			state.form.active = true
		})
		.catch(error => onErrors(error))
	})
}
function editJobUser(id) {
	checkAllProfiles().then(() => {
		store.commit(CLEAR_ERRORS)
		store.dispatch(EDIT_JOB_USER_PROFILES, id)
		.then(model => {
			state.form.model = deepClone(model)
			state.form.type = ENTITY_TYPES.JOB_USER_PROFILES.name
			state.form.action = UPDATE_JOB_USER_PROFILES
			state.form.title = `編輯${ENTITY_TYPES.JOB_USER_PROFILES.title}`
			state.form.active = true
		})
		.catch(error => onErrors(error))
	})
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
	.catch(error => handleSubmitError(error))
}
function handleSubmitError(error) {
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
		<template v-if="!isEmptyObject(state.job)">
			<v-card>
				<CommonCardTitle :id="state.job.id" :title="ENTITY_TYPES.JOB.title"
				:tooltip="`編輯${ENTITY_TYPES.JOB.title}資料`" :can_cancel="false"
				@edit="edit"
				/>
				<v-card-text>
					<JobView :model="state.job" :department="state.department" />
				</v-card-text>
			</v-card>
			<v-card class="mt-3">
				<v-tabs v-model="state.tab.value" color="info" @update:modelValue="sortTabs">
					<v-tab v-for="item in state.tab.items" :key="item.value"  class="text-h6" :value="item.value">
						{{  item.title  }}
					</v-tab>
				</v-tabs>
				<v-window v-model="state.tab.value">
					<v-window-item value="current">
						<v-card :max-width="WIDTH.M">
							<CommonCardTitle v-if="isEmptyObject(currentJobUserProfiles)"  
							title="查無資料" 
							:can_cancel="false"
							/>
							<v-card-text v-else>
								<JobuserView :model="currentJobUserProfiles" />
							</v-card-text>
						</v-card>
					</v-window-item>
					<v-window-item value="records">
						<v-card :max-width="WIDTH.M">
							<CommonCardTitle  :title="state.userProfiles.length ? '' : '查無資料'" 
							:can_cancel="false"
							:tooltip="`新增${ENTITY_TYPES.JOB_USER_PROFILES.title}`" @create="addJobUser"
							/>
							<v-card-text >
								<JobuserTable :list="state.userProfiles" 
								@edit="editJobUser"
								/>
							</v-card-text>
						</v-card>
					</v-window-item>
				</v-window>
			</v-card>
		</template>
		<v-dialog persistent v-model="state.form.active" :width="WIDTH.M + 50">
			<v-card v-if="state.form.active" :max-width="WIDTH.M">
				<CommonCardTitle :title="state.form.title"
				@cancel="onCancel" 
				/>
				<v-card-text>
					<JobForm v-if="state.form.type === ENTITY_TYPES.JOB.name"
					:model="state.form.model" :departments="departments"
					:job_titles="job_titles" :role_options="roleOptions"
					@submit="onSubmit" @cancel="onCancel"
					@remove="onRemove"
					/>
					<JobuserForm v-if="state.form.type === ENTITY_TYPES.JOB_USER_PROFILES.name" :active="true"
					:model="state.form.model" :job="state.job" 
					:department="state.department" :profiles="allProfiles"
					@submit="onSubmit"
					/>
				</v-card-text>
      	</v-card>
		</v-dialog>
	</MqResponsive>
</template>