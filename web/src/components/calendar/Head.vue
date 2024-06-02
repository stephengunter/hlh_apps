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
	setValues, badRequest, toYearTW
} from '@/utils'
import { ROUTE_NAMES, ENTITY_TYPES } from '@/consts'

const name = 'CalendarHead'
const store = useStore()
const route = useRoute()
const router = useRouter()
const dateAdapter = new date.adapter({ locale: date.locale.zhTW })

const emit = defineEmits(['submit', 'add'])
defineExpose({
   init, setParams, getParams
})

const props = defineProps({
   calendars: {
      type: Array,
      default: () => []
   },
	labels: {
      type: Object,
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
const the_date = computed(() => {
	if(state.params.year && state.params.month) {
		let patter = `${state.params.year}-${state.params.month}-1`
		return dateAdapter.date(patter)
	}
	return null	
})
const year_month = computed(() => {
	if(the_date.value) {
		const year = toYearTW(the_date.value.getFullYear())
		const month = the_date.value.getMonth() + 1
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
	const today = dateAdapter.date()
	if(!state.params.year) state.params.year = today.getFullYear()
	if(!state.params.month) state.params.month = today.getMonth() + 1

	onParamsChanged()
}
function setParams(model) {
   setValues(model, state.params)
}
function getParams() {
   return state.params
}
function addMonth(val) {
	const result = dateAdapter.addMonths(the_date.value, val)
	state.params.year = result.getFullYear()
	state.params.month = result.getMonth() + 1
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
			<v-col cols="3" class="text-right">
				<span class="text-h4" v-if="selected_calendar">{{ selected_calendar.title }}</span>
			</v-col>
			<v-col cols="3">
				<v-row dense v-show="year_month">
					<v-col cols="3">
						<v-tooltip text="上個月">
							<template v-slot:activator="{ props }">
								<v-btn  class="float-right"
								v-bind="props" icon="mdi-chevron-left"  size="small" color="info"
								@click.prevent="addMonth(-1)"
								/>
							</template>
						</v-tooltip>
					</v-col>
					<v-col cols="6" class="text-center">
						<div class="pt-1 text-h5" v-text="year_month"></div>
					</v-col>
					<v-col cols="3">
						<v-tooltip text="上個月">
							<template v-slot:activator="{ props }">
								<v-btn class="float-left"
								v-bind="props" icon="mdi-chevron-right"  size="small" color="info"
								@click.prevent="addMonth(1)"
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