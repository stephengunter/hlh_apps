<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, 
	setValues, badRequest, tryParseInt, getValue
} from '@/utils'

const name = 'ItemTransactionHead'
const emit = defineEmits(['submit', 'create'])
defineExpose({
   init, setQuery, getQuery
})

const props = defineProps({
	query: {
      type: Object,
      default: null
   },
	labels: {
      type: Object,
      default: null
   },
	year_options: {
      type: Array,
      default: () => []
   },
   month_options: {
      type: Array,
      default: () => []
   },
   item_options: {
      type: Array,
      default: () => []
   }
})
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	query: {
	},
   item: ''
}
const state = reactive(deepClone(initialState))
const query_match_route = computed(() => {
	if(route.query) {
		return areObjectsEqual(state.query, route.query, true)
	} return false
})

watch(route, init)

function init() {
   if(isEmptyObject(route.query)) {
		router.push({ path: route.path, query: { ...props.query } })
      return
	}
	
	state.query = { ...route.query }
   state.query.year = tryParseInt(state.query.year)
	state.query.month = tryParseInt(state.query.month)
	state.query.item = tryParseInt(state.query.item)
   
   if(state.query.item) {
      const item = props.item_options.find(x => x.value === state.query.item)
      setItem(item)
   }else setItem(null)
   
	
   
   
}
function setQuery(model) {
   setValues(model, state.query)
}
function getQuery() {
   return state.query
}
function setItem(item) {
	if(item) {
		state.item = item.title
		state.query.item = item.value
	}
	else {
		state.item = ''
		state.query.item = null
	}
   emit('submit', state.query)
}
function onYearSelected(val) {
   onSubmit()
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function onSubmit() {
	if(query_match_route.value) emit('submit', state.query)
	else router.push({ path: route.path, query: { ...state.query } })	
}
function create() {
   emit('create', state.query)
}

</script>



<template>
   <form v-show="!isEmptyObject(state.query)" @submit.prevent="onSubmit">
      <v-row dense>
			<v-col cols="2">
            <v-select density="compact" variant="outlined" :label="getLabel('year')" 
				:items="year_options" v-model="state.query.year"
				@update:modelValue="onYearSelected"
				/>
         </v-col>
         <v-col cols="2">
            <v-select density="compact" variant="outlined" :label="getLabel('month')" 
				:items="month_options" v-model="state.query.month"
				@update:modelValue="onYearSelected"
				/>
         </v-col>
         <v-col cols="4">
            <ItemSelector :label="getLabel('item')" density="compact" variant="outlined"
				:clearable="true"
				:keyword="state.item"
				:list="item_options"
				@selected="setItem"
				/>
         </v-col>
         <v-col cols="4">
            <CommonButtonCreate class_name="float-right" 
				tooltip="新增"
				@create="create"
				/>
         </v-col>
      </v-row>
   </form>
</template>