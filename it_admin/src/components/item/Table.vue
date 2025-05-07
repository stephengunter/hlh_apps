<script setup>
import { isEmptyObject, getValue, showPassword } from '@/utils'
import { ACTION_TYPES } from '@/consts'


const name = 'ItemTable'
const props = defineProps({
	list: {
      type: Array,
      default: () => []
   },
	active: {
      type: Boolean,
      default: true
   },
	labels: {
      type: Object,
      default: null
   }
})
const emit = defineEmits(['edit', 'select', 'add-tran'])
function edit(id) {
	emit('edit', id)
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function select(id) {
	emit('select', id)
}
function addTran(id) {
	emit('add-tran', id)
}addTran
</script>

<template>
	<v-table v-if="active" hover>
		<thead>
			<tr>
				<th style="width: 7%;"
				>
				</th>
            <th style="width: 25%;" v-text="getLabel('name')">
				</th>
				<th style="text-align: center;width: 15%;">	
					最近180天出貨量

				</th>
            <th style="text-align: center;width: 10%;">	
					庫存

				</th>
				<th style="text-align: center;width: 10%;">
					安全庫存			
				</th>
				<th style="width: 25%;" v-text="getLabel('ps')">					
				</th>
				<th>					
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="item in list" :key="item.id">
				<td>
					<CommonButtonEdit size="x-small"
					@click="edit(item.id)" 
					/>
				</td>
				<td>
					<a href="#" @click.prevent="select(item.id)" v-text="item.name"></a>
            </td>
				<td style="text-align: center;">
					{{ item.outCount }}
				</td>
				<td :style="item.stock < item.saveStock ? 'text-align: center;color: red;' : 'text-align: center;'">
					{{ item.stock }}
				</td>
				<td style="text-align: center;">
					{{ item.saveStock }}
				</td>
				<td>
					{{ item.ps }}
				</td>
				<td>
					<CommonButtonDefault tooltip="新增交易"
					icon="mdi-window-open" color="success" size="x-small"
					@click="addTran(item.id)" 
   				/>
				</td>
			</tr>
		</tbody>
  </v-table>
  <v-table v-else hover>
		<thead>
			<tr>
				<th style="width: 7%;"
				>
				</th>
            <th style="width: 25%;" v-text="getLabel('name')">
				</th>
				<th style="width: 25%;" v-text="getLabel('ps')">					
				</th>
				<th>					
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="item in list" :key="item.id">
				<td>
					<CommonButtonEdit size="x-small"
					@click="edit(item.id)" 
					/>
				</td>
				<td>
					<a href="#" @click.prevent="select(item.id)" v-text="item.name"></a>
            </td>
				<td>
					{{ item.ps }}
				</td>
				<td v-if="active">
					<CommonButtonDefault tooltip="新增交易"
					icon="mdi-window-open" color="success" size="x-small"
					@click="addTran(item.id)" 
   				/>
				</td>
				<td v-else>
					
				</td>
			</tr>
		</tbody>
  </v-table>
</template>