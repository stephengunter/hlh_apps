<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { WIDTH, ACTION_TITLES } from '@/consts'
import { deepClone, isEmptyObject } from '@/utils'

const name = 'FetchesTableMoj'
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
	//headers: []
}
const state = reactive(deepClone(initialState))
// onBeforeMount(init)

// function init() {
// 	let headers = [{
//       title: '姓名',
//       align: 'start',
//       width: '10%',
//       sortable: false,
//       key: 'name',
//    },{
//       title: '識別碼',
//       align: 'start',
//       width: '10%',
//       sortable: false,
//       key: 'identifier',
//    },{
//       title: '查詢案號',
//       align: 'start',
//       width: '10%',
//       sortable: false,
//       key: 'caseNumber',
//    },{
//       title: '查詢時間',
//       align: 'start',
//       width: '10%',
//       sortable: false,
//       key: 'queryTime',
//    },{
//       title: '查詢鍵項',
//       align: 'start',
//       width: '10%',
//       sortable: false,
//       key: 'queryKey',
//    },{
//       title: 'IP',
//       align: 'start',
//       width: '10%',
//       sortable: false,
//       key: 'ip',
//    }]

//    if(props.preview) {
//       headers.push({
//          title: '查詢時間',
//          align: 'start',
//          width: '10%',
//          sortable: false,
//          key: 'queryTime'
//       })
//    }else {
//       headers.push({
//          title: '查詢時間',
//          align: 'start',
//          width: '10%',
//          sortable: false,
//          key: 'queryTime'
//       })
//    }
// }

const headers = [{
   title: '姓名',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'name',
},{
	title: '識別碼',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'identifier',
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
