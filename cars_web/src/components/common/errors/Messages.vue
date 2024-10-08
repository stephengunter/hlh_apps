<script setup>
const name = 'ErrorMessages'
const props = defineProps({
   messages: {
		type: Array,
		default: () => []
	}
})
</script>

<template>
   <div class="v-messages">
      <div v-for="message in messages" class="v-messages__message" style="color: rgb(139,0,0)">
         {{ message }}
      </div>
   </div>
</template>

<style scoped>
</style>
