<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, 
	setValues, badRequest, tryParseInt, getValue, isTrue, tryParseIntOrNull
} from '@/utils'

const name = 'DeviceHead'
const emit = defineEmits(['select-category', 'set-category', 'submit', 'create', 'imports'])
defineExpose({
   init, setQuery, getQuery, setCategory, setPageOption
})

const props = defineProps({
	query: {
      type: Object,
      default: null
   },
   category: {
      type: Object,
      default: null
   },
   locations: {
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
   location_name: ''
}
const state = reactive(deepClone(initialState))
const tree = ref(null)

const fired_options = [{
   value: true, title: '已報廢'
},{
   value: false, title: '正常'
}]

const can_import = computed(() => {
   return true
})
const query_match_route = computed(() => {
	if(route.query) {
		return areObjectsEqual(state.query, route.query, true)
	} return false
})
const has_location = computed(() => {
   if(state.location_name) return true
   return false
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
   const submit = false
	state.query = { ...route.query }
   state.query.fired = isTrue(state.query.fired)
   state.query.category = tryParseIntOrNull(state.query.category)

   state.query.location = tryParseIntOrNull(state.query.location)
   if(state.query.location) {
      const location = props.locations.find(x => x.id === state.query.location)
      setLocation(location, submit)
   }else {
      setLocation(null, submit)
   }

   state.query.page = tryParseInt(state.query.page)
   state.query.pageSize = tryParseInt(state.query.pageSize)
   onSubmit()
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

function setLocation(location, submit = true) {
	if(location) {
		state.location_name = location.title
		state.query.location = location.id
	}
	else {
		state.location_name = ''
		state.query.location = null
	}
   if(submit) onSubmit()
}
function selectCategory() {
   emit('select-category', true)
}
function setCategory(category, submit = true) {
   if(category) {
      state.query.category = category.id
      state.category_name = category.title
   }
   else {
      state.query.category = null
      state.category_name = '' 
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
function imports() {
   emit('imports', state.query)
}

</script>


<template>
   <form v-show="!isEmptyObject(state.query)" @submit.prevent="onSubmit">
      <v-row dense>
         <v-col cols="1" >
            <v-select density="compact" variant="outlined" label="狀態" 
				:items="fired_options" v-model="state.query.fired"
				@update:modelValue="onSubmit"
				/>
         </v-col>
			<v-col cols="2">
            <v-text-field label="設備分類" readonly clearable  
				density="compact" variant="outlined" 
            :model-value="state.category_name"
            @click:control="selectCategory" @click:clear="() => setCategory(null)"
				/>
         </v-col>
         <v-col cols="2">
            <LocationSelector density="compact" variant="outlined"
				:clearable="has_location"
				:keyword="state.location_name"
				:list="locations"
				@selected="setLocation"
				/>
         </v-col>
         <v-col cols="3">
            <CommonButtonDefault icon="mdi-upload" class_name="float-right ml-1" 
				color="warning" tooltip="匯入舊資料" :disabled="!can_import"
				@click="imports"
				/>
            <CommonButtonCreate class_name="float-right" 
				tooltip="新增"
				@create="create"
				/>
         </v-col>
      </v-row>
   </form>
</template>