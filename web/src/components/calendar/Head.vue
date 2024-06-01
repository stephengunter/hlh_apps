<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, reviewedOptions,
	setValues, badRequest
} from '@/utils'
import { ROUTE_NAMES, ENTITY_TYPES } from '@/consts'

const name = 'EventHead'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.CALENDAR
const module_state = store.state[ROUTE_NAMES.CALENDARS]

const emit = defineEmits(['submit', 'add'])
defineExpose({
   init, setParams, getParams
})

const initialState = {
	params: {
		calendarId: 0,
		year: 0,
      month: 0
	}
}
const state = reactive(deepClone(initialState))

const params = computed(() => module_state.params)
const calendars = computed(() => module_state.list)
const selected_calendar = computed(() => {
	if(state.params.calendarId && calendars.value.length) {
		return calendars.value.find(item => item.id === state.params.calendarId)
	}
	return null
})
const calendar_options = computed(() => {
	if(selected_calendar.value) {
		const id = selected_calendar.value.id
		return calendars.value.filter(c => c.id !== id).map(item => ({ title: item.title, value: item.id }))
	}
	return []
})
const labels = computed(() => module_state.labels)
const title = computed(() => selected_calendar.value ? `${selected_calendar.title}` : '')


const rules = computed(() => {
	return {
		
	}
})

const query_match_params = computed(() => {
	if(route.query) {
		return areObjectsEqual(state.params, route.query, true)
	} return false
})

const v$ = useVuelidate(rules, state.params)


function init() {
	console.log('init')
	return
	if(!route.params.key) {
		state.key = calendars.value[0].key 
		router.push({ name: ROUTE_NAMES.EVENTS, params: { key: state.key }, query: route.query })
		return
	}
	state.key = route.params.key
	
	if(isEmptyObject(route.query)) {
		router.push({ name: ROUTE_NAMES.EVENTS, params: { key: state.key },  query: { ...state.params } })
		return
	}

	copyFromQuery(state.params, route.query)

	if(!query_match_params.value) {
		router.push({ name: ROUTE_NAMES.EVENTS, params: { key: state.key }, query: { ...state.params } })
		return
	}

	const errors = checkParams()
	if(errors.any()) {
		badRequest('BAD_REQUEST ', '錯誤的查詢參數', errors.getAll())
		return 
	}
	console.log('state.params', state.params)
	emit('submit', { key: state.key, params: state.params})
	
}



function checkParams() {
	let errors = new Errors()
	// const year = state.params.year
   // if(!checkYear(year)) errors.set('year', [`錯誤的${labels['year']}`])

   // const num = state.params.num
   // if(!checkNum(num)) errors.set('num', [`錯誤的${labels['num']}`])

	return errors
}
function setParams(model) {
	console.log('setParams', model)
   setValues(model, state.params)
}
function getParams() {
   return state.params
}

function onSubmit() {
	if(query_match_params.value) emit('submit', state.params)
	else router.push({ path: route.path, query: { ...state.params } })	
}

function onParamsChanged() {
	onSubmit()
}

function selectcalendar(key) {
	//router.push({ name: ROUTE_NAMES.EVENTS, params: { key }, query: route.query })
}


</script>

<template>
   <form @submit.prevent="onSubmit">
		<v-row dense>
			<v-col cols="2">
				<v-menu v-if="selected_calendar">
					<template v-slot:activator="{ props }">
						<v-btn color="primary" v-bind="props">
							{{ selected_calendar.title }}
						</v-btn>
					</template>
					<v-list>
						<v-list-item
						v-for="calendar in calendar_options"
						:key="calendar.key"
						:value="calendar.key"
						@click.prevent="selectcalendar(calendar.key)"
						>
							<v-list-item-title>{{ calendar.title }}</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-col>
			<v-col cols="3" class="text-right">
				<span class="text-h4" v-if="selected_calendar">{{ selected_calendar.title }}</span>
			</v-col>
			<v-col cols="3">
				<v-row dense>
					<v-col cols="3">
						<v-tooltip text="上個月">
							<template v-slot:activator="{ props }">
								<v-btn  class="float-right"
								v-bind="props" icon="mdi-chevron-left"  size="small" color="info"
								/>
							</template>
						</v-tooltip>
					</v-col>
					<v-col cols="6" class="text-center">
						<span class="text-h5">113 年 4 月</span>
					</v-col>
					<v-col cols="3">
						<v-tooltip text="上個月">
							<template v-slot:activator="{ props }">
								<v-btn class="float-left"
								v-bind="props" icon="mdi-chevron-right"  size="small" color="info"
								/>
							</template>
						</v-tooltip>
					</v-col>
				</v-row>
			</v-col>
			<v-col cols="3">

			</v-col>
		</v-row>
	</form>
</template>