<script setup>
import { reactive } from 'vue'
import { WIDTH, ACTION_TITLES } from '@/consts'
import { deepClone } from '@/utils'

const name = 'KeyinBranchTable'
const props = defineProps({
	list: {
		type: Array,
		default: () => []
	}
})

const initialState = {
	
}
const state = reactive(deepClone(initialState))
const emit = defineEmits(['details', 'edit', 'remove'])

function details(id) {
	emit('details', id)
}

function remove(item) {
	emit('remove', item)
}
</script>

<template>
	<v-table density="compact" style="max-width: 600px;">
		<thead>
			<tr>
				<th class="text-center" style="width: 100px;">
					名次
				</th>
				<th>
					法院
				</th>
				<th class="text-center" style="width: 100px;">
					成績
				</th>
				<th class="text-center" style="width: 100px;">
					缺考率
				</th>
				<th class="text-center" style="width: 100px;">
					進步率(%)
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, index) in list" :key="index" :class="{'bg-highlight': item.branch.key === 'HLH'}">
				<td v-text="item.rank ? item.rank : ''" class="text-center"></td>
				<td v-text="item.branch.title"></td>
				<td v-text="item.score" class="text-center"></td>
				<td v-text="item.absentRate" class="text-center"></td>
				<td v-text="item.diff" class="text-center"></td>
			</tr>
		</tbody>
	</v-table>
</template>

<style scoped>
.bg-highlight {
    background-color: #ffeb3b; /* Highlight color for rank 1 */
}
</style>