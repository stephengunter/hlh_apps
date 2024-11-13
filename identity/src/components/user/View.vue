<script setup>
import { reactive, computed } from 'vue'
import { isEmptyObject, deepClone, getValue } from '@/utils'

const name = 'UserView'
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
			<v-text-field :label="getLabel('userName')"
			readonly :model-value="model.userName"
			/>
			<v-text-field :label="getLabel('name')"
			readonly :model-value="model.name"
			/>
			<v-label style="width: 70px" v-text="getLabel('roles')"></v-label>
			<UserRoleLabel v-for="(role, index) in model.roles" :key="index"
			:model="role" :index="index"
			/>
			
		</v-col>
		<v-col cols="6">
			<v-text-field :label="getLabel('email')"
			readonly :model-value="model.email"
			/>
			<v-text-field :label="getLabel('phoneNumber')"
			readonly :model-value="model.phoneNumber"
			/>
			<v-label style="width: 70px" v-text="getLabel('active')"></v-label>
			<CommonChipActive
			:value="model.active" 
			/>
		</v-col>
	</v-row>
</template>