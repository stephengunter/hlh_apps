<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FETCH_CALENDARS } from '@/store/actions.type'
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
const ENTITY_TYPE = ENTITY_TYPES.CALENDAR
const module_state = store.state[ROUTE_NAMES.CALENDARS]

const head = ref(null)

const calendars = computed(() => module_state.list)

onBeforeMount(() => {
	if(calendars.value.length) {
		
	}else {
		fetchData(null)
	}
	
	//console.log('params', store.state['calendars'])
	//console.log('params', params.value)
	//if(params.value) setParams(params.value)
})

watch(route, () => {
	console.log('watch route')
})

// watch(params, (new_value) => {
// 	setParams(new_value)
// })

onMounted(() => {
	console.log('CalendarIndexView')
	return 
	if(calendars.value.length) init()
	else {
		return
		store.dispatch(FETCH_EVENT_calendars)
		.then(() => {
			nextTick(init)
		})
		.catch(error => onErrors(error))
	}
})
function init() {
	console.log('init')
	//head.value.init()
}
function fetchData(params) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_CALENDARS, params)
	.then(() => {
		
	})
	.catch(error => onErrors(error))
}

</script>

<template>
   <CalendarHead ref="head"
	@submit="fetchData" 
	/>
</template>