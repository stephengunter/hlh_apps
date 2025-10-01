<script setup>
const name = 'ButtonDefault'
const props = defineProps({
   tooltip: {
      type: String,
      default: ''
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
      default: ''
   },
   icon_only: {
      type: Boolean,
      default: false
   }
})
const emit = defineEmits(['click'])

</script>
<template>
   <v-tooltip v-if="tooltip" top>
      <template v-slot:activator="{ props }">
         <v-btn  v-bind="props"
         :icon="icon" :color="color" :size="size"
         :disabled="disabled" :class="class_name"
         :variant="icon_only ? 'text' : 'elevated'"
         @click.prevent="() => emit('click')" 
         />
      </template>
      <span v-text="tooltip"></span>
   </v-tooltip>
   <v-btn v-else :icon="icon" :color="color" :size="size"
   :disabled="disabled" :class="class_name"
   :variant="icon_only ? 'text' : 'elevated'"
   @click.prevent="() => emit('click')" 
   />
</template>