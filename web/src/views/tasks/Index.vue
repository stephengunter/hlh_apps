<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
//import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zh_tw from '@fullcalendar/core/locales/zh-tw'

import { FETCH_CALENDARS, FETCH_TASKS, CREATE_TASK, STORE_TASK, TASK_DETAILS, UPDATE_TASK } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import FullEvent from '@/models/fullEvent'
import { isEmptyObject, deepClone , isSameDay, initByDate,
	 onErrors, onSuccess, setValues, is400, dateToText, toYearTW,
} from '@/utils'
import { WIDTH, ROUTE_NAMES, CALENDAR_TYPES, ACTION_TYPES, ENTITY_TYPES } from '@/consts'

import date from '@/plugins/date'


const name = 'TaskIndexView'
const TASK = ENTITY_TYPES.TASK
const store = useStore()
const route = useRoute()
const router = useRouter()
const dateAdapter = new date.adapter({ locale: date.locale.zhTW })

const head = ref(null)

const initialState = {
	form: {
		title: '',
		active: false,
		type: 'all',
		model: {},
		action: ''
	}
}

const state = reactive(deepClone(initialState))
const labels = computed(() => store.state.tasks.labels)
const pagedList = computed(() => store.state.tasks.pagedList)

watch(route, init)

onMounted(init)

function init() {
	head.value.init()
}
function onQueryChanged(query) {
	fetchTasks(query)
}
function onOptionChanged(option) {
	head.value.setPageOption(option)
}
function fetchTasks(query) {
	console.log(FETCH_TASKS, query)  
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_TASKS, query)
	.then(() => {
		
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

function edit(id) {
	console.log('edit', id)
}
function onSubmit(model) {
	setValues(model, state.form.model)
	store.commit(CLEAR_ERRORS)
	store.dispatch(STORE_TASK, state.form.model)
	.then(onTaskUpdated)
	.catch(error => onErrors(error))
}
function onTaskUpdated() {
	state.form = deepClone(initialState.form)
}
function onRemove() {
	const id = state.form.model.id
	console.log('onRemove', id)
}

function onCancel() {
	state.form = { ...initialState.form }
}
function onSelect(id) {
	router.push({ name: ROUTE_NAMES.TASK_DETAILS, params: { id } })
}

</script>

<template>
   <TaskHead ref="head" 
	@submit="onQueryChanged" @add="create"
	/>
	<v-row dense>
		<v-col cols="12">
			<TaskTable v-if="!isEmptyObject(pagedList)" 
			:model="pagedList" 
			@select="onSelect"
			@options_changed="onOptionChanged"
			/>
		</v-col>
	</v-row>
	<v-row class="mt-1">
		<v-col cols="12">
			
		</v-col>
   </v-row>
	<v-dialog persistent v-model="state.form.active" :width="WIDTH.L + 50">
		<v-card v-if="state.form.active" :max-width="WIDTH.L">
			<CommonCardTitle :title="state.form.title" 
			@cancel="onCancel"  
			/>
			<v-card-text>
				<TaskView v-if="state.form.action === TASK_DETAILS" :labels="labels"
				:model="state.form.model"
				@edit="edit"
				/>
				<TaskRootForm v-else :type="state.form.type" :labels="labels"
				:model="state.form.model"
				@submit="onSubmit"  @remove="onRemove"
				/>
				
			</v-card-text>
		</v-card>
	</v-dialog>
</template>