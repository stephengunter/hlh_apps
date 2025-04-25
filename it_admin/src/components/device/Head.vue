<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { WIDTH, FILE_TYPES } from '@/consts'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, 
	setValues, badRequest, tryParseInt, getValue, isTrue, tryParseIntOrNull
} from '@/utils'

const name = 'DeviceHead'
const emit = defineEmits(['select-category', 'set-category', 'submit', 'create', 'upload'])
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
   root_category: {
      type: Object,
      default: null
   },
   locations: {
      type: Array,
      default: () => []
   },
   groupViews: {
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
   category_tree: {
		title: '',
      active: false,
		width: WIDTH.L
   },
   upload: {
      accept_types: ['.xls', '.xlsx', 'application/vnd.ms-excel', FILE_TYPES.EXCEL ]
   },
   category_name: '',
   location_name: ''
}
const state = reactive(deepClone(initialState))
const tree = ref(null)
const file_upload = ref(null)

const fired_options = [{
   value: true, title: '已報廢'
},{
   value: false, title: '正常'
}]

const has_category = computed(() => {
   return state.query.category > 0
})
const has_location = computed(() => {
   if(state.location_name) return true
   return false
})
const can_upload = computed(() => {
   if(has_category.val) return false
   if(has_location.val) return false
   return true
})
const query_match_route = computed(() => {
	if(route.query) {
		return areObjectsEqual(state.query, route.query, true)
	} return false
})
const category_ids = computed(() => {
	if(props.categories && props.categories.length) return props.categories.map(x => x.id)
	return []
})

watch(route, init)

function init() {
   if(isEmptyObject(route.query)) {
		router.push({ path: route.path, query: { ...props.query } })
      return
	}
   const submit = false
	state.query = { ...route.query }
   state.query.fired = isTrue(state.query.fired)

   state.query.category = tryParseInt(state.query.category)
   if(state.query.category > 0) {
      const category = props.categories.find(x => x.id === state.query.category)
      setCategory(category, submit)
   }else setCategory(null, submit)

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
function initCategoryTree() {
   tree.value.init()
}

function selectCategory(val) {
	if(val) {
		state.category_tree.active = true
	}else {
		state.category_tree = deepClone(initialState.category_tree)
	}
}
function setCategory(category, submit = true) {
   console.log('setCategory', category)
   if(category) {
      state.query.category = category.id
      state.category_name = category.title
   }
   else {
      state.query.category = -1
      state.category_name = 'null' 
   }
   selectCategory(false)
   if(submit) {
      state.query.page = 1
      onSubmit()
   }
}

function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function onSubmit() {
   console.log('onSubmit')
	if(query_match_route.value) emit('submit', state.query)
	else router.push({ path: route.path, query: { ...state.query } })	
}
function create() {
   emit('create', state.query)
}
function upload() {
   file_upload.value.launch()
}
function onFileAdded(files) {
   if(files.length) emit('upload', files[0])
   file_upload.value.reset()
}

</script>


<template>
<div>
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
				color="warning" tooltip="匯入舊資料" :disabled="!can_upload"
				@click="upload"
				/>
            <CommonInputUpload ref="file_upload" :show_button="false" :show_files="false"
            :multiple="false" :is_media="false" :allow_types="state.upload.accept_types"
				@file-added="onFileAdded"
            />

            <CommonButtonCreate class_name="float-right" 
				tooltip="新增"
				@create="create"
				/>
         </v-col>
      </v-row>
   </form>
   <DeviceGroupView v-if="groupViews.length" :list="groupViews"
   :categories="categories"
	@select="onCategoryGroupSelected"
   />
   <v-dialog persistent v-model="state.category_tree.active" :width="state.category_tree.width + 50">
      <v-card v-if="state.category_tree.active" :max-width="state.category_tree.width">
         <CommonCardTitle :title="state.category_tree.title"
         @cancel="() => selectCategory(false)"  
         />
         <v-card-text>
            <CategoryTree ref="tree" :root="root_category" 
            :categories="categories":active_ids="category_ids" 
            @mounted="initCategoryTree"
            @select="setCategory"
            />
         </v-card-text>
      </v-card>
   </v-dialog>
</div>   
</template>