<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { useStore } from 'vuex'
import { isEmptyObject, deepClone } from '@/utils'
import { ENTITY_TYPES, ACTION_TYPES, WIDTH } from '@/consts'

const name = 'ITSystemAppTable'
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

const entity_type = ENTITY_TYPES.DATABASE

const emit = defineEmits(['select'])
//const labels = computed(() => store.state.it_databases.labels)
const query = computed(() => store.state.it_databases.query)

watch(query, (new_value) => {
   // state.checkAll = false
   // state.checked_ids = []
})

const headers = [
{
   title: props.labels['title'],
   align: '',
   width: '10%',
   sortable: false,
   key: 'title',
},
{
   title: props.labels['importance'],
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'importance',
},
{
   title: '維運',
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'centralized',
},
{
   title: props.labels['url'],
   align: 'start',
   width: '10%',
   sortable: false,
   key: 'url',
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
// const modify_record_actions = computed(() => {
//    const actions = [ACTION_TYPES.CREATE, ACTION_TYPES.UPDATE, ACTION_TYPES.REVIEW]
//    return actions.map(item => item.name)
// })
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
		<template v-slot:item.title="{ item }">
         <a @click.prevent="select(item.id)" href="#" v-text="item.title"></a>
      </template>
      <template v-slot:item.importance="{ item }">
         <v-chip size="small">
            Default
         </v-chip>
      </template>
      <template v-slot:item.centralized="{ item }">
         {{ item.centralized ? labels['centralized'] : '本院維運' }}
      </template>
		<template v-slot:bottom="{ item }">
         <CommonTablePager  :model="model"
         @page_changed="onPageChanged" @size_changed="onPageSizeChanged"
         />
      </template>
   </v-data-table-server>
</template>