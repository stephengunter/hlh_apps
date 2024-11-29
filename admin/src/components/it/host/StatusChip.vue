<script setup>
import { reactive, computed } from 'vue'
import { isEmptyObject, deepClone, getValue } from '@/utils'

const name = 'HostStatusChip'
const props = defineProps({
	model: {
      type: Object,
      default: null
   },
	class_name: {
      type: String,
      default: ''
   }
})
</script>
<template>
	<v-chip :class="class_name" :color="model.active ? 'success' : 'default'">
      {{ model.active ? '啟用中' : '已停用' }}
   </v-chip>
</template>