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
	allow_select: {
		type: Boolean,
		default: false
	},
	selected_ids: {
		type: Array,
		default: () => []
	},
	allow_edit: {
		type: Boolean,
		default: false
	},
	on_edit: {
		type: Function,
		default: null
	},
})

const initialState = {
	selectedIds: []
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
	<v-table density="compact">
		<tbody>
			<tr v-for="job in list" :key="job.id">
				<td v-if="props.allow_select" style="width: 30px;">
					<v-checkbox hide-details density="compact"
					:value="job.id" v-model="state.selectedIds"
					/>
				</td>
				<td>
					<a href="#" @click.prevent="details(job.id)">{{ job.title }}</a>
					
					<span v-if="job.role" v-text="`(${job.roleText})`" class="ml-1"></span>
					<v-tooltip v-if="!job.active" text="已下架">
						<template v-slot:activator="{ props }">
							<v-icon class="mb-1 ml-1" v-bind="props" icon="mdi-close-circle" size="x-small" />
						</template>
					</v-tooltip>
				</td>
				<td>
					{{ job.subTel }}
					<span v-if="job.tel" v-text="`(${job.tel})`" class="ml-1"></span>
				</td>
				<!-- <td v-if="props.allow_edit" style="width: 30px;">
					<v-tooltip text="編輯">
						<template v-slot:activator="{ props }">
							<v-icon class="mb-1 ml-1" v-bind="props" icon="mdi-pencil" size="x-small" color="info" 
							@click="on_edit(job)"
							/>
						</template>
					</v-tooltip>
				</td> -->
			</tr>
		</tbody>
	</v-table>
</template>