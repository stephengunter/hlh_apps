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
const emit = defineEmits(['details'])
function details(id) {
	emit('details', id)
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}

</script>

<template>
	<v-table v-if="props.month">
		<thead>
			<tr>
            <th style="width: 25%;" v-text="getLabel('item')">					
				</th>
            <th style="width: 25%;" v-text="getLabel('quantityChanged')">
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
					{{ model.quantityChanged }}
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
</template>