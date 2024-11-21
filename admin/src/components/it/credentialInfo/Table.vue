<script setup>
import { isEmptyObject, getValue, showPassword } from '@/utils'
import { ENTITY_TYPES } from '@/consts'


const name = 'ITCredentialInfoTable'
const props = defineProps({
	list: {
      type: Array,
      default: () => []
   },
	labels: {
      type: Object,
      default: null
   }
})
const emit = defineEmits(['edit', 'edit-pw'])
function edit(id) {
	emit('edit', id)
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function showPw(id) {
	showPassword({ type: ENTITY_TYPES.CREDENTIALINFO.name, id })
}
function editPw(id) {
	emit('edit-pw', id)
}

</script>

<template>
	<v-table>
		<thead>
			<tr>
				<th style="width: 30%;" v-text="getLabel('username')">
				</th>
				<th style="width: 30%;" v-text="getLabel('password')">					
				</th>
				<th style="width: 30%;" v-text="getLabel('ps')">			
				</th>
				<th style="width: 10%;">
					
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="item in list" :key="item.id">
				<td>{{ item.username }}</td>
				<td>
					<CommonButtonDefault size="x-small" color="warning"
					tooltip="查看密碼" icon="mdi-eye"
					@click="showPw(item.id)"
					/>
					<CommonButtonEdit class_name="ml-1" size="x-small" color="success"
					tooltip="修改密碼" 
					@edit="editPw(item.id)"					
					/>
				</td>
				<td>{{ item.ps }}</td>
				<td>
					<CommonButtonEdit size="x-small" 
					@edit="edit(item.id)"
					/>
				</td>
			</tr>
		</tbody>
  </v-table>
</template>