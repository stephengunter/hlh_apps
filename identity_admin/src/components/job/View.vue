<script setup>
import { computed } from 'vue'
import { ENTITY_TYPES } from '@/consts'

const name = 'JobView'
const props = defineProps({
	model: {
      type: Object,
      default: null
   },
	department: {
      type: Object,
      default: null
   }
})

const departmentFullTitle = computed(() => {
	if(props.department) return props.department.getFullText()
	if(props.model.department) return props.model.department.title
	return ''
})

const labels = {
	'title': '職稱',
	'department': ENTITY_TYPES.DEPARTMENT.title,
	'role': '角色',
	'tel': '專線',
	'subTel': '分機',
	'ps': '備註',
	'active': '狀態'
}
</script>

<template>
	<v-row dense>
		<v-col cols="6">
			<v-text-field :label="labels['department']"
			readonly :model-value="departmentFullTitle"
			/>
			<v-text-field :label="labels['role']"
			readonly :model-value="model.roleText"
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field :label="labels['title']"
			readonly :model-value="model.jobTitle.title"
			/>
			<v-label style="width: 70px" v-text="labels['active']"></v-label>
			<CommonChipActive
			:value="model.active" 
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field :label="labels['subTel']"
			readonly :model-value="model.subTel"
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field :label="labels['tel']"
			readonly :model-value="model.tel"
			/>
		</v-col>
		<v-col cols="12">
			<v-text-field :label="labels['ps']"
			readonly :model-value="model.ps"
			/>
		</v-col>
	</v-row>
	
</template>