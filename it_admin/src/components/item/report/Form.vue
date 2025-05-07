<script setup>
import { ref, reactive, computed, onBeforeMount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { setValues, getValue, deepClone, isEmptyObject } from '@/utils'

const name = 'ItemReportForm'
const props = defineProps({
	list: {
		type: Array,
		default: () => []
	}
})
const emit = defineEmits(['submit'])
const store = useStore()
const initialState = {
   
}
const state = reactive(deepClone(initialState))

onBeforeMount(init)

function init() {
	
}
function onSubmit(item) {
	emit('submit', item)
}
</script>

<template>
	<v-table>
		<thead>
			<tr>
				<th>
					年度
				</th>
				<th>
					月份
				</th>
				<th>
					月份
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, index) in list" :key="index">
				<td>{{ item.year }}</td>
				<td>{{ item.month }}</td>
				<td>
					<CommonButtonDefault icon="mdi-content-save" 
					tooltip="產生報表" size="x-small" color="warning"
					:disabled="index > 0"
					@click="onSubmit(item)"
					/>
				</td>
			</tr>
		</tbody>
	</v-table>
</template>