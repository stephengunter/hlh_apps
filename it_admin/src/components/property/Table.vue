<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { isEmptyObject, deepClone, getValue } from '@/utils'

const name = 'PropertyTable'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	labels: {
      type: Object,
      default: null
   },
   deprecated: {
      type: Boolean,
      default: false
   },
   loading: {
		type: Boolean,
		default: false
	},
   can_remove: {
      type: Boolean,
      default: false
   },
   can_edit: {
      type: Boolean,
      default: true
   },
   users: {
      type: Array,
      default: () => []
   },
   categories: {
      type: Array,
      default: () => []
   },
   locations: {
      type: Array,
      default: () => []
   }
})

const emit = defineEmits(['select', 'check', 'options_changed'])
defineExpose({
   getCheckIds, setCheckIds
})

const initialState = {
   checked_ids: []
}
const state = reactive(deepClone(initialState))

const headers = computed(() => {
   let items = [{
      title: '',
      align: 'center',
      width: '3%',
      sortable: false,
      key: 'check',
   },{
      title: getLabel('propertyType'),
      align: 'start',
      width: '5%',
      sortable: false,
      key: 'propertyTypeText',
   },{
      title: '分類',
      align: 'start',
      width: '5%',
      sortable: false,
      key: 'category',
   },{
      title: getLabel('title'),
      align: 'start',
      width: '10%',
      sortable: false,
      key: 'title',
   },{
      title: getLabel('number'),
      align: 'start',
      width: '10%',
      sortable: false,
      key: 'numberText',
   },{
      title: getLabel('brand'),
      align: 'start',
      width: '5%',
      sortable: false,
      key: 'brandName',
   },{
      title: getLabel('type'),
      align: 'start',
      width: '8%',
      sortable: false,
      key: 'type',
   },{
      title: getLabel('downDate'),
      align: 'start',
      width: '5%',
      sortable: false,
      key: 'downDate',
   },{
      title: getLabel('userName'),
      align: 'start',
      width: '5%',
      sortable: false,
      key: 'userName',
   },{
      title: getLabel('location'),
      align: 'start',
      width: '8%',
      sortable: false,
      key: 'location',
   },{
      title: getLabel('ps'),
      align: 'start',
      width: '10%',
      sortable: false,
      key: 'ps',
   }]

   const deprecatedKeys = ['propertyTypeText', 'category', 'title', 'numberText',
      'downDate', 'ps'
   ]
   if(props.deprecated) {
      return items.filter(x => deprecatedKeys.includes(x.key)) 
   } 


   return items
})



const list = computed(() => isEmptyObject(props.model) ? [] : props.model.viewList)

function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function getCheckIds() {
   return state.checked_ids 
}
function setCheckIds(ids) {
   return state.checked_ids = ids.slice(0)
}
function select(id) {
   emit('select', id)
}
function onCheckChanged() {
   emit('check', state.checked_ids)
}
function onPageChanged(page) {
   emit('options_changed', {
      page
   })
}     
function onPageSizeChanged(size) {
   emit('options_changed', {
      size 
   })
}
function userTitle(item) {
   const user = props.users.find(x => x.id === item.userId)   
   if(user && user.profiles.name) return user.profiles.name
   return item.userName
}
function categoryTitle(item) {
   const category = props.categories.find(x => x.id === item.categoryId)   
   if(category) return category.title
   return ''
}
function locationTitle(item) {
   const location = props.locations.find(x => x.id === item.locationId)   
   if(location) return location.title
   return item.locationName
}

</script>
<template>
   <div v-if="!isEmptyObject(props.model)"> 
      <v-data-table-server v-if="deprecated"
      v-model:items-per-page="model.pageSize"
      :headers="headers"
      :items-length="model.totalItems"
      :loading="props.loading"
      :items="list"
      >
         <template v-slot:item.category="{ item }">
            {{ categoryTitle(item) }}
         </template>
         <template v-slot:item.title="{ item }">
            {{ item.titleNameText }}
         </template>
         <template v-slot:item.userName="{ item }">
            {{ userTitle(item) }}
         </template>
         <template v-slot:item.location="{ item }">
            {{ locationTitle(item) }}
         </template>
         <template v-slot:bottom="{ item }">
            <CommonTablePager  :model="model"
            @page_changed="onPageChanged" @size_changed="onPageSizeChanged"
            />
         </template>
      </v-data-table-server>
      <v-data-table-server v-else
      v-model:items-per-page="model.pageSize"
      :headers="headers"
      :items-length="model.totalItems"
      :loading="props.loading"
      :items="list"
      >
         <template v-slot:item.category="{ item }">
            {{ categoryTitle(item) }}
         </template>
         <template v-slot:item.title="{ item }">
            {{ item.titleNameText }}
         </template>
         <template v-slot:item.userName="{ item }">
            {{ userTitle(item) }}
         </template>
         <template v-slot:item.location="{ item }">
            {{ locationTitle(item) }}
         </template>
         <template v-slot:bottom="{ item }">
            <CommonTablePager  :model="model"
            @page_changed="onPageChanged" @size_changed="onPageSizeChanged"
            />
         </template>
      </v-data-table-server>
   </div>
</template>
