<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { FETCH_CALENDARS, FETCH_TASKS, CREATE_TASK, STORE_TASK, TASK_DETAILS, UPDATE_TASK } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , tryParseInt, badRequest,
	 onErrors, onSuccess, setValues, is400, dateToText, toYearTW,
} from '@/utils'
import { WIDTH, ROUTE_NAMES, CALENDAR_TYPES, ACTION_TYPES, ENTITY_TYPES } from '@/consts'

import date from '@/plugins/date'


const name = 'TaskDetailsView'
const TASK = ENTITY_TYPES.TASK
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	model: null
}

const state = reactive(deepClone(initialState))
const labels = computed(() => store.state.tasks.labels)

watch(route, init)

onBeforeMount(init)

function init() {
	const id = getIdFromParams()
	if(!id) {
		badRequest('錯誤的id', '錯誤的查詢參數，請回上一頁')
		return
	}
	fetchData(id)
}
function getIdFromParams() {
	if(!route.params) return 0
	return tryParseInt(route.params.id)	
}
function fetchData(id) {
	store.dispatch(TASK_DETAILS, id)
	.then(model => {
		state.model = model
	})
	.catch(error => onErrors(error))
}
function create() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(CREATE_TASK)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.active = true
		state.form.title = `${ACTION_TYPES.CREATE['title']}${TASK.title}`
		state.form.action = UPDATE_TASK
	})
	.catch(error => onErrors(error))
}
function onTaskUpdated() {
	state.form = deepClone(initialState.form)
}

</script>

<template>
	<v-row >
		<v-col cols="12">
			<v-card v-if="state.model">
				<CommonCardTitle :id="state.model.id" :show_id="false"
				tooltip="編輯" :can_cancel="false"
				/>
				<v-card-text>
					<TaskView :labels="labels"
					:model="state.model"
					/>
					
				</v-card-text>
			</v-card>
		</v-col>
	</v-row>
</template>