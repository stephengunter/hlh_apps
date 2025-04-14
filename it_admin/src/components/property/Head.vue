<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { FILE_TYPES } from '@/consts'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, 
	setValues, badRequest, tryParseInt, getValue, isTrue, tryParseIntOrNull
} from '@/utils'
const name = 'PropertyHead'
const emit = defineEmits(['submit', 'report', 'upload'])
defineExpose({
   init, setQuery, getQuery, setCategory, setPageOption
})

const props = defineProps({
	query: {
      type: Object,
      default: null
   },
   type_options: {
      type: Array,
      default: () => []
   },
   categories: {
      type: Array,
      default: () => []
   },
   groupViews: {
      type: Array,
      default: () => []
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
const deprecated_options = [{
   value: true, title: '已報廢'
},{
   value: false, title: '正常'
}]
const active_options = [{
   value: -1, title: '已下架'
},{
   value: 1, title: '上架中'
},{
   value: 0, title: '全部'
}]

const initialState = {
	query: {
	},
   category_name: '',
   location_name: '',
   upload: {
      accept_types: ['.xls', '.xlsx', 'application/vnd.ms-excel', FILE_TYPES.EXCEL ]
   }
}
const state = reactive(deepClone(initialState))
const file_upload = ref(null)

const query_match_route = computed(() => {
	if(route.query) {
		return areObjectsEqual(state.query, route.query, true)
	} return false
})
const category_list = computed(() => {
   if(props.categories.length) {
      let list = [{
         id: -1, title: 'null'
      },{
         id: 0, title: '全部'
      }]
      return list.concat(props.categories)
   }
   return []
})
const has_category = computed(() => {
   if(state.category_name) return true
   return false
})
const has_location = computed(() => {
   if(state.location_name) return true
   return false
})

const can_report = computed(() => {
   if(has_category.value) return false
   return has_location.value
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
   state.query.deprecated = isTrue(state.query.deprecated)
   state.query.down = tryParseInt(state.query.down)
   state.query.type = tryParseInt(state.query.type)
   state.query.category = tryParseInt(state.query.category)
   const category = category_list.value.find(x => x.id === state.query.category)
   setCategory(category, submit)
   // console.log('query', state.query)
   // if(state.query.category && state.query.category > 0) {
   //    const category = props.categories.find(x => x.id === state.query.category)
   //    console.log('state.query.category', state.query.category)
   //    setCategory(category, submit)
   // }else if(state.query.category && state.query.category < 0) {
   //   console.log('state.query.category', state.query.category)
   //    setCategory(null, submit)
   // }else {
   //    setCategory(null, submit)
   // }
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
function upload() {
   emit('upload')
}
function onFileAdded(files) {
   if(files.length) emit('upload', files[0])
   file_upload.value.reset()
}
function setCategory(category, submit = true) {
   state.category_name = category.title
	state.query.category = category.id
	// if(category) {
	// 	state.category_name = category.title
	// 	state.query.category = category.id
	// }
	// else {
	// 	state.category_name = ''
	// 	state.query.category = null
	// }
   if(submit) onSubmit()
}
function onCategoryGroupSelected(category) {
   if(category) {
      setCategory(category)
   }else {
      setCategory({ id: -1, title: 'null'})
   }
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

function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function onSubmit() {
	if(query_match_route.value) emit('submit', state.query)
	else router.push({ path: route.path, query: { ...state.query } })	
}
function report() {
   emit('report', state.query)
}

</script>


<template>
<div>
   <form v-show="!isEmptyObject(state.query)" @submit.prevent="onSubmit">
      <v-row dense>
         <v-col cols="1" >
            <v-select density="compact" variant="outlined" label="狀態" 
				:items="deprecated_options" v-model="state.query.deprecated"
				@update:modelValue="onSubmit"
				/>
         </v-col>
         <v-col cols="1">
            <v-select density="compact" variant="outlined" label="是否上架" 
				:items="active_options" v-model="state.query.down"
				@update:modelValue="onSubmit"
				/>
         </v-col>
         <v-col cols="1">
            <v-select density="compact" variant="outlined" :label="getLabel('propertyType')" 
				:items="type_options" v-model="state.query.type"
				@update:modelValue="onSubmit"
				/>
         </v-col>
			<v-col cols="2">
            <CategorySelector density="compact" variant="outlined"
				:clearable="false"
				:keyword="state.category_name"
				:list="category_list"
				@selected="setCategory"
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
         
         <v-col cols="2">
            
         </v-col>
         <v-col cols="3">
            <CommonButtonDefault icon="mdi-upload" class_name="float-right ml-1" 
				color="info" tooltip="上傳財產" :disabled="can_report"
				@click="upload"
				/>
            <CommonInputUpload ref="file_upload" :show_button="false" :show_files="false"
            :multiple="false" :is_media="false" :allow_types="state.upload.accept_types"
				@file-added="onFileAdded"
            />
            <CommonButtonDefault icon="mdi-file-document" class_name="float-right" 
				color="warning" tooltip="輸出報表" :disabled="!can_report"
				@click="report"
				/>
         </v-col>
      </v-row>
   </form>
   <PropertyGroupView v-if="groupViews.length" :list="groupViews"
   :categories="categories"
	@select="onCategoryGroupSelected"
   />
</div>   
</template>