<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { isEmptyObject, pageOptionsChanged } from '@/utils'
import { PAGER_OPTIONS, PER_PAGE_TEXT } from '@/consts'

const name = 'UserTable'
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

const emit = defineEmits(['select', 'options_changed'])

const headers = [{
   title: 'Id',
   align: 'start',
   width: '15%',
   sortable: false,
   key: 'id',
},{
   title: 'UserName',
   align: 'start',
   width: '25%',
   sortable: false,
   key: 'userName',
},{
   title: '角色',
   align: 'start',
   width: '20%',
   sortable: false,
   key: 'roles',
}]

const pager_options = PAGER_OPTIONS()
const list = computed(() => isEmptyObject(props.model) ? [] : props.model.viewList)

function onOptionChanged(options) {
   if(pageOptionsChanged(options, props.model)) emit('options_changed', options)
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
      <template v-slot:item.userName="{ item }">
         <a href="#" @click.prevent="select(item.id)">{{ item.userName }}</a>
      </template>
      <template v-slot:item.roles="{ item }">
         roles
      </template>
      
   </v-data-table-server>
</template>
