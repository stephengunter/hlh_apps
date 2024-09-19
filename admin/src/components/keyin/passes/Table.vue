<script setup>
import { reactive } from 'vue'
import { WIDTH, ACTION_TITLES } from '@/consts'
import { deepClone, tryParseInt } from '@/utils'

const name = 'KeyinPassesTable'
const props = defineProps({
	list: {
		type: Array,
		default: () => []
	}
})

const initialState = {
	
}
const state = reactive(deepClone(initialState))
</script>

<template>
	<v-table density="compact" style="max-width: 600px;">
		<thead>
			<tr>
				<th class="text-center" style="width: 120px;">
					帳號
				</th>
				<th class="text-center">
					姓名
				</th>
				<th class="text-center" style="width: 120px;">
					最佳成績
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, index) in list" :key="index">
				<td v-text="item.account" class="text-center"></td>
				<td v-text="item.name" class="text-center"></td>
				<td v-text="item.highRun" class="text-center"></td>
			</tr>
		</tbody>
	</v-table>
</template>