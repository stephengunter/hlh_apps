<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, 
	setValues, badRequest, tryParseInt, getValue, isTrue, tryParseIntOrNull
} from '@/utils'

const name = 'PropertyHead'
const emit = defineEmits(['submit', 'create'])
defineExpose({
   init, setQuery, getQuery, setCategory, setPageOption
})

const props = defineProps({
	query: {
      type: Object,
      default: null
   },
   categories: {
      type: Array,
      default: () => []
   },
	labels: {
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
   category_name: '',
   type_selected: null
}
const state = reactive(deepClone(initialState))
const tree = ref(null)

const fired_options = [{
   value: true, title: '已報廢'
},{
   value: false, title: '已下架'
}]

const query_match_route = computed(() => {
	if(route.query) {
		return areObjectsEqual(state.query, route.query, true)
	} return false
})

watch(route, init)
watch(() => props.category, () => {
   state.category_name = props.category.title
} ,{
   deep: true
})

function init() {
   if(isEmptyObject(route.query)) {
		router.push({ path: route.path, query: { ...props.query } })
      return
	}
	state.query = { ...route.query }
   state.query.deprecated = isTrue(state.query.deprecated)
   state.query.category = tryParseIntOrNull(state.query.category)
   if(state.query.category) {
      const category = props.categories.find(x => x.id === state.query.category)
      setCategory(category)
   }else {
      setCategory(null)
   }
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
function onDeprecatedSelected() {
   onSubmit()
}
function setCategory(category) {
	if(category) {
		state.category_name = category.title
		state.query.category = category.id
	}
	else {
		state.category_name = ''
		state.query.category = null
	}
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
            <CategorySelector density="compact" variant="outlined"
				:clearable="true"
				:keyword="state.category_name"
				:list="categories"
				@selected="setCategory"
				/>
         </v-col>
         <v-col cols="2">
         </v-col>
         <v-col cols="2">
         </v-col>
         <v-col cols="3">
            <v-switch color="primary" label="已報廢" hide-details 
            v-model="state.query.deprecated"
            @update:modelValue="onDeprecatedSelected"
            />
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