<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ENTITY_TYPES, WIDTH, ACTION_TYPES, WARNING, ERRORS } from '@/consts'
import { INIT_POSTS, FETCH_POSTS
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, 
	resolveErrorData
} from '@/utils'


const name = 'PostsIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const initialState = {

}
const state = reactive(deepClone(initialState))
const query = computed(() => store.state.posts.query)
const labels = computed(() => store.state.posts.labels)
const pagedList = computed(() => store.state.posts.pagedList)

const head = ref(null)
const table = ref(null)

onBeforeMount(() => {
	if(!isEmptyObject(query.value)) init()
	else {
		store.dispatch(INIT_POSTS)
		.then(() => {
			nextTick(init)
		})
		.catch(error => onErrors(error))
	}
})
function init() {
	head.value.init()
}
function fetchData(query) {
	if(!query) query = head.value.getQuery()
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_POSTS, query)
	.catch(error => onErrors(error))
}
function onOptionChanged(option) {
	head.value.setPageOption(option)
}
function details(id) {
	router.push({ name: ROUTE_NAMES.POST_DETAILS, params: { id } })
}
</script>

<template>
	<div>
		<PostHead ref="head" :type_options="type_options"
		:query="query" :labels="labels"
		@submit="fetchData" @create="onCreate"
		/>
		<v-row dense>
			<v-col cols="12">
				<PostTable ref="table" :labels="labels" 
				:model="pagedList"
				@options_changed="onOptionChanged"
				@select="details"
				/>
			</v-col>
		</v-row>
		
	</div>
</template>
