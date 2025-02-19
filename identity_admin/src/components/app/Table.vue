<script setup>
import { isEmptyObject, getValue, showPassword } from '@/utils'
import { ACTION_TYPES } from '@/consts'


const name = 'AppTable'
const props = defineProps({
	list: {
      type: Array,
      default: () => []
   },
	roles: {
      type: Array,
      default: () => []
   },
	labels: {
      type: Object,
      default: null
   }
})
const emit = defineEmits(['edit', 'select', 'reset-pw'])
function edit(id) {
	emit('edit', id)
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function getRoles(model) {
   if(model.roles) {
		let roleNames = model.roles.split(',')
		let roles = []
		roleNames.forEach(roleName => {
			let role = props.roles.find(x => x.value === roleName)
			roles.push({ name: roleName, title: role.title })
		})
		return roles
	}
   return []
}
function resetClientSecret(id) {
	emit('reset-pw', id)
}

</script>

<template>
	<v-table>
		<thead>
			<tr>
				<th style="width: 7%;">
				</th>
            <th style="width: 15%;" v-text="getLabel('name')">
				</th>
            <th style="width: 15%;" v-text="getLabel('clientId')">			
				</th>
				<th style="width: 15%;" v-text="getLabel('type')">	
				</th>
				<th style="width: 25%;" v-text="getLabel('url')">					
				</th>
				<th style="width: 15%;" v-text="getLabel('roles')">					
				</th>
				
			</tr>
		</thead>
		<tbody>
			<tr v-for="item in list" :key="item.id">
				<td>
					<CommonButtonEdit size="x-small"
					:tooltip="ACTION_TYPES.EDIT.title"
					@edit="edit(item.id)"
					/>
					<CommonButtonDefault v-if="item.type.toLowerCase() === 'api'" tooltip="重設密碼" class_name="ml-1"
					icon="mdi-lock-reset" color="warning" size="x-small"
					@click="resetClientSecret(item.id)" 
					/>
            </td>
				<td>
					{{ item.name }}
            </td>
				<td>
					{{ item.clientId }}
				</td>
				<td>
					{{ item.type }}
				</td>
				<td>
					{{ item.url }}
					<!-- <ul style="list-style: none;">
						<li v-for="uri in item.redirectUris" :key="item.uri">
							{{ uri }}
						</li>
					</ul> -->
				</td>
				<td>
					<UserRoleLabel v-for="(role, index) in getRoles(item)" :key="index"
					:model="role" :index="index"
					/>
				</td>
			</tr>
		</tbody>
  </v-table>
</template>