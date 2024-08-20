<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, reviewedOptions,
	setValues, badRequest, tryParseInt
} from '@/utils'

const name = 'ITDatabaseHead'
const emit = defineEmits(['submit'])
defineExpose({
   init, setQuery, getQuery, setPageOption
})

const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	query: {
		active: true,
      page: 1,
      pageSize: 10
	},
}
const state = reactive(deepClone(initialState))

const query = computed(() => store.state.it_databases.query)
const query_match_route = computed(() => {
	if(route.query) {
		return areObjectsEqual(state.query, route.query, true)
	} return false
})

watch(route, init)
watch(query, (new_value) => {
	setQuery(new_value)
})


onBeforeMount(() => {
	if(query.value) setQuery(query.value)
   // let review_options = reviewedOptions.slice(0)
	// review_options.splice(0, 0, {
	// 	value: -1, title: '全部'
	// })
	// state.options['review'] = review_options
})

function init() {
   initQuery()

   if(isEmptyObject(route.query)) {
      router.push({ path: route.path, query: { ...state.query } })
      return
   }

   copyFromQuery(state.query, route.query)
   initQuery()
   console.log('state.query', state.query)
   console.log('route.query', route.query)
   console.log('query_match_route', query_match_route.value)
   if(!query_match_route.value) {
      router.push({ path: route.path, query: { ...state.query } })
      return
   }

   const errors = checkQuery()
   if(errors.any()) {
      badRequest('BAD_REQUEST ', '錯誤的查詢參數', errors.getAll())
      return 
   }

   
   emit('submit', state.query)
}
function initQuery() {
	// if(!state.params.typeId) state.params.typeId = type_options.value[0].value
	// if(!state.params.courtType) state.params.courtType = courtType_options.value[0].value

	// setDepartments(state.params.courtType)
}
function setQuery(model) {
   setValues(model, state.query)
}
function getQuery() {
   return state.query
}
function setPageOption(option) {
	if(option.hasOwnProperty('page')) state.query.page = option.page
	if(option.hasOwnProperty('size')) state.query.pageSize = option.size
	onSubmit()
}
function checkQuery() {
	let errors = new Errors()
	// const year = state.params.year
   // if(!checkYear(year)) errors.set('year', [`錯誤的${labels['year']}`])

   // const num = state.params.num
   // if(!checkNum(num)) errors.set('num', [`錯誤的${labels['num']}`])

	return errors
}
function onSubmit() {
	if(query_match_route.value) emit('submit', state.query)
	else router.push({ path: route.path, query: { ...state.query } })	
}

</script>


<template>
   
</template>