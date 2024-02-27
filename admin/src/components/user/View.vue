<script setup>
import { reactive, computed } from 'vue'

const name = 'UserView'
const props = defineProps({
	model: {
      type: Object,
      default: null
   },
	roles: {
      type: Array,
      default: () => []
   }
})
const emit = defineEmits(['edit'])

const lastUpdated = computed(() => props.model ? `${props.model.lastUpdated}` : '')

const roles = computed(() => props.model.roles ? props.model.roles.split(',').map(id => props.roles.find(r => r.id === id)) : [])

const labels = {
	'userName':'UserName',
   'email':'Email',
	'name':'名稱',
	'phoneNumber':'手機號碼',
	'roles':'角色',
	'active':'狀態',
	'createdAt':'建檔日期',
	'lastUpdated':'最後更新',
}

function edit() {
	emit('edit')
}
</script>

<template>
	<v-row>
		<v-col cols="6">
			<v-text-field :label="labels['userName']"
			readonly :model-value="model.userName"
			/>
			<v-text-field :label="labels['name']"
			readonly :model-value="model.name"
			/>
			<v-label style="width: 70px" v-text="labels['roles']"></v-label>
			<UserRoleLabel v-for="(role, index) in roles" :key="index"
			:model="role" 
			/>
		</v-col>
		<v-col cols="6">
			<v-text-field :label="labels['email']"
			readonly :model-value="model.email"
			/>
			<v-text-field :label="labels['phoneNumber']"
			readonly :model-value="model.phoneNumber"
			/>
			<v-label style="width: 70px" v-text="labels['active']"></v-label>
			<CommonChipActive
			:value="model.active" 
			/>
		</v-col>
	</v-row>
</template>