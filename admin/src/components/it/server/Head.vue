<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, 
	setValues, badRequest, tryParseInt, getValue
} from '@/utils'
import TypeSelector from './TypeSelector.vue'

const name = 'ITServerHead'
const emit = defineEmits(['submit', 'create'])
defineExpose({
   init, setQuery, getQuery, setPageOption
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
   type_selected: null
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
   state.type_selected = props.type_options.find(x => x.value === state.query.type)
   
   emit('submit', state.query)
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
function onTypeSelected(val) {
   state.type_selected = props.type_options.find(x => x.value === val)
   state.query.type = val
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
			<v-col cols="3">
            <TypeSelector :type_options="type_options" :type_selected="state.type_selected"
            @selected="onTypeSelected"
            />
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