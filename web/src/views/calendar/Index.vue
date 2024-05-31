<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FETCH_CALENDAR_CATEGORIES } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS, SET_EVENTS_PARAMS } from '@/store/mutations.type'
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

const ENTITY_TYPE = ENTITY_TYPES.EVENT
const module_state = store.state.events
const head = ref(null)

const categories = computed(() => event_module.categories)

onMounted(() => {
	if(categories.value.length) init()
	else {
		return
		store.dispatch(FETCH_EVENT_CATEGORIES)
		.then(() => {
			nextTick(init)
		})
		.catch(error => onErrors(error))
	}
})
function init() {
	head.value.init()
}
function fetchData({ key, params }) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_EVENTS_CALENDAR, { key, params })
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