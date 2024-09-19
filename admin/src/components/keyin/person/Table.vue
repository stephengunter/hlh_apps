<script setup>
import { reactive } from 'vue'
import { WIDTH, ACTION_TITLES } from '@/consts'
import { deepClone, tryParseInt } from '@/utils'

const name = 'KeyinPersonTable'
const props = defineProps({
	list: {
		type: Array,
		default: () => []
	},
	preview: {
		type: Boolean,
		default: false
	}
})

const initialState = {
	
}
const state = reactive(deepClone(initialState))

function score(item) {
	if(item.score) return item.score
	return '缺考'
}
function correctRate(item) {
	if(tryParseInt(item.correctRate)) return item.correctRate
	return ''
}
</script>

<template>
	<v-table density="compact" style="max-width: 600px;">
		<thead>
			<tr>
				<th class="text-center" style="width: 100px;">
					股別
				</th>
				<th>
					姓名
				</th>
				<th class="text-center" style="width: 120px;">
					成績(字/分)
				</th>
				<th class="text-center" style="width: 100px;">
					正確率(%)
				</th>
				<th v-if="!props.preview" class="text-center" style="width: 120px;">
					進步率(%)
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, index) in list" :key="index">
				<td v-text="item.unit" class="text-center"></td>
				<td v-text="item.person.name"></td>
				<td v-text="score(item)" :class="{'text-center' : true, 'text-red' : !item.score}"></td>
				<td v-text="correctRate(item)" class="text-center"></td>
				<td v-if="!props.preview" v-text="item.diff === '0' ? '' : item.diff" class="text-center"></td>
			</tr>
		</tbody>
	</v-table>
</template>