<script setup>
import { isEmptyObject, deepClone, getValue } from '@/utils'

const name = 'ProfilesView'
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
const emit = defineEmits(['add','edit'])

function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
</script>

<template>
	<v-row>
		<v-col cols="12">
			<v-text-field :label="getLabel('name')"
			readonly :model-value="model.name"
			/>
			<v-textarea :label="getLabel('ps')"
			readonly :model-value="model.ps"
			/>
			<v-text-field :label="getLabel('createdAt')"
			readonly :model-value="model.createdAtText"
			/>
			<v-text-field :label="getLabel('lastUpdated')"
			readonly :model-value="model.lastUpdatedText"
			/>
		</v-col>
	</v-row>
</template>