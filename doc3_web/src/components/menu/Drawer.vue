<script setup>
import { reactive, computed, onBeforeMount, watch } from 'vue'
import { isEmptyObject } from '@/utils'
import { deepClone } from '@/utils'
import { version } from 'vuex/dist/vuex.cjs.js';

const name = 'MenuDrawer'

const props = defineProps({
   item: {
      type: Object,
      default: null
   },
   current: {
      type: Object,
      default: null
   },
   version: {
      type: Number,
      default: 0
   }
})
const emit = defineEmits(['select'])

const initialState = {
   expand: false,
   parent_active: false,
   sub_active_name: ''
}
const state = reactive(deepClone(initialState))

const subMenuItems  = computed(() => props.item.getSubitems().filter(item => item.isMainMenuItem()))

watch(() => props.version, init)

onBeforeMount(init)

function init() {
   state.expand = props.item.expand
   state.parent_active = isParentActive()
}

function isParentActive() {
   if(props.item.active) return true
   if(props.item.expand) {
      let subActive = 0
      if(subMenuItems.value) {
         subMenuItems.value.forEach(sub => {
            if(sub.active) subActive += 1
         })
      }
      if(!subActive) return true
   }
   return false
}
function expand() {
   state.expand = !state.expand
}
function getTitle(item) {
   let parts = item.meta.title.split(',')

   if(parts.length === 1) return item.meta.title
   return parts[0]
}
function select() {
   emit('select', props.item)
}
</script>
<template>
  <v-list-item :prepend-icon="item.meta.icon" :active="state.parent_active" >
      <template v-slot:title>
         <a href="#" @click.prevent="select" style="color: white;" class="text-decoration-none">
         {{ getTitle(item) }}  
         </a>
      </template>
      <template v-if="subMenuItems.length" v-slot:append>
         <v-btn variant="text" :icon="state.expand ? 'mdi-menu-down' : 'mdi-menu-right'" 
         @click.prepend="expand"
         />
      </template>
   </v-list-item>
   <div v-show="state.expand">
      <v-list-item style="margin-left : 45px"
      v-for="subItem in subMenuItems"  :key="subItem.name"
      :active="subItem.active" 
      color="info"
      :title="getTitle(subItem)"
      :prepend-icon="subItem.meta.icon"
      :value="subItem.name"
      :to="subItem.path"
      />
   </div>
</template>
