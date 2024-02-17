<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { isEmptyObject } from '@/utils'

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
   },
   roles: {
      type: Array,
      default: () => []
   }
})

const emit = defineEmits(['select', 'options_changed'])

const headers = [{
   title: 'UserName',
   align: 'start',
   width: '30%',
   sortable: false,
   key: 'userName',
},{
   title: '角色',
   align: 'start',
   width: '20%',
   sortable: false,
   key: 'roles',
}]

const list = computed(() => isEmptyObject(props.model) ? [] : props.model.viewList)

function roles(user) {
   return user.roles ? user.roles.split(',').map(id => props.roles.find(r => r.id === id)) : []
}
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
   :headers="headers"
   :items-length="model.totalItems"
   :loading="props.loading"
   :items="list"
   >
      <template v-slot:item.userName="{ item }">
         <a href="#" @click.prevent="select(item.id)">{{ item.userName }}</a>
         <span class="ml-3">{{ item.name }}</span>
      </template>
      <template v-slot:item.roles="{ item }">
         <UserRoleLabel v-for="(role, index) in roles(item)" :key="index"
         :model="role" 
         />
      </template>
      <template v-slot:bottom="{ item }">
         <CoreTablePager  :model="model"
         @page_changed="onPageChanged" @size_changed="onPageSizeChanged"
         />
      </template>
      
   </v-data-table-server>
</template>
