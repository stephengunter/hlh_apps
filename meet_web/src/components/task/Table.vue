<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { deepClone, isEmptyObject } from '@/utils'
import { ENTITY_TYPES, ACTION_TYPES } from '@/consts'

const name = 'TaskTable'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.TASK

const props = defineProps({
	model: {
		type: Object,
		default: null
	}
})
const emit = defineEmits(['select'])

const initialState = {
	
}
const state = reactive(deepClone(initialState))

const labels = computed(() => store.state.tasks.labels)



const headers = [{
   title: '',
   align: 'center',
   width: '3%',
   sortable: false,
   key: 'action',
},
{
   title: `${labels.value['title']}`,
   align: '',
   width: '85%',
   sortable: false,
   key: 'title',
},{
   title: '截止日期',
   align: '',
   width: '8%',
   sortable: false,
   key: 'deadLineText',
}]


const table_headers = computed(() => {
   return headers
})
const list = computed(() => isEmptyObject(props.model) ? [] : props.model.viewList)

function edit() {
	emit('edit', props.model.id)
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
function select(id) {
	emit('select', id)
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
			<a href="#" v-text="item.title" @click.prevent="select(item.id)"></a>
      </template>
		<template v-slot:bottom="{ item }">
         <CommonTablePager  :model="model"
         @page_changed="onPageChanged" @size_changed="onPageSizeChanged"
         />
      </template>
   </v-data-table-server>
</template>