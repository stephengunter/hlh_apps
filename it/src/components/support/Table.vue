<script setup>
import { reactive } from 'vue'
import { WIDTH, ACTION_TITLES } from '@/consts'
import { deepClone, tryParseInt, isEmptyObject, getValue } from '@/utils'

const name = 'SupportTable'
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
					{{ getLabel('user') }}
				</th>
				<th class="text-center">
					{{ getLabel('name') }}
				</th>
				<th class="text-center" style="width: 15%;">
					{{ getLabel('kind') }}
				</th>
				<th class="text-center" style="width: 15%;">
					{{ getLabel('content') }}
				</th>
				<th class="text-center" style="width: 15%;">
					{{ getLabel('result') }}
				</th>
				<th class="text-center">
					{{ getLabel('person') }}
				</th>
				<th class="text-center">
					{{ getLabel('personCount') }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, index) in list" :key="index">
				<td v-text="item.date" class="text-center"></td>
				<td v-text="item.user" class="text-center"></td>
				<td v-text="item.name" class="text-center"></td>
				<td v-text="item.kind" class="text-center"></td>
				<td v-text="item.content" class="text-center"></td>
				<td v-text="item.result" class="text-center"></td>
				<td v-text="item.person" class="text-center"></td>
				<td v-text="item.personCount" class="text-center"></td>
			</tr>
		</tbody>
	</v-table>
</template>