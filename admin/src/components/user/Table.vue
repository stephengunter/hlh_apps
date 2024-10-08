<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { isEmptyObject, deepClone } from '@/utils'

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
   },
   departments: {
      type: Array,
      default: () => []
   }
})

const emit = defineEmits(['select', 'check', 'options_changed'])
defineExpose({
   getCheckIds
})

const initialState = {
   checked_ids: []
}
const state = reactive(deepClone(initialState))

const headers = [{
   title: '',
   align: 'center',
   width: '8%',
   sortable: false,
   key: 'check',
},{
   title: 'UserName',
   align: 'start',
   width: '15%',
   sortable: false,
   key: 'userName',
},{
   title: '姓名',
   align: 'start',
   width: '15%',
   sortable: false,
   key: 'profiles.name',
},{
   title: '部門',
   align: 'start',
   width: '15%',
   sortable: false,
   key: 'department',
},{
   title: '角色',
   align: 'start',
   width: '20%',
   sortable: false,
   key: 'roles',
}]

const list = computed(() => isEmptyObject(props.model) ? [] : props.model.viewList)

function getCheckIds() {
   return state.checked_ids 
}
function roles(user) {
   return user.roles ? user.roles.split(',').map(id => props.roles.find(r => r.id === id)) : []
}
function select(id) {
   emit('select', id)
}
function onCheckChanged() {
   emit('check', state.checked_ids)
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
function departmentTitle(profiles) {
   if(!profiles.departmentId) return ''
   let department = props.departments.find(x => x.id === profiles.departmentId)
   if(department) return department.title
   return ''
}

</script>


<template>
   <v-data-table-server v-if="!isEmptyObject(props.model)"
   v-model:items-per-page="model.pageSize"
   :headers="headers"
   :items-length="model.totalItems"
   :loading="props.loading"
   :items="list"
   >
      <template v-slot:item.check="{ item }">
         <v-checkbox hide-details
         v-model="state.checked_ids"
         :value="item.id"
         @update:modelValue="onCheckChanged"
         />
      </template>
      <template v-slot:item.userName="{ item }">
         <a href="#" @click.prevent="select(item.id)">{{ item.userName }}</a>
      </template>
      <template v-slot:item.department="{ item }">
         {{ departmentTitle(item.profiles) }}
      </template>
      <template v-slot:item.roles="{ item }">
         <UserRoleLabel v-for="(role, index) in roles(item)" :key="index"
         :model="role" 
         />
      </template>
      <template v-slot:bottom="{ item }">
         <CommonTablePager  :model="model"
         @page_changed="onPageChanged" @size_changed="onPageSizeChanged"
         />
      </template>
   </v-data-table-server>
</template>
