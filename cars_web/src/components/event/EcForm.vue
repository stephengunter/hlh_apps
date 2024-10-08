<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import Errors from '@/common/errors'

import JudgeCase from '@/models/judgecase'
import { isEmptyObject, deepClone , areObjectsEqual, initByDate, getListFromObj,
	setValues, badRequest, isValidDate, initRangeHoursMinutes, isSameDate, isSameDay, addHours
} from '@/utils'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, COURT_TYPES, ENTITY_TYPES, ACTION_TYPES, HEIGHT } from '@/consts'

const name = 'EventEcForm'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.EVENT

const props = defineProps({
   model: {
		type: Object,
		default: null
	}
})
const emit = defineEmits(['submit', 'cancel', 'remove'])

const initialState = {
	form: {
		id: 0,
		startDate: null,
		endDate: null
   },
	caseInfo: {
		courtType: '',
		year: '',
		category: '',
		num: ''
	},
	range: {
		roc: true,
		dates: [],
      values: [],
		models: {},
		hours_allow: [],
		minutes_allow: []
	},
	
	errors: new Errors()
}

const state = reactive(deepClone(initialState))
const courtTypes = getListFromObj(COURT_TYPES)
const periodPicker = ref(null)

const labels = computed(() => store.state.calendars.ec_labels)

const canRemove = computed(() => {
	if(!props.model.id) return false
	if(props.model.active) return false
	return true
})
const rules = computed(() => {
	const items = 
	{
		year: {
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels.value['year']), required),
			isValid: helpers.withMessage(`${labels.value['year']}不正確`, checkYear)
		},
      category: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels.value['category']), required),
			isValid: helpers.withMessage(`${labels.value['category']}不正確`, checkCategory)
		},
      num: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels.value['num']), required),
			isValid: helpers.withMessage(`${labels.value['num']}不正確`, checkNum)
		}
	}
	return items
})


const v$ = useVuelidate(rules, state.caseInfo)

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
	setValues(props.model.caseInfo, state.caseInfo)
	if(props.model) {
		state.form.startDate = initByDate(props.model.startDate, 10)
		state.form.endDate = initByDate(props.model.endDate, 11)
	}

	const hoursMinutes = initRangeHoursMinutes()
	state.range.hours_allow = hoursMinutes.hours_allow
	state.range.minutes_allow = hoursMinutes.minutes_allow
	

	state.range.dates[0] = state.form.startDate
	state.range.dates[1] = state.form.endDate

	console.log(state.caseInfo)	
}
function checkYear(val) {
	console.log('checkYear', val)
   if(val) return  JudgeCase.checkYear(val)
   return false
}
function checkCategory(val) {
   if(val) return true
	return false
}
function checkNum(val) {
   if(val) return JudgeCase.isValidNum(val)
   return false
}
function onSubmit() {
	v$.value.$validate().then(valid => {
		if(!valid) return
		
		if(!periodPicker.value.checkErrors()) return
		let dates = periodPicker.value.getDates()
		state.form.startDate = dates[0].date
		state.form.endDate = dates[1].date

		if(state.errors.any()) return
		let form = deepClone(state.form)
		form.caseInfo = deepClone(state.caseInfo)
		emit('submit', form)
	})
}
function onDateSelected(dates) {
	if(!isSameDate(state.range.dates[0], dates[0].date)) {
		//start date changed
		state.range.dates[0] = dates[0].date
		if(!isSameDay(state.range.dates[0], state.range.dates[1])) {
			state.range.dates[1] = addHours(dates[0].date, 1)
		}
		return
	}
	
	if(!isSameDate(state.range.dates[1], dates[1].date)) {
		//end date changed
		state.range.dates[1] = dates[1].date
		if(!isSameDay(state.range.dates[0], state.range.dates[1])) {
			state.range.dates[0] = addHours(dates[1].date, -1)
		}
		return
	}
}
function onRemove() {
	emit('remove')
}
function onInputChanged() {
   store.commit(CLEAR_ERRORS)
}

</script>

<template>
   <form @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row dense>
			<v-col cols="3">
				<v-select  :label="labels['courtType']" density="compact" variant="outlined"
				:items="courtTypes" v-model="state.caseInfo.courtType"
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field :label="labels['year']"  density="compact" variant="outlined"
				v-model="state.caseInfo.year"
            :error-messages="v$.year.$errors.map(e => e.$message)"                     
				@input="v$.year.$touch"
				@blur="v$.year.$touch"
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field :label="labels['category']"  density="compact"  variant="outlined"      
				v-model="state.caseInfo.category"
            :error-messages="v$.category.$errors.map(e => e.$message)"                     
				@input="v$.category.$touch"
				@blur="v$.category.$touch"
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field :label="labels['num']"  density="compact" variant="outlined"   
				v-model="state.caseInfo.num"
            :error-messages="v$.num.$errors.map(e => e.$message)"                     
				@input="v$.num.$touch"
				@blur="v$.num.$touch"
				/>
			</v-col>
			
		</v-row>
		<CommonPickerPeriod ref="periodPicker" 
		minimum_view="time"
		:roc="true" :allow_same="false" 
		:hours_allow="state.range.hours_allow" :minutes_allow="state.range.minutes_allow"
		:required_start="true" :required_end="true" 
		:dates="state.range.dates"
		@selected="onDateSelected"
		/>
		<v-col cols="12">
			<CommonErrorsList />
		</v-col> 
		<v-row>
			<v-col cols="12">
				<v-btn v-if="canRemove"  class="float-left" color="error"
				@click.prevent="onRemove" 
				>
					{{ ACTION_TYPES.REMOVE['title'] }}
				</v-btn>
				<v-btn type="submit" color="success" class="float-right">
				{{ ACTION_TYPES.SAVE['title'] }}
				</v-btn>
			</v-col>
		</v-row>
	</form>
</template>