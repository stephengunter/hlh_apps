<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import date from '@/plugins/date'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, reviewedOptions,
	setValues, badRequest, toYearTW, dateToText, textToDate, isValidDate
} from '@/utils'
import { ROUTE_NAMES, ENTITY_TYPES } from '@/consts'

const name = 'CalendarHead'
const store = useStore()
const route = useRoute()
const router = useRouter()
const dateAdapter = new date.adapter({ locale: date.locale.zhTW })

const emit = defineEmits(['submit', 'add', 'option_changed', 'next', 'prev'])
defineExpose({
   init, setParams, getParams, setTitle
})

const props = defineProps({
   calendars: {
      type: Array,
      default: () => []
   },
	labels: {
      type: Object,
      default: null
   },
	current_date: {
      type: Date,
      default: null
   },
	week_title: {
      type: String,
      default: ''
   }
})

const initialState = {
	params: {
		calendar: '',
		start: '',
      end: ''
	},
	date: {
      roc: true,
		date: null,
      model: null,
   },
	viewMode: {
		selected: 'month',
		options: [{
			value: 'month',
			title: '月曆'
		},{
			value: 'week',
			title: '週曆'
		}]
	},
	calendar: {
		viewMode: 'month'
	}
}

const state = reactive(deepClone(initialState))

const params = computed(() => store.state.events.params)
const selected_calendar = computed(() => {
	if(state.params.calendar && props.calendars.length) {
		return props.calendars.find(item => item.key.toLowerCase() === state.params.calendar.toLowerCase())
	}
	return null
})
const calendar_options = computed(() => {
	if(selected_calendar.value) {
		const key = selected_calendar.value.key
		return props.calendars.filter(c => c.key.toLowerCase() !== key.toLowerCase()).map(item => ({ title: item.title, value: item.key }))
	}
	return []
})
const title = computed(() => selected_calendar.value ? `${selected_calendar.title}` : '')
const next_text = computed(() => state.viewMode.selected === 'week' ? '下一週' : '下個月')
const prev_text = computed(() => state.viewMode.selected === 'week' ? '上一週' : '上個月')
// const the_date = computed(() => {
// 	if(state.params.year && state.params.month) {
// 		let patter = `${state.params.year}-${state.params.month}-1`
// 		return dateAdapter.date(patter)
// 	}
// 	return null	
// })
const year_month = computed(() => {
	if(props.current_date) {
		const year = toYearTW(props.current_date.getFullYear())
		const month = props.current_date.getMonth() + 1
		return `${year} 年 ${month} 月`
	}
	return ''
})


const rules = computed(() => {
	return {
		
	}
})

const params_are_match = computed(() => {
	if(route.params) {
		return areObjectsEqual(state.params, route.params, true)
	} return false
})

const v$ = useVuelidate(rules, state.params)


function init() {
	if(params.value) state.params = deepClone(params.value)
	if(route.params) copyFromQuery(state.params, route.params)
	
	if(!state.params.calendar) state.params.calendar = props.calendars[0].key

	if(isValidDate(state.params.start) && isValidDate(state.params.end)) {
		let startDate = textToDate(state.params.start)
		let endDate = textToDate(state.params.end)
		if(dateAdapter.isAfter(endDate, startDate)) {
			if(state.viewMode.selected === 'month') {
				let last = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
				if(startDate.getDate() === 1 && dateAdapter.isSameDay(last, endDate)) {
					onParamsChanged()
					return
				}else {
					onParamsChanged()
					return
				}
			}
		}
	}

	const today = dateAdapter.date()
	let firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
	let lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
   state.params.start = dateToText(firstDay)
	state.params.end = dateToText(lastDay)

	onParamsChanged()
}
function setTitle() {
	console.log('setTitle', props.current_date)
}
function setParams(model) {
   setValues(model, state.params)
}
function getParams() {
   return state.params
}
function next() {
	if(state.viewMode.selected === 'month') {
		addMonth(1)
		emit('next')
	} 
	
}
function prev() {
	if(state.viewMode.selected === 'month') {
		addMonth(-1)
		emit('prev')
	} 
	
}
function addMonth(val) {
	let firstDay = dateAdapter.addMonths(props.current_date, val)
	let lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0)
   state.params.start = dateToText(firstDay)
	state.params.end = dateToText(lastDay)

	onParamsChanged()
}
function onParamsChanged() {
	onSubmit()
}
function onSubmit() {
	if(params_are_match.value) emit('submit', { ...state.params })
	else router.push({ name: ROUTE_NAMES.CALENDARS, params: state.params })
}


function selectCalendar(key) {
	state.params.calendar = key
	onParamsChanged()
}

function onViewModeChanged(val) {
	const key = 'view_mode'
	emit('option_changed', { key, val })
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
						v-for="co in calendar_options"
						:key="co.value"
						:value="co.value"
						@click.prevent="selectCalendar(co.value)"
						>
							<v-list-item-title>{{ co.title }}</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-col>
			<v-col cols="2" class="text-right">
				<span class="text-h4" v-if="selected_calendar">{{ selected_calendar.title }}</span>
			</v-col>
			<v-col cols="4">
				<v-row dense v-show="year_month">
					<v-col cols="3">
						<v-tooltip :text="prev_text">
							<template v-slot:activator="{ props }">
								<v-btn  class="float-right"
								v-bind="props" icon="mdi-chevron-left"  size="small" color="info"
								@click.prevent="prev"
								/>
							</template>
						</v-tooltip>
					</v-col>
					<v-col cols="6" class="text-center">
						<div v-if="state.viewMode.selected === 'month'" class="pt-1 text-h5" v-text="year_month"></div>
						<div v-else class="pt-1 text-h6">{{ week_title }}</div>
					</v-col>
					<v-col cols="3">
						<v-tooltip :text="next_text">
							<template v-slot:activator="{ props }">
								<v-btn class="float-left"
								v-bind="props" icon="mdi-chevron-right"  size="small" color="info"
								@click.prevent="next"
								/>
							</template>
						</v-tooltip>
					</v-col>
				</v-row>
			</v-col>
			<v-col cols="2">
				<v-btn-toggle 
				v-model="state.viewMode.selected"  variant="outlined" divided
				color="info" group
				@update:modelValue="onViewModeChanged"
				>
					<v-btn v-for="option in state.viewMode.options" :value="option.value">
						{{ option.title }}
					</v-btn>
				</v-btn-toggle>
			</v-col>
			<v-col cols="2">
				
			</v-col>
		</v-row>
	</form>
</template>