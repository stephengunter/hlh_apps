<script setup>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { deepClone } from '@/utils'
import { ACTION_TITLES } from '@/consts'

const name = 'UserView'
const props = defineProps({
	model: {
      type: Object,
      default: null
   },
   title: {
      type: String,
      default: '用戶資料'
   },
	roles: {
      type: Array,
      default: () => []
   },
	allow_edit: {
      type: Boolean,
      default: true
   }
})
const emit = defineEmits(['edit'])

const initialState = {
   
}
const state = reactive(deepClone(initialState))

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
	<v-card>
		<v-card-title>
			<span class="text-h5 font-weight-black">{{ title }}</span>
			<span v-if="model.id" class="headline ml-3">Id : {{ props.model.id }} </span>
			<v-tooltip v-if="allow_edit" :text="ACTION_TITLES.EDIT">
				<template v-slot:activator="{ props }">
					<v-btn v-bind="props" size="small" class="float-right" 
					icon="mdi-pencil" color="info"
					@click.prevent="edit"
					/>
				</template>
			</v-tooltip>
		</v-card-title>
		<v-card-text>
			<v-container>
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
						<CoreActiveLabel
						:value="model.active" 
						/>
					</v-col>
				</v-row>
			</v-container>
		</v-card-text>
	</v-card>
	
</template>