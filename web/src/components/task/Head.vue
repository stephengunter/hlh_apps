<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, mergeProps } from 'vue'
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

const name = 'TaskHead'
const store = useStore()
const route = useRoute()
const router = useRouter()
const dateAdapter = new date.adapter({ locale: date.locale.zhTW })

const emit = defineEmits(['submit', 'add'])
defineExpose({
   init, setQuery, getQuery, setPageOption
})

const props = defineProps({
   
})

const initialState = {
	query: {
		page: 1,
		pageSize: 50
	}
}

const state = reactive(deepClone(initialState))

const query = computed(() => store.state.tasks.query)

const rules = computed(() => {
	return {
		
	}
})

const query_are_match = computed(() => {
	if(route.query) {
		return areObjectsEqual(state.query, route.query, true)
	} return false
})



function init() {
	if(route.query) copyFromQuery(state.query, route.query)
	if(!checkQuery()) {
	}

	onQueryChanged()
}
function checkQuery() {
	
	return true
}
function setQuery(model) {
   setValues(model, state.query)
	onQueryChanged()
}
function getQuery() {
   return state.query
}
function onQueryChanged() {
	onSubmit()
}
function setPageOption(option) {
	if(option.hasOwnProperty('page')) state.query.page = option.page
	if(option.hasOwnProperty('size')) state.query.pageSize = option.size
	onSubmit()
}
function onSubmit() {
	console.log('onSubmit')
	console.log('query_are_match.value', query_are_match.value)
	if(query_are_match.value) emit('submit', { ...state.query })
	else router.push({ name: ROUTE_NAMES.TASKS_INDEX, query: { ...state.query } })
}
function create() {
	emit('add')
}


</script>

<template>
	<div>
		<form @submit.prevent="onSubmit">
			<v-row dense>
				<v-col cols="10">

				</v-col>
				<v-col cols="2">
					<CommonButtonCreate class_name="float-right" 
					@create="create"
					/>
				</v-col>
			</v-row>	
		</form>
	</div>
</template>