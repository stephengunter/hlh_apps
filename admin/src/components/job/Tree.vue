<script setup>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { deepClone } from '@/utils'
import { ENTITY_TYPES } from '@/consts'

const name = 'JobTree'
const store = useStore()
const props = defineProps({
   root: {
      type: Object,
      default: null
   }
})


const initialState = {
   version: 0,
   active_ids: []
}
const state = reactive(deepClone(initialState))

const emit = defineEmits(['select', 'add', 'edit'])
defineExpose({
   init
})

const jobs  = computed(() => store.state.jobs.list)

const entity =  ENTITY_TYPES.JOB


function init() {
   if(!state.active_ids.length) state.active_ids = store.state.departments.all.map(c => c.id)
   state.version += 1
}
function getJobs(depId) {
   const items = jobs.value ? jobs.value.filter(item => item.departmentId === depId) : []
   return items.sort((a, b) => {
         return b.role - a.role
      })
}
function select(id) {
   emit('select', id)
}
function edit(job) {
   emit('edit', job)
}
function active(id) {
	let index = state.active_ids.indexOf(id)
	if(index > -1) state.active_ids.splice(index, 1)
	else state.active_ids.push(id)
}
function addSub(depId) {
   emit('add', depId)
}
function saveOrder(ids) {
   emit('orders', ids)
}

</script>
<template>
   <TreeItem v-if="props.root" :model="root"
   :active_ids="state.active_ids" :version="state.version"
   :on_active="active" :on_orders="saveOrder"
   >
      <template v-slot:title="{ model }">
         {{  model.title }}
      </template>
      <template v-slot:append="{ model }">
         <v-tooltip :text="`在 ${model.title} 之下增加新${entity.title}`">
            <template v-slot:activator="{ props }">
               <v-btn class="mb-1 ml-1" v-bind="props" density="compact" flat icon="mdi-plus" size="small"
               @click.prevent="addSub(model.id)"
               />
            </template>
         </v-tooltip>
         
      </template>
      <template v-slot:bottom="{ model }" >
         <div style="margin-left : 25px">
            <v-card flat max-width="400">
               <JobTable :list="getJobs(model.id)" 
               :on_edit="edit"
               />
            </v-card>
            
         </div>
      </template>
   </TreeItem>
</template>