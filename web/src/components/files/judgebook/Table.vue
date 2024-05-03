<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { useStore } from 'vuex'
import { isEmptyObject } from '@/utils'
import { ENTITY_TYPES } from '@/consts'

const name = 'FilesJudgebookTable'
const store = useStore()
const props = defineProps({
   model: {
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
   court_types: {
      type: Array,
      default: () => []
   }
})

const entity_type = ENTITY_TYPES.JUDGEBOOKFILE

const emit = defineEmits(['select', 'download', 'options_changed'])
const labels = computed(() => store.state.files_judgebooks.labels)

const headers = [{
   title: '',
   align: 'center',
   width: '5%',
   sortable: false,
   key: 'action',
},{
   title: labels.value['typeId'],
   align: 'start',
   width: '8%',
   sortable: false,
   key: 'typeId',
},{
   title: labels.value['courtType'],
   align: 'start',
   width: '8%',
   sortable: false,
   key: 'courtType',
},{
   title: labels.value['year'],
   align: 'start',
   width: '8%',
   sortable: false,
   key: 'year',
},{
   title: labels.value['category'],
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'category',
},{
   title: labels.value['num'],
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'num',
},{
   title: labels.value['ps'],
   align: 'start',
   width: '15%',
   sortable: false,
   key: 'ps',
},{
   title: '檔案',
   align: 'start',
   width: '20%',
   sortable: false,
   key: 'fileName',
},{
   title: labels.value['createdAtText'],
   align: 'start',
   width: '15%',
   sortable: false,
   key: 'createdAtText',
}]

const list = computed(() => isEmptyObject(props.model) ? [] : props.model.viewList)

function select(id) {
   emit('select', id)
}
function download(id) {
   emit('download', id)
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
function getCourtTypeTitle(key) {
   const type = props.court_types.find(x => x.value === key)
   return type.title
}

</script>


<template>
   <v-data-table-server
   v-model:items-per-page="model.pageSize"
   :headers="headers"
   :items-length="model.totalItems"
   :loading="props.loading"
   :items="list"
   >
		<template v-slot:item.action="{ item }">
         <CommonButtonEdit size="x-small" 
			@edit="select(item.id)"
			/>
      </template>
      <template v-slot:item.typeId="{ item }">
         {{ item.type.title }}
      </template>
      <template v-slot:item.courtType="{ item }">
         {{ getCourtTypeTitle(item.courtType) }}
      </template>
		<template v-slot:item.fileName="{ item }">
         <v-tooltip text="下載檔案">
            <template v-slot:activator="{ props }">
               <a href="#" v-bind="props" @click.prevent="download(item.id)">{{ item.fileName }}</a>
            </template>
         </v-tooltip>
      </template>
      <template v-slot:item.createdAtText="{ item }">
         <ModifyRecordButton :type="entity_type" :id="item.id.toString()"
         :text="item.createdAtText" 
         />         
      </template>
		<template v-slot:bottom="{ item }">
         <CommonTablePager  :model="model"
         @page_changed="onPageChanged" @size_changed="onPageSizeChanged"
         />
      </template>
   </v-data-table-server>
</template>