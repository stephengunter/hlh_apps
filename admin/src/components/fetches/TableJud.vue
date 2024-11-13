<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { WIDTH, ACTION_TITLES } from '@/consts'
import { deepClone, isEmptyObject } from '@/utils'

const name = 'FetchesTableJud'
const props = defineProps({
   preview: {
		type: Boolean,
		default: false
	},
   records: {
		type: Array,
		default: () => []
	}
})

const initialState = {
}
const state = reactive(deepClone(initialState))
const headers = [{
   title: '姓名',
   align: 'start',
   width: '8%',
   sortable: false,
   key: 'name',
},{
	title: '識別碼',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'identifier',
},{
   title: '系統別',
   align: 'start',
   width: '8%',
   sortable: false,
   key: 'courtType',
},{
   title: '查詢案號',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'caseNumber',
},{
   title: '查詢時間',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'queryTime',
},{
   title: '查詢鍵項',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'queryKey',
},{
   title: 'IP',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'ip',
},{
   title: '備註',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'ps',
}]


</script>

<template>
   <v-data-table-virtual 
   :headers="headers" :items="records"
   >
      <template v-if="preview" v-slot:item.queryTime="{ item }">
        {{ item.queryTime }}
      </template>
      <template v-else v-slot:item.queryTime="{ item }">
        {{ `${item.year}/${item.month}/${item.day}  ${item.time}` }}
      </template>
   </v-data-table-virtual>
</template>
