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
const emit = defineEmits(['edit'])
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

</script>

<template>
	<v-table>
		<thead>
			<tr>
				<th style="width: 10%;">					
				</th>
				<th style="width: 20%;" v-text="getLabel('username')">
				</th>
				<th v-text="getLabel('password')">					
				</th>
				<th>
					備註				
				</th>
				<th style="width: 10%;">
					
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="item in list" :key="item.id">
				<td></td>
				<td>{{ item.username }}</td>
				<td>
					<v-btn v-if="item.password" variant="outlined" density="comfortable" color="primary"
					@click.prevent="showPw(item.id)"
					>
						點此查看
					</v-btn>
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