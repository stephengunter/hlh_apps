<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FETCH_DEPARTMENTS } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, copyFromQuery , activeOptions, resolveErrorData, onErrors } from '@/utils'
import { ROUTE_NAMES, ACTION_TITLES } from '@/consts'
import { nextTick } from 'vue'

const name = 'DepartmentsIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	params: {
		active: true
	}
}
const state = reactive({
   ...initialState,
})

const active_options = activeOptions

const departments  = computed(() => store.state.departments.list)

onBeforeMount(() => {
	loadParams()
	fetchData(state.params)
})
watch(route, () => {
	loadParams()
	fetchData(state.params)
})

function loadParams() {
	if(isEmptyObject(route.query)) state.params = { ...initialState.params }
	else copyFromQuery(state.params, route.query)
}
function fetchData(params) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_DEPARTMENTS, params)
	.then(() => {
		nextTick(() => {
			//console.log('damn', pagedList.value)
		})
	})
	.catch(error => {
		let errors = resolveErrorData(error)
		if(errors) store.commit(SET_ERRORS, Object.values(errors))
		else onErrors(error)
	})
}
function save() {
	onSuccess('登入成功')
   // const content = tiptap.value.getContent()
	// console.log(content)
}
</script>

<template>
	<div>
	<v-row>
		<v-col cols="12">
			<TreeItem v-for="(item, index) in departments" :model="item" />
			<!-- <div>
				<v-btn density="compact" class="mb-1" flat icon="mdi-menu-right"></v-btn>
				<a href="#" class="text-decoration-none">司法院</a>
			</div>
			<div class="ml-5">
				<v-btn density="compact" class="mb-1" flat icon="mdi-plus"></v-btn>
				<span class="primary--text">花蓮高分院</span>
			</div> -->
			
		</v-col>
	</v-row>
</div>
</template>