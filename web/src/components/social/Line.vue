<script setup>

const props = defineProps({
   url: {
		type: String,
		default: ''
	},
   title: {
		type: String,
		default: ''
	},
   description: {
		type: String,
		default: ''
	}
})
</script>

<template>
   <ShareNetwork network="line" 
   :url="props.url" :title="props.title" :description="props.description"
   hashtags="vuejs,vite,javascript"
   >
      <v-avatar image="@/assets/images/line.png" size="32" rounded="3" class="me-1">
      </v-avatar>
   </ShareNetwork>
</template>