<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { USER_DETAILS, PAGE_NOT_FOUND, FETCH_ROLES, EDIT_USER, UPDATE_USER, CREATE_PROFILES } from '@/store/actions.type'

import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { deepClone , is404, is400, isEmptyObject,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest
} from '@/utils'
import { WIDTH, ENTITY_TYPES, ACTION_TITLES } from '@/consts'

const name = 'UsersDetailsView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	user: {},
	form: {
		active: false,
		model: {},
		type: '',
		title: ''
	},
	tab: ENTITY_TYPES.PROFILES.name
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

function edit() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_USER, state.user.id)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.type = ENTITY_TYPES.USER.name
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
	store.dispatch(UPDATE_USER, state.form.model)
	.then(() => {
		fetchData(state.user.id)
		onCancel()
		onSuccess()
	})
	.catch(error => {
		if(is400(error)) {
			const data = resolveErrorData(error)
			if(data) store.commit(SET_ERRORS, Object.values(data))
   		else onErrors(error)
		}
		else onErrors(error)
	})
}
function addProfiles() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_PROFILES, state.user.id)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.type = ENTITY_TYPES.PROFILES.name
		state.form.title = `新增${ENTITY_TYPES.PROFILES.title}`
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
</script>

<template>
	<MqResponsive target="md+">
		<template v-if="!isEmptyObject(state.user)">
			<UserView 
			:model="state.user" :roles="roles" :title="`${ENTITY_TYPES.USER.title}`"
			@edit="edit"
			/>
			<v-card class="mt-3">
				<v-tabs v-model="state.tab" color="info">
					<v-tab class="text-h6" :value="ENTITY_TYPES.PROFILES.name">{{ ENTITY_TYPES.PROFILES.title }}</v-tab>
				</v-tabs>
				<v-window v-model="state.tab">
					<v-window-item :value="ENTITY_TYPES.PROFILES.name">
						<div v-if="isEmptyObject(state.user.profiles)" class="ma-3">
							<span class="text-h6">查無資料</span>
							<v-tooltip :text="ACTION_TITLES.CREATE">
								<template v-slot:activator="{ props }">
									<v-btn icon="mdi-plus" v-bind="props" class="ml-3"
									color="info" size="small"
									@click="addProfiles"
									/>
								</template>
							</v-tooltip>
						</div>
					</v-window-item>
				</v-window>
			</v-card>
		</template>
		<v-dialog persistent v-model="state.form.active" :width="WIDTH.S + 50">
			<v-card v-if="state.form.active" :max-width="WIDTH.S">
				<CoreCloseButton 
				@close="onCancel"
				/>
				<v-card-text>
					<h2>{{ state.form.title }}</h2>  
					<v-container>
						<UserForm v-if="state.form.type === ENTITY_TYPES.USER.name"
						:model="state.form.model"
						@submit="onSubmit"
						/>
						<ProfileForm v-if="state.form.type === ENTITY_TYPES.PROFILES.name"
						:model="state.form.model"
						@submit="onSubmit"
						/>
					</v-container>
				</v-card-text>
      	</v-card>
		</v-dialog>
	</MqResponsive>
</template>