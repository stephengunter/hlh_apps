<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { useStore } from 'vuex'
import { isEmptyObject, deepClone } from '@/utils'
import { ENTITY_TYPES, ACTION_TYPES, WIDTH } from '@/consts'

const name = 'ITDatabaseTable'
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
   }
})

const initialState = {
	
}

const state = reactive(deepClone(initialState))

const entity_type = ENTITY_TYPES.DATABASE

const emit = defineEmits(['select'])
const labels = computed(() => store.state.it_databases.labels)
const query = computed(() => store.state.it_databases.query)

watch(query, (new_value) => {
   // state.checkAll = false
   // state.checked_ids = []
})

const headers = [
{
   title: `${labels.value['title']}`,
   align: '',
   width: '10%',
   sortable: false,
   key: 'title',
},
{
   title: labels.value['key'],
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'key',
},
{
   title: labels.value['provider'],
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'provider',
}
]

const table_headers = computed(() => {
   // if(props.can_review && !props.disable_review) {
   //    let th_list = headers.slice()
   //    th_list.splice(0, 0, {
   //       title: '',
   //       align: 'start',
   //       width: '3%',
   //       sortable: false,
   //       key: 'check'
   //    })
   //    return th_list
   // }else return headers
	return headers
})

const list = computed(() => isEmptyObject(props.model) ? [] : props.model.viewList)
const modify_record_actions = computed(() => {
   const actions = [ACTION_TYPES.CREATE, ACTION_TYPES.UPDATE, ACTION_TYPES.REVIEW]
   return actions.map(item => item.name)
})
function select(id) {
   emit('select', id)
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
function checkReviewRecords(id) {
   // showModifyRecords({
   //    type:entity_type.name, id: id, 
   //    action: ACTION_TYPES.REVIEW.name, title: `${ACTION_TYPES.REVIEW.title}紀錄`, width: WIDTH.L
   // })
}
function onCheckAll(val) {
   // if(val) {
   //    state.checked_ids = list.value.map(item => item.id)
   // }else state.checked_ids = []
}

</script>


<template>
   <v-data-table-server
   v-model:items-per-page="model.pageSize"
   :headers="table_headers"
   :items-length="model.totalItems"
   :loading="props.loading"
   :items="list"
   >
		<template v-slot:item.action="{ item }">
         <CommonButtonEdit size="x-small"  
			@edit="select(item.id)"
			/>
      </template>
		<template v-slot:bottom="{ item }">
         <CommonTablePager  :model="model"
         @page_changed="onPageChanged" @size_changed="onPageSizeChanged"
         />
      </template>
   </v-data-table-server>
</template>