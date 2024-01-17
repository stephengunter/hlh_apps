<script setup>
const emit = defineEmits(['close'])
</script>

<template>
   <v-btn class="close-icon-btn ma-3" density="compact" variant="text" icon="mdi-close" 
   @click.prevent="() => emit('close')"
   />
</template>


<style scoped>
.close-icon-btn {
   position : absolute;
   top : 0;
   right:0;
}
</style>