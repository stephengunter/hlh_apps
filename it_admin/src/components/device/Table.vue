<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { isEmptyObject, deepClone, getValue } from '@/utils'

const name = 'DeviceTable'
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

const headers = computed(() => [{
      title: '',
      align: 'center',
      width: '8%',
      sortable: false,
      key: 'check',
   },{
      title: 'CategoryId',
      align: 'start',
      width: '10%',
      sortable: false,
      key: 'categoryId',
   },{
      title: 'kind',
      align: 'start',
      width: '10%',
      sortable: false,
      key: 'kind',
   },{
      title: getLabel('title'),
      align: 'start',
      width: '15%',
      sortable: false,
      key: 'title',
   },{
      title: getLabel('no'),
      align: 'start',
      width: '15%',
      sortable: false,
      key: 'no',
   },{
      title: getLabel('propNum'),
      align: 'start',
      width: '15%',
      sortable: false,
      key: 'propNum',
   },{
      title: getLabel('room'),
      align: 'start',
      width: '10%',
      sortable: false,
      key: 'room',
   },{
      title: getLabel('ps'),
      align: 'start',
      width: '10%',
      sortable: false,
      key: 'ps',
   }]
)

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
function departmentTitle(profiles) {
   if(!profiles.departmentId) return ''
   let department = props.departments.find(x => x.id === profiles.departmentId)
   if(department) return department.title
   return ''
}

</script>
<template>
   <div> 
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
</div>
</template>
