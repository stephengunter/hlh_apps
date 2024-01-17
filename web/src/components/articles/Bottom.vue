<script setup>
import { computed } from 'vue'
const props = defineProps({
   model: {
		type: Object,
		default: null
	}
})

const createdAt = computed(() => {
   if(props.model && props.model.createdAtText) return new Date(props.model.createdAtText)
   return null
})

</script>
<template>
   <v-row>
      <v-col v-if="createdAt" cols="4">
         <v-icon icon="mdi-clock" size="xs"></v-icon>
         <timeago class="font-weight-light bt-item ml-1" :datetime="createdAt" />
      </v-col>
      <v-col cols="4">
         <v-icon icon="mdi-eye-circle" size="xs"></v-icon>
         <span class="font-weight-light bt-item ml-1">345</span>
      </v-col>
      <v-col cols="4">
         <v-icon icon="mdi-comment" size="xs"></v-icon>
         <span class="font-weight-light bt-item ml-1">21</span>
      </v-col> 
   </v-row>
</template>

<style scoped>
.bt-item {
   font-size:small;
}
</style>