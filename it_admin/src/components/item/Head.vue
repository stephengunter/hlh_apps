<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, 
	setValues, badRequest, tryParseInt, getValue, isTrue
} from '@/utils'

const name = 'ItemHead'
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
   last_close: {
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
const status_options = [{
   value: true, title: '上架中'
},{
   value: false, title: '已下架'
}]

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
   state.query.active = isTrue(state.query.active)
   emit('submit', state.query)
}
function setQuery(model) {
   setValues(model, state.query)
}
function getQuery() {
   return state.query
}
function onActiveSelected(val) {
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
            <v-radio-group v-model="state.query.active" inline @update:modelValue="onActiveSelected">
					<v-radio v-for="(item, index) in status_options" :key="index"
					:label="item.title" :value="item.value"
					/>
				</v-radio-group>
         </v-col>
         <v-col cols="3" class="mt-1">
            <h3 v-if="state.query.active && !isEmptyObject(last_close)">前次結算：{{ last_close.date }}</h3>
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