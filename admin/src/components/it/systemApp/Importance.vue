<script setup>
import { computed } from 'vue'

const name = 'ITSystemAppImportance'
const props = defineProps({
   value: {
		type: String,
		default: ''
	}
})
const color = computed(() => {
	const val = props.value.toLowerCase()
   if(val === 'medium') return 'info'
   if(val === 'high') return 'warning'
   return 'default'
})
</script>
<template>
   <v-chip size="small" :color="color">
		{{ value }}
	</v-chip>
</template>