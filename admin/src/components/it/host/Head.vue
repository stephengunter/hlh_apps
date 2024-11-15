<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, reviewedOptions,
	setValues, badRequest, tryParseInt
} from '@/utils'

const name = 'ITHostHead'
const emit = defineEmits(['submit', 'create'])
defineExpose({
   init, setQuery, getQuery, setPageOption
})

const props = defineProps({
	query: {
      type: Object,
      default: null
   }
})
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	query: {
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
// watch(query, (new_value) => {
// 	setQuery(new_value)
// })

function init() {
   initQuery()
   emit('submit', state.query)
}
function initQuery() {
	if(isEmptyObject(route.query)) {
		router.push({ path: route.path, query: { ...props.query } })
      return
	}
	
	state.query = { ...route.query }
	state.query.page = tryParseInt(state.query.page)
	state.query.pageSize = tryParseInt(state.query.year)
	state.query.month = tryParseInt(state.query.month)
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
function create() {
   emit('create')
}

</script>


<template>
   <form v-show="!isEmptyObject(state.query)" @submit.prevent="onSubmit">
      <v-row dense>
			<v-col cols="3">
         </v-col>
         <v-col cols="3">

         </v-col>
         <v-col cols="3">

         </v-col>
         <v-col cols="3">
            <CommonButtonCreate class_name="float-right" 
				tooltip="新增"
				@create="create"
				/>
         </v-col>
      </v-row>
   </form>
</template>