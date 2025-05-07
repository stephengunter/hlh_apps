<script setup>
import { isEmptyObject, getValue } from '@/utils'
import { ACTION_TYPES } from '@/consts'


const name = 'ItemTransactionTable'
const props = defineProps({
	list: {
		type: Array,
		default: () => []
	},
	labels: {
		type: Object,
		default: null
	},
   users: {
		type: Array,
		default: () => []
	},
   departments: {
		type: Array,
		default: () => []
	},
})
const emit = defineEmits(['edit'])
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function getDepartmentTitle(id) {
   if(!props.departments.length) return ''    
   const dep = props.departments.find(x => x.id === id)
   if(dep) return dep.title
   return ''
}

function getUserTitle(model) {
   if(!props.users.length) return ''    
   const user = props.users.find(x => x.id === model.userId)
   if(user) return user.profiles.name
   else {
      if(model.userName) return model.userName  
      return ''
   }
}
function edit(id) {
	emit('edit', id)
}
</script>

<template>
	<v-table>
		<thead>
			<tr>
            <th style="width: 7%;" >
				</th>
            <th style="width: 10%;" v-text="getLabel('date')">					
				</th>
            <th style="width: 20%;" v-text="getLabel('item')">					
				</th>
            
            <th style="width: 10%;" >進/出
				</th>
				<th style="width: 10%;" v-text="getLabel('quantity')">
				</th>
				<th style="width: 10%;" v-text="getLabel('departmentId')">
				</th>
            <th style="width: 10%;" v-text="getLabel('userId')">
				</th>
				<th style="width: 15%;" v-text="getLabel('ps')">	
								
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="model in list" :key="model.id">
            <td>
					<CommonButtonEdit size="x-small"
					@click="edit(model.id)" 
					/>
            </td>
            <td>
					{{ model.datetText }}
            </td>
				<td>
					{{ model.item.name }}
            </td>
				<td :style="model.in ? 'color: green' : ''"  >
					{{ model.in ? '進貨' : '出貨' }}
				</td>
            <td>
					{{ model.in ? model.inQuantity : model.outQuantity }}
				</td>
				<td>
					{{ getDepartmentTitle(model.departmentId) }}
				</td>
				
            <td>
					{{ getUserTitle(model) }}
				</td>
            <td>
					{{ model.ps }}
            </td>
			</tr>
		</tbody>
  </v-table>
</template>