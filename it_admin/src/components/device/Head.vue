<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, 
	setValues, badRequest, tryParseInt, getValue, isTrue, tryParseIntOrNull
} from '@/utils'

const name = 'DeviceHead'
const emit = defineEmits(['select-category', 'set-category', 'submit', 'create'])
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

function init() {
   console.log('init head')
   if(isEmptyObject(route.query)) {
		router.push({ path: route.path, query: { ...props.query } })
      return
	}
   //console.log(tree.value)
	//tree.value.init()
	state.query = { ...route.query }
   state.query.fired = isTrue(state.query.fired)
   state.query.category = tryParseIntOrNull(state.query.category)
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
function onFiredSelected() {
   onSubmit()
}
function onActiveSelected(val) {
   onSubmit()
}
function selectCategory() {
   emit('select-category', true)
}
function setCategory(category) {
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

</script>


<template>
   <form v-show="!isEmptyObject(state.query)" @submit.prevent="onSubmit">
      <v-row dense>
			<v-col cols="3">
            <v-text-field label="設備分類" readonly clearable  
				density="compact" variant="outlined" 
            :model-value="state.category_name"
            @click:control="selectCategory" @click:clear="() => setCategory(null)"
				/>
         </v-col>
         <v-col cols="3">
            {{ category }}
         </v-col>
         <v-col cols="3">
            <v-switch color="primary" label="已報廢" hide-details 
            v-model="state.query.fired"
            @update:modelValue="onFiredSelected"
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