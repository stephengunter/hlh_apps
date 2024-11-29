<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { useStore } from 'vuex'
import { isEmptyObject, deepClone } from '@/utils'
import { ENTITY_TYPES, ACTION_TYPES, WIDTH } from '@/consts'

const name = 'ITHostTable'
const store = useStore()
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

const initialState = {
	
}
const state = reactive(deepClone(initialState))

const emit = defineEmits(['select'])

const headers = [
{
   title: `${props.labels['ip']}`,
   align: '',
   width: '10%',
   sortable: false,
   key: 'ip',
},
{
   title: `${props.labels['title']}`,
   align: '',
   width: '10%',
   sortable: false,
   key: 'title',
},
{
   title: props.labels['key'],
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'key',
},
{
   title: props.labels['ps'],
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'ps',
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

</script>


<template>
   <v-data-table-server
   v-model:items-per-page="model.pageSize"
   :headers="table_headers"
   :items-length="model.totalItems"
   :loading="props.loading"
   :items="list"
   >
      <template v-slot:item.ip="{ item }">
         <a href="#" @click.prevent="select(item.id)">{{ item.ip }}</a>
      </template>
		<template v-slot:bottom="{ item }">
         <CommonTablePager :model="model"
         @page_changed="onPageChanged" @size_changed="onPageSizeChanged"
         />
      </template>
   </v-data-table-server>
</template>