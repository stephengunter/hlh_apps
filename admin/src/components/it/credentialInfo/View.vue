<script setup>
import { reactive, computed } from 'vue'
import { isEmptyObject, deepClone, getValue } from '@/utils'

const name = 'ITCredentialInfoView'
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
	<v-row>
		<v-col cols="6">
			<v-text-field :label="getLabel('title')"
			readonly :model-value="model.title"
			/>
			<v-text-field :label="getLabel('ip')"
			readonly :model-value="model.ip"
			/>
			
		</v-col>
		<v-col cols="6">
			
			<v-text-field :label="getLabel('key')"
			readonly :model-value="model.key"
			/>
		</v-col>
		<v-col cols="12">
			<v-textarea auto-grow :label="getLabel('ps')"  
			v-model="model.ps"	
			/>
		</v-col>
	</v-row>
</template>