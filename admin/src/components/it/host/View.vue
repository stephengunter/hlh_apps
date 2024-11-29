<script setup>
import { reactive, computed } from 'vue'
import { isEmptyObject, deepClone, getValue } from '@/utils'
import StatusChip from './StatusChip.vue'

const name = 'HostView'
const props = defineProps({
	model: {
      type: Object,
      default: null
   },
	labels: {
      type: Object,
      default: null
   }
})

function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
</script>

<template>
	<v-row dense>
		<v-col cols="4">
			<v-text-field :label="getLabel('title')"
			readonly :model-value="model.title"
			/>
		</v-col>
		<v-col cols="4">
			<v-text-field :label="getLabel('key')"
			readonly :model-value="model.key"
			/>
		</v-col>
		<v-col cols="4">
			<v-text-field :label="getLabel('ip')"
			readonly :model-value="model.ip"
			/>
		</v-col>
	</v-row>	
	<v-row dense>
		<v-col cols="4">
			<StatusChip :model="model" class_name="mb-2"
			/>			
		</v-col>
		<v-col cols="4">
			
		</v-col>
		<v-col cols="4">
		</v-col>
		
	</v-row>
	<v-row dense>
		<v-col cols="12">
			<v-textarea auto-grow :label="getLabel('ps')"  
			v-model="model.ps"	
			/>
		</v-col>
	</v-row>
</template>