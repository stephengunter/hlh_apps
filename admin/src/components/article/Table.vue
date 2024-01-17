<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { isEmptyObject } from '@/utils'
import { PAGER_OPTIONS, PER_PAGE_TEXT } from '@/consts'

const name = 'ArticleTable'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
   loading: {
		type: Boolean,
		default: false
	}
})
const emit = defineEmits(['select'])

const headers = [
   {
      title: '標題',
      align: 'start',
      width: '50%',
      sortable: false,
      key: 'title',
   },
   {
      title: '日期',
      align: 'start',
      sortable: false,
      key: 'createdAtText',
   },
]

const pager_options = PAGER_OPTIONS()

const list = computed(() => isEmptyObject(props.model) ? [] : props.model.viewList)

function onOptionChanged(e) {
   console.log('onOptionChanged', e)
}
function select(id) {
   emit('select', id)
}
</script>

<template>
   <v-data-table-server
   v-model:items-per-page="model.pageSize"
   :headers="headers"
   :items-length="model.totalItems"
   :loading="props.loading"
   :items-per-page-text="PER_PAGE_TEXT"
   :items-per-page-options="pager_options"
   :items="list"

   @update:options="onOptionChanged"
   >
      <template v-slot:item.title="{ item }">
         <a href="#" @click.prevent="select(item.id)">{{ item.title }}</a>
      </template>
   </v-data-table-server>
</template>