<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, reviewedOptions,
	setValues, badRequest
} from '@/utils'
import { ROUTE_NAMES, ENTITY_TYPES } from '@/consts'

const name = 'EventHead'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.EVENT

const emit = defineEmits(['submit', 'add'])
defineExpose({
   init, setParams, getParams
})

const initialState = {
	key: '',
	params: {
		year: '',
		month: ''
	}
}

const event_module = store.state.events

onBeforeMount(() => {
	if(params.value) setParams(params.value)
})

const state = reactive(deepClone(initialState))
const params = computed(() => event_module.params)
const categories = computed(() => event_module.categories)
const selected_category = computed(() => {
	if(state.key && categories.value.length) {
		return categories.value.find(item => item.key.toUpperCase() === state.key.toUpperCase())
	}
	return null
})
const category_options = computed(() => {
	if(selected_category.value) {
		const key = selected_category.value.key
		return categories.value.filter(c => c.key !== key).map(item => ({ title: item.title, value: item.id, key: item.key}))
	}
	return []
})
const labels = computed(() => event_module.labels)
const title = computed(() => selected_category.value ? `${selected_category.title}` : '')


const rules = computed(() => {
	return {
		
	}
})

const query_match_params = computed(() => {
	if(route.query) {
		return areObjectsEqual(state.params, route.query, true)
	} return false
})

const v$ = useVuelidate(rules, state.params)

watch(route, init)

watch(params, (new_value) => {
	setParams(new_value)
})

function init() {

	if(!route.params.key) {
		state.key = categories.value[0].key 
		router.push({ name: ROUTE_NAMES.EVENTS, params: { key: state.key }, query: route.query })
		return
	}
	state.key = route.params.key
	
	if(isEmptyObject(route.query)) {
		router.push({ name: ROUTE_NAMES.EVENTS, params: { key: state.key },  query: { ...state.params } })
		return
	}

	copyFromQuery(state.params, route.query)

	if(!query_match_params.value) {
		router.push({ name: ROUTE_NAMES.EVENTS, params: { key: state.key }, query: { ...state.params } })
		return
	}

	const errors = checkParams()
	if(errors.any()) {
		badRequest('BAD_REQUEST ', '錯誤的查詢參數', errors.getAll())
		return 
	}
	console.log('state.params', state.params)
	emit('submit', { key: state.key, params: state.params})
	
}

function checkParams() {
	let errors = new Errors()
	// const year = state.params.year
   // if(!checkYear(year)) errors.set('year', [`錯誤的${labels['year']}`])

   // const num = state.params.num
   // if(!checkNum(num)) errors.set('num', [`錯誤的${labels['num']}`])

	return errors
}
function setParams(model) {
	console.log('setParams', model)
   setValues(model, state.params)
}
function getParams() {
   return state.params
}

function onSubmit() {
	if(query_match_params.value) emit('submit', state.params)
	else router.push({ path: route.path, query: { ...state.params } })	
}

function onParamsChanged() {
	onSubmit()
}

function selectCategory(key) {
	router.push({ name: ROUTE_NAMES.EVENTS, params: { key }, query: route.query })
}


</script>

<template>
   <form @submit.prevent="onSubmit">
		<v-row dense>
			<v-col cols="2">
				<v-menu v-if="selected_category">
					<template v-slot:activator="{ props }">
						<v-btn color="primary" v-bind="props">
							{{ selected_category.title }}
						</v-btn>
					</template>
					<v-list>
						<v-list-item
						v-for="category in category_options"
						:key="category.key"
						:value="category.key"
						@click.prevent="selectCategory(category.key)"
						>
							<v-list-item-title>{{ category.title }}</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-col>
			<v-col cols="3" class="text-right">
				<span class="text-h4" v-if="selected_category">{{ selected_category.title }}</span>
			</v-col>
			<v-col cols="3">
				<v-row dense>
					<v-col cols="3">
						<v-tooltip text="上個月">
							<template v-slot:activator="{ props }">
								<v-btn  class="float-right"
								v-bind="props" icon="mdi-chevron-left"  size="small" color="info"
								/>
							</template>
						</v-tooltip>
					</v-col>
					<v-col cols="6" class="text-center">
						<span class="text-h5">113 年 4 月</span>
					</v-col>
					<v-col cols="3">
						<v-tooltip text="上個月">
							<template v-slot:activator="{ props }">
								<v-btn class="float-left"
								v-bind="props" icon="mdi-chevron-right"  size="small" color="info"
								/>
							</template>
						</v-tooltip>
					</v-col>
				</v-row>
			</v-col>
			<v-col cols="3">

			</v-col>
		</v-row>
	</form>
</template>