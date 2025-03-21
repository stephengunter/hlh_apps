<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ENTITY_TYPES, WIDTH, ACTION_TYPES, WARNING, ERRORS } from '@/consts'
import { INIT_PROPERTIES, FETCH_PROPERTIES
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, now,
	resolveErrorData
} from '@/utils'


const name = 'PropertiesIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const PROPERTY = ENTITY_TYPES.PROPERTY
const initialState = {
	active: true,
	form: {
		id: '',
		title: '',
		active: false,
		labels: null,
		item: null,
		model: {
		},
		action: '',
		width: WIDTH.L
	},
	deprecated: false,
	category: null,
	category_tree: {
		title: '',
      active: false,
		width: WIDTH.L
   },
}
const head = ref(null)
const tree = ref(null)
const state = reactive(deepClone(initialState))
const query = computed(() => store.state.properties.query)
const labels = computed(() => store.state.properties.labels)
const categories = computed(() => store.state.properties.categories)
const locations = computed(() => store.state.properties.locations)

const pagedList = computed(() => store.state.properties.pagedList)
const list = computed(() => store.state.properties.list)
const users = computed(() => store.getters.users)
const departments = computed(() => store.getters.departments)


onBeforeMount(() => {
	if(!isEmptyObject(labels.value)) {
		nextTick(init)
	}
	else {
		store.dispatch(INIT_PROPERTIES)
		.then(() => {
			nextTick(init)
		})
		.catch(error => onErrors(error))
	}
})
function init() {
	head.value.init()
	//console.log('init index', tree.value)
	//tree.value.init()
}
function fetchData(query) {
	// console.log(query)
	if(!query) query = head.value.getQuery()
	state.deprecated = query.deprecated
	// if(query.category) {
	// 	if(!state.category) {
	// 		const category = categories.value.find(x => x.id === query.category)
	// 		state.category = category
	// 	}
	// }else state.category = null
	
	// state.active = query.active
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_PROPERTIES, query)
	.catch(error => onErrors(error))
}
function selectCategory(val) {
	if(val) {
		state.category_tree.active = true
	}else {
		state.category_tree = deepClone(initialState.category_tree)
	}
	
}
function initCategoryTree() {
   tree.value.init()
}
function onCategorySelected(category) {
	if(category) {
		head.value.setCategory({ id: category.id, title: category.title })
		state.category = deepClone(category)
	}else {
		head.value.setCategory(null)
		state.category = null
	}
	selectCategory(false)
}
function onOptionChanged(option) {
	head.value.setPageOption(option)
}
</script>

<template>
	<div>
		<PropertyHead ref="head"
		:query="query" :labels="labels" 
		:categories="categories"
		@submit="fetchData" @create="onCreate"
		/>
		<v-row dense>
			<v-col cols="12">
				<PropertyTable :labels="labels" :deprecated="state.deprecated"
				:locations="locations" :users="users"
				:model="pagedList" :categories="categories"
				@options_changed="onOptionChanged"
				/>
			</v-col>
		</v-row>
	</div>
</template>
