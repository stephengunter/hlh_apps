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
   <ShareNetwork network="twitter"
   :url="url" :title="title" :description="description"
   quote="The hot reload is so fast it\'s near instant. - Evan You"
   hashtags="vuejs,vite,javascript"
   >
      <v-avatar image="@/assets/images/twitter.png" size="36" rounded="3" class="me-1">
      </v-avatar>
   </ShareNetwork>
</template>