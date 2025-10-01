<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { isEmptyObject, deepClone, getValue } from '@/utils'

const name = 'PostTable'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	labels: {
      type: Object,
      default: null
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
   roles: {
      type: Array,
      default: () => []
   },
   departments: {
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
   return [{
      title: '',
      align: 'center',
      width: '8%',
      sortable: false,
      key: 'check',
   },{
      title: getLabel('userName'),
      align: 'start',
      width: '15%',
      sortable: false,
      key: 'userName',
   },{
      title: getLabel('profiles.name'),
      align: 'start',
      width: '15%',
      sortable: false,
      key: 'profiles.name',
   },{
      title: getLabel('department'),
      align: 'start',
      width: '15%',
      sortable: false,
      key: 'department',
   },{
      title: getLabel('roles'),
      align: 'start',
      width: '20%',
      sortable: false,
      key: 'roles',
   }]
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

</script>


<template>
   <v-data-table-server v-if="!isEmptyObject(props.model)"
   v-model:items-per-page="model.pageSize"
   :headers="headers"
   :items-length="model.totalItems"
   :loading="props.loading"
   :items="list"
   >
      
      <template v-slot:bottom="{ item }">
         <CommonTablePager  :model="model"
         @page_changed="onPageChanged" @size_changed="onPageSizeChanged"
         />
      </template>
   </v-data-table-server>
</template>
