<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import {
   CREATE_ARTICLE, STORE_ARTICLE, 
   EDIT_ARTICLE, UPDATE_ARTICLE, OFF_ARTICLE, DELETE_ARTICLE
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, setValues, resolveErrorData, deepClone, onErrors, onSuccess } from '@/utils'
import { ROUTE_NAMES } from '@/consts'

const name = 'ArticlesEditView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	model: {}
	
}
const state = reactive(deepClone(initialState))
const title = computed(() => {
	if(isEmptyObject(state.model)) return '新增文章'
	return state.model.id ? '編輯文章' : '新增文章'
})

watch(route, init)

onMounted(init)

function init() {
	fetchData(route.params.id ? route.params.id : 0)
}

function fetchData(id) {
	if(id) {
		store.dispatch(EDIT_ARTICLE, id)
		.then(model => {
			state.model = { ...model }
		})
		.catch(error => onSubmitError(error))
	}else {
		store.dispatch(CREATE_ARTICLE)
		.then(model => state.model = { ...model })
		.catch(error => onSubmitError(error))
	}
}
function onSubmit(form) {
	setValues(form, state.model)
	let action = form.id > 0 ? UPDATE_ARTICLE : STORE_ARTICLE
	store.dispatch(action, state.model)
	.then(() => onSubmitSuccess())
	.catch(error => onSubmitError(error))
}
function remove() {
	store.dispatch(DELETE_ARTICLE, state.model.id)
	.then(() => back())
	.catch(error => onSubmitError(error))
}
function cancel() {
	back()
}

function back() {
	const from = store.state.app.route.from
	if(from && from.name === ROUTE_NAMES.ARTICLE_INDEX && from.query) {
		router.push({ name: ROUTE_NAMES.ARTICLE_INDEX, query: from.query })
	}
	else router.push({ name: ROUTE_NAMES.ARTICLE_INDEX })
}
function onSubmitSuccess() {	
	let msg = `${title.value}成功`
	onSuccess(msg)
	back()
}
function onSubmitError(error) {
   let errors = resolveErrorData(error)
   if(errors) store.commit(SET_ERRORS, Object.values(errors))
   else onErrors(error)
}
</script>

<template>
	<CoreContainer>
		<MqResponsive target="md+">
			<ArticleForm v-if="!isEmptyObject(state.model)"
			:model="state.model" :title="title"
			@cancel="cancel" @submit="onSubmit"
			@remove="remove"
			/>
		</MqResponsive>
		<MqResponsive target="sm-">
			edit
		</MqResponsive>
	</CoreContainer>
</template>