<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ENTITY_TYPES, WIDTH } from '@/consts'
import { FETCH_IT_DATABASES } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile,
	onErrors, onSuccess, setValues, is400, 
	resolveErrorData
} from '@/utils'


const name = 'ITDatabasesIndexView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.DATABASE
const initialState = {
	form: {
		id: 0,
		title: '',
		active: false,
		model: {},
		action: '',
		actions: [],
		width: WIDTH.M
	},
}
const state = reactive(deepClone(initialState))
const pagedList = computed(() => store.state.it_databases.pagedList)
const head = ref(null)

onMounted(() => {
	init()
	// if(types.value.length && departments.value.length) init()
	// else {
	// 	store.dispatch(INIT_JUDGEBOOKFILES)
	// 	.then(() => {
	// 		nextTick(init)
	// 	})
	// 	.catch(error => onErrors(error))
	// }
})
function init() {
	head.value.init()
}
function fetchData(query) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_IT_DATABASES, query)
	.catch(error => onErrors(error))
}
function onOptionChanged(option) {
	head.value.setPageOption(option)
}

function edit(id) {
	state.form.id = id
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_JUDGEBOOKFILE, id)
	.then(data => {
		state.form.title = `${ACTION_TYPES.EDIT.title}${ENTITY_TYPE.title}`,
		state.form.model = deepClone(data.model)
		state.form.actions = data.actions

		state.form.action = UPDATE_JUDGEBOOKFILE
		state.form.width = WIDTH.L
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
</script>

<template>
	<div>
		<ItDatabaseHead ref="head"
		@submit="fetchData"
		/>
		<v-row dense>
			<v-col cols="12">
				<ItDatabaseTable v-if="!isEmptyObject(pagedList)" 
				:model="pagedList"
				@select="edit"
				@options_changed="onOptionChanged"
				/>
			</v-col>
		</v-row>
	</div>
</template>
