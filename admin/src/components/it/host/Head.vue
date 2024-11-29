<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, isTrue,
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

const status_options = [{
   value: true, title: '啟用中'
},{
   value: false, title: '已停用'
}]

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

watch(route, init)


function init() {
   if(isEmptyObject(route.query)) {
		router.push({ path: route.path, query: { ...props.query } })
      return
	}
	
	state.query = { ...route.query }
	state.query.page = tryParseInt(state.query.page)
	state.query.pageSize = tryParseInt(state.query.pageSize)
	state.query.active = isTrue(state.query.active)

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
function onQueryChanged() {
   onSubmit()
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
            <v-radio-group v-model="state.query.active" inline @update:modelValue="onQueryChanged">
					<v-radio v-for="(item, index) in status_options" :key="index"
					:label="item.title" :value="item.value"
					/>
				</v-radio-group>
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