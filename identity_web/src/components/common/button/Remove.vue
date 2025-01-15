<script setup>
import ButtonDefault from './Default.vue'
const name = 'CommonButtonRemove'
const props = defineProps({
   tooltip: {
      type: String,
      default: '刪除'
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
      default: 'error'
   },
   size: {
      type: String,
      default: 'small'
   },
   icon: {
      type: String,
      default: 'mdi-trash-can'
   },
   icon_only: {
      type: Boolean,
      default: false
   }
})
const emit = defineEmits(['remove'])
</script>
<template>
   <ButtonDefault :tooltip="tooltip"
   :icon="icon" :color="color" :size="size"
   :disabled="disabled" :class_name="class_name"
   :icon_only="icon_only"
   @click="() => emit('remove')" 
   />
  
</template>