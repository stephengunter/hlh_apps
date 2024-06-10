<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import date from '@/plugins/date'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, dateToRocFormat,
	setValues, badRequest, toYearTW, dateToText, textToDate, isValidDate, tryParseInt
} from '@/utils'
import { ROUTE_NAMES, ENTITY_TYPES } from '@/consts'

const name = 'CalendarHead'
const store = useStore()
const route = useRoute()
const router = useRouter()
const dateAdapter = new date.adapter({ locale: date.locale.zhTW })

const emit = defineEmits(['submit', 'add', 'option_changed', 'next', 'prev'])
defineExpose({
   init, setParams, getParams, setRange, getSelectedCalendar
})

const props = defineProps({
   calendars: {
      type: Array,
      default: () => []
   },
	current_date: {
      type: Date,
      default: null
   }
})

const initialState = {
	params: {
		calendar: '',
		year: 0,
      month: 0
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
	current_range: null,
	calendar: {
		viewMode: 'month'
	}
}

const state = reactive(deepClone(initialState))

const params = computed(() => store.state.calendars.params)
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
const week_title = computed(() => {
	if(state.current_range) {
		const start = state.current_range.firstDay
		const end = state.current_range.lastDay
		return `${dateToRocFormat(start)} - ${end.getMonth() + 1}月${end.getDate()}日` 
	}
})
const next_text = computed(() => state.viewMode.selected === 'week' ? '下一週' : '下個月')
const prev_text = computed(() => state.viewMode.selected === 'week' ? '上一週' : '上個月')
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
	if(route.params) copyFromQuery(state.params, route.params)
	
	if(!state.params.calendar) state.params.calendar = props.calendars[0].key
	if(!checkParams()) {
		const today = dateAdapter.date()
		const year = toYearTW(today.getFullYear())
		const month = today.getMonth() + 1
		state.params.year = year
		state.params.month = month
	}

	onParamsChanged()
}
function checkParams() {
	const year = state.params.year ? parseInt(state.params.year) : 0
	if(year < 100 || year > 150) return false

	const month = state.params.month ? parseInt(state.params.month) : 0
	if(month < 1 || month > 12) return false
	
	return true
}
function setParams(model) {
   setValues(model, state.params)
	onParamsChanged()
}
function getParams() {
   return state.params
}
function getSelectedCalendar() {
	return selected_calendar.value
}
function next() {
	if(state.viewMode.selected === 'month') {
		let year = state.params.year
		let month = state.params.month + 1
		if(month > 12) {
			month = 1
			year += 1
		} 
		state.params.year = year
		state.params.month = month
		onParamsChanged()
	} 
	else emit('next')
	
}
function prev() {
	if(state.viewMode.selected === 'month') {
		let year = state.params.year
		let month = state.params.month - 1
		if(month < 1) {
			month = 12
			year -= 1
		} 
		state.params.year = year
		state.params.month = month
		onParamsChanged()
	}  
	else emit('prev')
	
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
function setRange({ firstDay, lastDay }) {
	state.current_range = { firstDay, lastDay }
}
function create() {
	emit('add')
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
				color="info" mandatory
				@update:modelValue="onViewModeChanged"
				>
					<v-btn v-for="option in state.viewMode.options" :value="option.value">
						{{ option.title }}
					</v-btn>
				</v-btn-toggle>
			</v-col>
			<v-col cols="2">
				<CommonButtonCreate class_name="float-right" 
				@create="create"
				/>
			</v-col>
		</v-row>
	</form>
</template>