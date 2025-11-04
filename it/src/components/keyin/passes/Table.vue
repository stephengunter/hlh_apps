<script setup>
import { reactive } from 'vue'
import { WIDTH, ACTION_TITLES } from '@/consts'
import { deepClone, tryParseInt, isEmptyObject, getValue } from '@/utils'

const name = 'KeyinPassesTable'
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
	<v-table density="compact" style="max-width: 800px;">
		<thead>
			<tr>
				<th class="text-center" style="width: 100px;">
					{{ getLabel('account') }}
				</th>
				<th class="text-center" style="width: 120px;">
					{{ getLabel('unit') }}
				</th>
				<th class="text-center">
					{{ getLabel('name') }}
				</th>
				<th class="text-center" style="width: 120px;">
					{{ getLabel('highRun') }}
				</th>
				<th v-if="!pass" class="text-center" style="width: 120px;">
					{{ getLabel('leaveAtText') }}
				</th>
				<th v-if="!pass" class="text-center" style="width: 120px;">
					
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, index) in list" :key="index">
				<td v-text="item.account" class="text-center"></td>
				<td v-text="item.unit" class="text-center"></td>
				<td v-text="item.name" class="text-center"></td>
				<td v-text="item.highRun" class="text-center"></td>
				<td v-if="!pass" v-text="item.leaveAtText" class="text-center"></td>
				<td v-if="!pass" class="text-center">
					<CommonButtonEdit size="x-small" 
					@edit="onEdit(item.id)"
					/>
				</td>
			</tr>
		</tbody>
	</v-table>
</template>