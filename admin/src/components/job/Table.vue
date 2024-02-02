<script setup>
import { reactive } from 'vue'
import { WIDTH, ACTION_TITLES } from '@/consts'
import { deepClone } from '@/utils'

const name = 'JobTable'
const props = defineProps({
	list: {
		type: Array,
		default: () => []
	},
	on_edit: {
		type: Function,
		default: null
	}
})

const initialState = {
	
}
const state = reactive(deepClone(initialState))
const emit = defineEmits(['create', 'edit', 'remove'])

function create() {
	emit('create')
}

function remove(item) {
	emit('remove', item)
}
function getTels(job) {
	let tels = []
	if(job.tel) tels.push(job.tel)
	if(job.subTel) tels.push(job.subTel)
	if(tels.length) return tels.join()
	else return ''
}
</script>

<template>
	<v-table density="compact">
		<tbody>
			<tr v-for="job in list" :key="job.id">
				<td>
					{{ job.title }}
					<v-icon v-if="!job.active" class="mb-1 ml-1" icon="mdi-close-circle" size="x-small" />
				</td>
				<td>
					{{ getTels(job) }}
				</td>
				<td>
					<v-icon class="mb-1 ml-1" icon="mdi-pencil" size="x-small" color="info" 
					@click="on_edit(job)"
					/>
				</td>
			</tr>
		</tbody>
	</v-table>
</template>