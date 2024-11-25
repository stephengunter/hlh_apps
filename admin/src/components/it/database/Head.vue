<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, reviewedOptions,
	setValues, badRequest, tryParseInt, getValue
} from '@/utils'

const name = 'ITDatabaseHead'
const emit = defineEmits(['submit', 'create', 'create-server', 'check-server'])
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
	server_options: {
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
}
const state = reactive(deepClone(initialState))

const query_match_route = computed(() => {
	if(route.query) {
		return areObjectsEqual(state.query, route.query, true)
	} return false
})
const server_selected = computed(() => {
   if(isEmptyObject(state.query)) {
		return false
	}
   if(state.query.serverId) return true
   return false
})

watch(route, init)

function init() {
   if(isEmptyObject(route.query)) {
		router.push({ path: route.path, query: { ...props.query } })
      return
	}
	
	state.query = { ...route.query }
   
   if(state.query.serverId) state.query.serverId = tryParseInt(state.query.serverId)
   emit('submit', state.query)
}
function setQuery(model) {
   setValues(model, state.query)
}
function getQuery() {
   return state.query
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function onQueryChanged() {
   onSubmit()
}
function onSubmit() {
	if(query_match_route.value) emit('submit', state.query)
	else router.push({ path: route.path, query: { ...state.query } })	
}
function createDb() {
   emit('create', state.query)
}

function createServer() {
   emit('create-server')
}
function checkServer() {
   emit('check-server', state.query.serverId)
}
</script>


<template>
   <form v-show="!isEmptyObject(state.query)" @submit.prevent="onSubmit">
      <v-row dense>
			<v-col cols="3">
				<v-select density="compact" :label="getLabel('server')"
				:items="server_options" v-model="state.query.serverId"
				@update:modelValue="onQueryChanged"
				/>
            
         </v-col>
         <v-col cols="1">
            <CommonButtonDefault v-if="server_selected"
            class_name="float-left" icon="mdi-link"
				tooltip="查看Server資訊"
				@click="checkServer"
				/>
         </v-col>
         <v-col cols="2">

         </v-col>
         <v-col cols="3">
         </v-col>
         <v-col cols="3">
            <CommonButtonCreate v-if="server_selected" class_name="float-right" 
				tooltip="新增"
				@create="createDb"
				/>
            <CommonButtonCreate v-else class_name="float-right" color="purple"
				tooltip="新增Db Server"
				@create="createServer"
				/>
         </v-col>
      </v-row>
   </form>

</template>