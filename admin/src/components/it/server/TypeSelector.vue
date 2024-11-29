<script setup>
import { reactive, computed } from 'vue'
import { isEmptyObject, deepClone, getValue } from '@/utils'
import { SERVER_TYPES } from '@/consts'

const name = 'ITServerTypeSelector' 
const emit = defineEmits(['selected'])
const props = defineProps({
	type_options: {
      type: Array,
      default: () => []
   },
   type_selected: {
      type: Object,
      default: null
   },
   disabled: {
      type: Boolean,
      default: false
   }
})
const typeOptions  = computed(() => {
   if(props.type_selected) {
      return props.type_options.filter(item => item.value !== props.type_selected.value)
   }
   return props.type_options
})
function getSelectedTitle() {
   if(props.type_selected) return props.type_selected.title
   return '-----------'
}
function getIcon() {
   if(props.type_selected) return props.type_selected.icon
   return ''
}
function select(item) {
   emit('selected', item.value)
}
</script>
<template>
	<v-menu :disabled="disabled">
      <template v-slot:activator="{ props }">
         <v-btn v-if="type_selected" :prepend-icon="type_selected.icon" color="primary" v-bind="props">
            {{ getSelectedTitle() }}
         </v-btn>
         <v-btn v-else color="primary" v-bind="props">
            ---------------------
         </v-btn>
      </template>
      <v-list>
         <v-list-item v-for="(item, index) in typeOptions" 
         :key="index" :value="item.value" :prepend-icon="item.icon" 
         >
            <template v-slot:title>
               <a href="#" @click.prevent="select(item)" class="text-decoration-none">
               {{ item.title }}
               </a>
            </template>
         </v-list-item>
      </v-list>
   </v-menu>
</template>