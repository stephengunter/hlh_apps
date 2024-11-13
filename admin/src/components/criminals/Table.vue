<script setup>
import { reactive, computed } from 'vue'
import { WIDTH, ACTION_TITLES } from '@/consts'
import { deepClone, isEmptyObject } from '@/utils'

const name = 'CriminalsTable'
const props = defineProps({
	model: {
		type: Object,
		default: null
	},
   records: {
		type: Array,
		default: () => []
	},
	loading: {
		type: Boolean,
		default: false
	}
})

const headers = [{
   title: '查詢者代碼',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'userCode',
},{
	title: '使用者姓名',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'userName',
},{
   title: '查詢者類別',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'queryKind',
},{
   title: '查詢日期',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'date',
},{
   title: '查詢時間',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'time',
},{
   title: '資料類別',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'dataKind',
},{
   title: '查詢條件',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'query',
},{
   title: 'IP',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'ip',
}]

const initialState = {
	
}
const state = reactive(deepClone(initialState))

const list = computed(() => {
   if(isEmptyObject(props.model)) {
      return props.records
   }else {
      return props.model.viewList
   }
})

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
   <v-data-table-virtual v-if="isEmptyObject(props.model)"
   :headers="headers" :items="list"
   >
      <template v-slot:item.date="{ item }">
        {{ `${item.year}/${item.month}/${item.day}` }}
      </template>
   </v-data-table-virtual>
   
   <v-data-table-server v-else
   v-model:items-per-page="model.pageSize"
   :headers="headers"
   :items-length="model.totalItems"
   :loading="props.loading"
   :items="list"
   >
      <template v-slot:item.date="{ item }">
        {{ `${item.year}/${item.month}/${item.day}` }}
      </template>
      <template v-slot:bottom="{ item }">
         <CommonTablePager :model="model"
         @page_changed="onPageChanged" @size_changed="onPageSizeChanged"
         />
      </template>
   </v-data-table-server>
</template>
