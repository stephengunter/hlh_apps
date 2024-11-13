<script setup>
import { getRoleColor } from '@/utils'

const name = 'UserRoleLabel'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
   index: {
		type: Number,
		default: 0
	}
})

function roleColor(role) {
   return getRoleColor(role)
}
</script>
<template>
   <v-chip v-if="model" variant="flat" size="small" :class="{ 'ml-1' : props.index > 0 }"
   :color="roleColor(model)" 
   >
   {{ model.title }}
   </v-chip>
</template>