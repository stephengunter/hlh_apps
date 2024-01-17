<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FETCH_ARTICLES } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, copyFromQuery , activeOptions, resolveErrorData, onErrors } from '@/utils'
import { ROUTE_NAMES, ACTION_TITLES } from '@/consts'
import { nextTick } from 'vue'

const name = 'ArticlesIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	params: {
		category: 0,
		active: true,
		page: 1,
		pageSize: 10
	}
}
const state = reactive({
   ...initialState,
})
const active_options = activeOptions

const pagedList = computed(() => store.state.articles.pagedList)

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
	store.dispatch(FETCH_ARTICLES, params)
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
function onParamsChanged() {
	router.push({ path: route.path, query: { ...state.params } })
}
function create() {
	router.push({ name: ROUTE_NAMES.ARTICLE_EDIT })
}
function onSelect(id) {
	router.push({ name: ROUTE_NAMES.ARTICLE_EDIT, params: { id } })
}
</script>

<template>
	<MqResponsive target="md+">
		<v-row dense>
			<v-col cols="8">
				<v-radio-group v-model="state.params.active" inline @update:modelValue="onParamsChanged">
					<v-radio v-for="(item, index) in active_options" :key="index"
					:label="item.text" :value="item.value"
					/>
				</v-radio-group>
			</v-col>
			<v-col cols="4" class="text-right">
				<v-tooltip :text="ACTION_TITLES.CREATE">
					<template v-slot:activator="{ props }">
						<v-btn icon="mdi-plus" v-bind="props" color="info"
						@click="create"
						/>
					</template>
				</v-tooltip>
			</v-col>
			<v-col cols="12">
				<CoreErrorList />
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				tags
			</v-col>
		</v-row>
	</MqResponsive>
	<MqResponsive target="sm-">
		<v-fade-transition mode="out-in">
			<v-row>
				<v-col cols="12">
					
					small
				</v-col>
			</v-row>
		</v-fade-transition>
	</MqResponsive>
	
   
</template>