<script setup>
import { reactive } from 'vue'
import { WIDTH, ACTION_TITLES } from '@/consts'
import { deepClone, tryParseInt, isEmptyObject, getValue } from '@/utils'

const name = 'FixTable'
const props = defineProps({
	labels: {
		type: Object,
		default: null
	},
	list: {
		type: Array,
		default: () => []
	},
	pass: {
		type: Boolean,
		default: false
	}
})
const emit = defineEmits(['edit'])

const initialState = {
	
}
const state = reactive(deepClone(initialState))
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function onEdit(id) {
   emit('edit', id)
}
</script>

<template>
	<v-table density="compact">
		<thead>
			<tr>
				<th class="text-center" style="width: 10%;">
					{{ getLabel('date') }}
				</th>
				<th class="text-center" style="width: 10%;">
					{{ getLabel('number') }}
				</th>
				<th class="text-center">
					{{ getLabel('user') }}
				</th>
				<th class="text-center" style="width: 15%;">
					{{ getLabel('content') }}
				</th>
				<th class="text-center" style="width: 10%;">
					{{ getLabel('count') }}
				</th>
				<th class="text-center" style="width: 15%;">
					{{ getLabel('result') }}
				</th>
				<th class="text-center">
					{{ getLabel('ps') }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, index) in list" :key="index">
				<td v-text="item.date" class="text-center"></td>
				<td v-text="item.number" class="text-center"></td>
				<td v-text="item.user" class="text-center"></td>
				<td v-text="item.content" class="text-center"></td>
				<td v-text="item.count" class="text-center"></td>
				
				<td v-text="item.result" class="text-center"></td>
				<td v-text="item.ps" class="text-center"></td>
			</tr>
		</tbody>
	</v-table>
</template>