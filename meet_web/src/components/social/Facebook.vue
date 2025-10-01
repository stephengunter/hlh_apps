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
   <ShareNetwork network="facebook" 
   :url="props.url" :title="props.title" :description="props.description"
   hashtags="vuejs,vite,javascript"
   >
      <v-avatar image="@/assets/images/facebook.png" size="36" rounded="3" class="me-1">
      </v-avatar>
   </ShareNetwork>
</template>