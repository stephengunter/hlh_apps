<script setup>
import { reactive, computed } from 'vue'
import { isEmptyObject, deepClone, getValue } from '@/utils'
import { SERVER_TYPES } from '@/consts'
import TypeSelector from './TypeSelector.vue'

const name = 'ServerView'
const props = defineProps({
	model: {
      type: Object,
      default: null
   },
	labels: {
      type: Object,
      default: null
   },
	type_options: {
		type: Array,
      default: () => []
	}
})

const type_selected = computed(() => {
	if(props.model && props.model.type) {
		return props.type_options.find(x => x.value === props.model.type)
	}
	return null
})
const isFTP = computed(() => props.model.type.toLowerCase() === SERVER_TYPES.FTP.name.toLowerCase())

function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
</script>

<template>
	<v-row dense>
		<v-col cols="6">
			<v-text-field :label="getLabel('title')"
			readonly :model-value="model.title"
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field :label="getLabel('key')"
			readonly :model-value="model.key"
			/>
		</v-col>
		<v-col cols="6">
			<TypeSelector :type_options="type_options" :disabled="true"
			:type_selected="type_selected"
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field :label="getLabel('provider')"
			readonly :model-value="model.provider"
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field :label="getLabel('host')"
			readonly :model-value="model.host.name"
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field v-if="isFTP" :label="getLabel('root')"
			readonly :model-value="model.root"
			/>
		</v-col>
		<v-col cols="12">
			<v-textarea auto-grow :label="getLabel('ps')"  
			v-model="model.ps"	
			/>
		</v-col>
	</v-row>
</template>