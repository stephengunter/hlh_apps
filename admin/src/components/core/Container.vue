<script setup>
const name = 'CoreContainer'   
const props = defineProps({
   id: {
      type: String,
      default: 'core-container',
   }
})
</script>
<template>
   <v-container :id="id" fluid tag="section">
      <slot />
   </v-container>
</template>