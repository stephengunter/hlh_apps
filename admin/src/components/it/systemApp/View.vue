<script setup>
import { reactive, computed } from 'vue'
import { isEmptyObject, deepClone, getValue } from '@/utils'
import ImportanceChip from './Importance.vue'

const name = 'ITSystemAppView'
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
	},
	server_options: {
		type: Array,
      default: () => []
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
			<v-text-field :label="getLabel('parentId')"
			readonly :model-value="model.title"
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field :label="getLabel('title')"
			readonly :model-value="model.title"
			/>
		</v-col>
	</v-row>	
	<v-row dense>	
		<v-col cols="3">
			<v-text-field :label="getLabel('key')"
			readonly :model-value="model.key"
			/>
		</v-col>
		<v-col cols="3">
			<CommonChipActive class="ma-3" :value="model.active"
			/>
		</v-col>
		<v-col cols="3">
			<v-switch :label="labels['centralized']"
			v-model="model.centralized" readonly
			color="success"
			/>
		</v-col>
		<v-col cols="3">
			<span v-text="labels['importance']"></span>
			<br>
			<ImportanceChip :value="model.importance"
			/>
		</v-col>
	</v-row>
	<v-row dense>	
		<v-col cols="6">
			<v-select :label="labels['type']" readonly
			:items="type_options" v-model="model.type"
			/>
		</v-col>
		<v-col cols="6">
			<v-select :label="labels['server']" readonly
			:items="server_options" v-model="model.serverId"
			/>
		</v-col>
	</v-row>	
	<v-row dense>	
		<v-col cols="12">
			<v-text-field :label="labels['url']"
			readonly :model-value="model.url"
			/>
		</v-col>
		<v-col cols="12">
			<v-textarea auto-grow :label="getLabel('ps')"  
			v-model="model.ps"	
			/>
		</v-col>
	</v-row>
</template>