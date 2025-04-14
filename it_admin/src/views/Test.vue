<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ENTITY_TYPES, WIDTH, ACTION_TYPES, WARNING, ERRORS } from '@/consts'
import { INIT_DEVICES, FETCH_DEVICES, CREATE_DEVICE, STORE_DEVICE, EDIT_DEVICE, UPDATE_DEVICE, 
	REMOVE_DEVICE
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, now,
	resolveErrorData
} from '@/utils'

const initialState = {
	categories: [
    "不斷電裝置",
    "火災警報器",
    "主記憶體",
    "伺服器",
    "冷（暖）氣機",
    "防火牆",
    "恆溫防潮櫃",
    "個人電腦",
    "個人電腦用硬碟機",
    "通道",
    "資料儲存收集器",
    "路由器",
    "網路介面",
    "網路交換器",
    "網路伺服器",
    "網路系統",
    "櫥櫃"
 ]
}
const state = reactive(deepClone(initialState))

onBeforeMount(() => {
	const categories = [
		"不斷電裝置",
		"火災警報器",
		"主記憶體",
		"伺服器",
		"冷（暖）氣機",
		"防火牆",
		"恆溫防潮櫃",
		"個人電腦",
		"個人電腦用硬碟機",
		"通道",
		"資料儲存收集器",
		"路由器",
		"網路介面",
		"網路交換器",
		"網路伺服器",
		"網路系統",
		"櫥櫃"
	]
	state.categories = categories.map(name => {
		return {
			selected: false, name
		}
	})
})

function selectCategory(index) {
	let category = state.categories[index]
	category.selected = !category.selected
}
</script>

<template>
	<div>
      <v-row dense>
			<v-col cols="12">
				<v-chip v-for="(category, index) in state.categories"  class="ml-1 mb-1" 
				:variant="category.selected ? 'tonal' : 'outlined'"
				:key="index" :color="category.selected ? 'info' : ''"
				@click="selectCategory(index)"
				>
					{{ category.name }}
				</v-chip>
			</v-col>
		</v-row>
		
	</div>
</template>