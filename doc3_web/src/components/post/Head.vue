<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, 
	setValues, badRequest, tryParseInt, getValue
} from '@/utils'

const name = 'PostHead'
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
	type_options: {
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
   datePicker: {
      roc: false,
      labels: [],

      dates: [],
      values: [],
      
      required_start: false,
      required_end: false,
      allow_same: true,

      key: '',
      title: '',
      lower_limit: null,
      upper_limit: null,
      active: false
   },
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
   emit('submit', state.query)
}
function setQuery(model) {
   setValues(model, state.query)
}
function getQuery() {
   return state.query
}
function onTypeSelected(val) {
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
			<v-col cols="6">
            <CommonPickerPeriod ref="period_picker" 
            :roc="state.datePicker.roc" :labels="state.datePicker.labels"
            :dates="state.datePicker.dates"  :values="state.datePicker.values"  
            />
         </v-col>
         <v-col cols="3">

         </v-col>
         <v-col cols="3">
            
         </v-col>
      </v-row>
   </form>
</template>