<script setup>
import { isEmptyObject, getValue, showPassword } from '@/utils'
import { ENTITY_TYPES } from '@/consts'


const name = 'ITDatabaseTable'
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
const emit = defineEmits(['edit', 'select'])
function edit(id) {
	emit('edit', id)
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function select(item) {
   emit('select', item)
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
            <th style="width: 15%;" v-text="getLabel('name')">
				</th>
            <th style="width: 15%;" v-text="getLabel('server')">			
				</th>
				<th style="width: 15%;" v-text="getLabel('title')">
				</th>
				<th style="width: 15%;" v-text="getLabel('ps')">					
				</th>
				
				<th style="width: 10%;">
					
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="item in list" :key="item.id">
				<td>
               <a @click.prevent="select(item)" href="#" v-text="item.name"></a>
            </td>
				<td>{{ item.server.name }}</td>
				<td>{{ item.title }}</td>
				<td>{{ item.ps }}</td>
			</tr>
		</tbody>
  </v-table>
</template>