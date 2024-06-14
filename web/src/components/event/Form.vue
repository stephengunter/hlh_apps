<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , areObjectsEqual, initByDate,
	setValues, badRequest, isValidDate, datetimeText
} from '@/utils'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, ROUTE_NAMES, ENTITY_TYPES, ACTION_TYPES, HEIGHT } from '@/consts'

const name = 'EventForm'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.EVENT

const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	labels: {
		type: Object,
		default: () => {}
	},
	calendars: {
		type: Array,
		default: () => []
	}
})
const emit = defineEmits(['submit', 'cancel', 'remove'])

const initialState = {
	form: {
		id: 0,
		title: '',
		content: '',
		allDay: false,
		startDate: null,
		endDate: null,
		calendarIds: []
   },
	attachments: [],
	range: {
		roc: true,
		dates: [],
      values: [],
		models: {},
		hours_allow: [],
		minutes_allow: []
	},
	selected: {
		calendars: {
			active: false,
			items: []
		}
	},
	errors: new Errors()
}

const state = reactive(deepClone(initialState))
const periodPicker = ref(null)
const tiptap = ref(null)

const canRemove = computed(() => {
	if(!props.model.id) return false
	if(props.model.active) return false
	return true
})

const rules = computed(() => {
	return {
		title: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(props.labels['title']), required)
		}
	}
})

const v$ = useVuelidate(rules, state.form)

onBeforeMount(init)

function init() {
	state.range.hours_allow = [...Array(24).keys()].filter(num => num >= 6 && num <= 22)
	state.range.minutes_allow = [...Array(60).keys()].filter(num => num % 5 === 0)
	setValues(props.model, state.form)

	onCalendarSelected(state.form.calendarIds)

	state.range.dates[0] = state.form.startDate
	state.range.dates[1] = state.form.endDate
}

function checkCalendars() {
	state.form.calendarIds = state.selected.calendars.items.map(c => c.id)
	if(state.form.calendarIds.length) state.errors.clear('calendarIds')
	else state.errors.set('calendarIds', [`請選擇至少一個${ENTITY_TYPES.CALENDAR.title}`])
	
	return !state.errors.has('calendarIds')
}

function onSubmit() {
	v$.value.$validate().then(valid => {
		if(!valid) return
		checkCalendars()
		if(!periodPicker.value.checkErrors()) return
		let dates = periodPicker.value.getDates()
		state.form.startDate = dates[0].date
		state.form.endDate = dates[1].date
		
		var content = tiptap.value.getContent()
		state.form.content = content

		if(state.errors.any()) return
		emit('submit', state.form)
	})
}
function onRemove() {
	emit('remove')
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}
function onCalendarSelected(ids) {
	let items = []
	ids.forEach(id => {
		const item = props.calendars.find(c => c.id === id)
		items.push(item)
	})
	state.selected.calendars.items = items
	checkCalendars()
}
function onAllDay(val) {
	var dates = state.range.dates
	if(val) {
		dates.splice(0, 1, initByDate(dates[0]))
		if(dates[1]) {
			dates.splice(1, 1, null)
		}
		
	}else {
		const start = initByDate(dates[0], 10)
		dates.splice(0, 1, start)
		dates.splice(1, 1, initByDate(start, 11))
	}
}

</script>

<template>
   <form @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row dense>
			<v-col cols="12">
				<v-text-field :label="labels['title']"           
				v-model="state.form.title"
				:error-messages="v$.title.$errors.map(e => e.$message)"                     
				@input="v$.title.$touch"
				@blur="v$.title.$touch"
				/>
			</v-col>
			<v-col cols="4">
				<v-switch :label="labels['allDay']"  color="success"
				v-model="state.form.allDay"
				@update:modelValue="onAllDay" 
				/>
			</v-col>
			<v-col cols="8">
				
				<div class="mt-3">
					<span class="mt-1" >{{ ENTITY_TYPES.CALENDAR.title }} : </span>
					
					<v-chip v-for="item in state.selected.calendars.items" class="ma-1" color="primary" variant="flat">
						{{ item.title }}
					</v-chip>
					<v-menu :close-on-content-click="false" v-model="state.selected.calendars.active">
						<template v-slot:activator="{ props }">
							<a class="ma-3" href="#" v-bind="props" v-text="state.selected.calendars.items.length ? '選擇其他' : `選擇${ENTITY_TYPES.CALENDAR.title}`"
							@click.prevent="() => state.selected.calendars.active = true" >
							</a>
						</template>
						<v-card>
							<v-card-text>
								<v-row dense>
									<v-checkbox v-for="calendar in calendars"
									direction="horizontal" hide-details
									v-model="state.form.calendarIds"
									:label="calendar.title"
									:value="calendar.id"
									@update:modelValue="onCalendarSelected"
									/>
								</v-row>
							</v-card-text>
						</v-card>
					</v-menu>
				</div>	
				<CommonErrorsMessages v-show="state.errors.has('calendarIds')" :messages="[state.errors.get('calendarIds')]" />
				
			</v-col>
			<v-col cols="4">

			</v-col>
			
		</v-row>
		<CommonPickerPeriod ref="periodPicker" 
		:minimum_view="state.form.allDay ? 'day' : 'time'"
		:roc="true" :allow_same="state.form.allDay" 
		:hours_allow="state.range.hours_allow" :minutes_allow="state.range.minutes_allow"
		:required_start="true" :required_end="!state.form.allDay" 
		:dates="state.range.dates"
		/>
		<v-row v-show="false">
			<v-col cols="12">
				<p style="line-height: 2em;">
					<span v-text="labels['content']"></span>
					<span v-if="state.errors.content" class="text-red ml-2">{{ `*${VALIDATE_MESSAGES.REQUIRED(labels['content'])}`  }}</span>
				</p>
				<CommonEditorTiptap ref="tiptap"  :min_height="HEIGHT.S.toString()"
				:content="state.form.content"
				/>
			</v-col>
		</v-row>
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