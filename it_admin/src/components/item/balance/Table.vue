<script setup>
import { isEmptyObject, getValue } from '@/utils'
import { ACTION_TYPES } from '@/consts'


const name = 'ItemBalanceTable'
const props = defineProps({
	month: {
		type: Number,
		default: 0
	},
	list: {
		type: Array,
		default: () => []
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
	<div>{{ props.labels }}
	<v-table v-if="props.month">
		<thead>
			<tr>
            <th style="width: 25%;" v-text="getLabel('item')">					
				</th>
				<th style="text-align: center;width: 15%;">前期庫存					
				</th>
            <th style="text-align: center;width: 15%;">本期入庫
				</th>
				<th style="text-align: center;width: 15%;">本期出庫
				</th>
				<th style="text-align: center;width: 15%;">期末庫存
				</th>
				<th v-text="getLabel('ps')">	
								
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="model in list" :key="model.id">
				<td>
					{{ model.item.name }}
            </td>
				<td style="text-align: center;">
					{{ model.lastStock }}
            </td>
				<td style="text-align: center;">
					{{ model.inQty }}
				</td>
				<td style="text-align: center;">
					{{ model.outQty }}
				</td>
				<td style="text-align: center;">
					{{ model.stock }}
				</td>
				<td>
					{{ model.ps }}
            </td>
			</tr>
		</tbody>
  </v-table>
  <v-table v-else>
		<thead>
			<tr>
            <th style="width: 25%;" v-text="getLabel('item')">					
				</th>
				<th style="width: 25%;" v-text="getLabel('stock')">
				</th>
				<th style="width: 25%;" v-text="getLabel('ps')">	
								
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="model in list" :key="model.id">
				<td>
					{{ model.item.name }}
            </td>
				<td>
					{{ model.stock }}
				</td>
				<td>
					{{ model.ps }}
            </td>
			</tr>
		</tbody>
  </v-table>
</div>
</template>