<script setup>
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { deepClone } from '@/utils'

const name = 'LocationTree'
const store = useStore()
const props = defineProps({
   root: {
      type: Object,
      default: null
   },
   show_key: {
      type: Boolean   ,
      default: false
   }
})


const initialState = {
   version: 0,
   active_ids: []
}

defineExpose({
   init
})

const state = reactive(deepClone(initialState))


const emit = defineEmits(['select', 'add', 'orders'])

function init() {
   if(!state.active_ids.length) state.active_ids = store.state.locations.all.map(c => c.id)
   state.version += 1
}

function select(id) {
   emit('select', id)
}
function active(id) {
	let index = state.active_ids.indexOf(id)
	if(index > -1) state.active_ids.splice(index, 1)
	else state.active_ids.push(id)
}
function addSub(parentId) {
   emit('add', parentId)
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
         <a href="#" class="text-decoration-none" 
         v-text="show_key ? `${model.key} ${model.title}` : model.title"
         @click.prevent="select(model.id)"
         >
         </a>
      </template>
      <template v-slot:append="{ model }">
         
         <v-tooltip :text="`在 ${model.title} 之下增加新位置`">
            <template v-slot:activator="{ props }">
               <v-btn class="mb-1 ml-1" v-bind="props" density="compact" flat icon="mdi-plus" size="small"
               @click.prevent="addSub(model.id)"
               />
            </template>
         </v-tooltip>
         
      </template>
   </TreeItem>
</template>