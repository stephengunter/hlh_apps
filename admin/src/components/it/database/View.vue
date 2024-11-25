<script setup>
import { reactive, computed } from 'vue'
import { isEmptyObject, deepClone, getValue } from '@/utils'

const name = 'DatabaseView'
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
		<v-col cols="6">
			<v-text-field :label="getLabel('name')"
			readonly :model-value="model.name"
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field :label="getLabel('title')"
			readonly :model-value="model.title"
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field :label="getLabel('server')"
			readonly :model-value="model.server.name"
			/>
		</v-col>
		<v-col cols="6">
		</v-col>
		<v-col cols="12">
			<v-textarea auto-grow :label="getLabel('ps')"  
			v-model="model.ps"	
			/>
		</v-col>
	</v-row>
</template>