<script setup>
import ButtonDefault from './Default.vue'

const name = 'ButtonBack'
const props = defineProps({
   tooltip: {
      type: String,
      default: '返回'
   },
   disabled: {
      type: Boolean,
      default: false
   },
   class_name: {
      type: String,
      default: ''
   },
   color: {
      type: String,
      default: ''
   },
   size: {
      type: String,
      default: 'small'
   },
   icon: {
      type: String,
      default: 'mdi-arrow-left-top-bold'
   },
   icon_only: {
      type: Boolean,
      default: false
   }
})

const emit = defineEmits(['back'])
</script>
<template>
   <ButtonDefault :tooltip="tooltip"
   :icon="icon" :color="color" :size="size"
   :disabled="disabled" :class_name="class_name"
   :icon_only="icon_only"
   @click="() => emit('back')" 
   />
  
</template>