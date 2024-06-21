<script setup>
import ButtonDefault from './Default.vue'

const name = 'ButtonCreate'
const props = defineProps({
   tooltip: {
      type: String,
      default: '新增'
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
      default: 'info'
   },
   size: {
      type: String,
      default: 'small'
   },
   icon: {
      type: String,
      default: 'mdi-plus'
   },
   icon_only: {
      type: Boolean,
      default: false
   }
})

const emit = defineEmits(['create'])
</script>
<template>
   <ButtonDefault :tooltip="tooltip"
   :icon="icon" :color="color" :size="size"
   :disabled="disabled" :class_name="class_name"
   :icon_only="icon_only"
   @click="() => emit('create')" 
   />
  
</template>