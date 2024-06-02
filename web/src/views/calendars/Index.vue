<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FETCH_CALENDARS, FETCH_EVENTS } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile,
	 onErrors, onSuccess, setValues, is400, 
	resolveErrorData, isNumeric,
	buildQuery, bytesToBinary, getMimeType, showModifyRecords
} from '@/utils'
import { WIDTH, ROUTE_NAMES, VALIDATE_MESSAGES, ACTION_TYPES, ENTITY_TYPES } from '@/consts'


const name = 'CalendarIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const head = ref(null)
const calendar = ref(null)

const initialState = {
	year: 0,
	month: 0,
   date: [new Date()],
	viewMode: 'month',
	
	events: [{
		title: 'test title',
		start: new Date(2024, 5, 17, 10, 0, 0),
		end: new Date(2024, 5, 17, 11, 30, 0),
		color: 'deep-purple',
		allDay: false,
	}]
}

const state = reactive(deepClone(initialState))

const calendars = computed(() => store.state.calendars.list)
const labels = computed(() => store.state.calendars.labels)

watch(route, init)

onMounted(init)

function init() {
	console.log(new Date(2024, 6, 17, 10, 0, 0))
	console.log(new Date(2024, 6, 17, 11, 0, 0))
	if(calendars.value.length) head.value.init()
	else fetchCalendars()
	
}
function fetchCalendars() {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_CALENDARS)
	.then(() => nextTick(init))
	.catch(error => onErrors(error))
}
function fetchEvents(params) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_EVENTS, params)
	.then(() => {
		state.year = params.year
		state.month = params.month - 1
		console.log(calendar.value)
	})
	.catch(error => onErrors(error))
}

</script>

<template>
   <CalendarHead ref="head"
	:calendars="calendars" :labels="labels"
	@submit="fetchEvents" 
	/>
	<v-row class="mt-3">
		<v-col cols="12">
			<v-locale-provider locale="zhTW">
				<v-calendar :hide-header="true" :hide-week-number="true" 
				ref="calendar"
				:year="state.year" :month="state.month"
				v-model="state.date" :events="state.events"
				:view-mode="state.viewMode"
				>
					<template v-slot:event="model">
						<v-container>
							<div v-if="state.viewMode==='week'">
							AAA
							</div>
							<div v=-else>
								<v-badge
          color="error"
          content="6"
          inline
        ></v-badge>BBB
							</div>
							{{ state.month }}
							<!-- <a href="#" v-text="event.title"></a>
							10:00 ~ 12:00 -->
						</v-container>
					</template>
				</v-calendar>
			</v-locale-provider>
		</v-col>
   </v-row>
</template>