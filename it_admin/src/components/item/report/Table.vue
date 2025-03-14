<script setup>
import { isEmptyObject, getValue } from '@/utils'
import { ACTION_TYPES } from '@/consts'


const name = 'ItemReportTable'
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
	<v-table>
		<thead>
			<tr>
            <th style="width: 25%;" v-text="getLabel('year')">					
				</th>
            <th style="width: 25%;" v-text="getLabel('month')">
				</th>
				<th style="width: 25%;" v-text="getLabel('ps')">
				</th>
				<th style="width: 25%;">	
								
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="item in list" :key="item.id">
				<td>
					{{ item.year }}
            </td>
				<td>
					{{ item.month ?  item.month : ''}}
				</td>
				<td>
					{{ item.ps }}
				</td>
				<td>
					<CommonButtonDefault tooltip="查看詳情" class_name="ml-1"
					icon="mdi-google-spreadsheet" color="info" size="x-small"
					@click="details(item.id)" 
					/>
            </td>
			</tr>
		</tbody>
  </v-table>
</template>