<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ROUTE_NAMES, ENTITY_TYPES, WIDTH, ACTION_TYPES, ACTION_TITLES, ERRORS } from '@/consts'
import { INIT_PROPERTIES, FETCH_PROPERTIES, UPLOAD_PROPERTIES, IMPORT_PROPERTIES, REPORT_PROPERTIES
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, now,
	resolveErrorData
} from '@/utils'
import PagedList from '@/models/pagedList'


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
const state = reactive(deepClone(initialState))
const query = computed(() => store.state.properties.query)
const labels = computed(() => store.state.properties.labels)
const type_options = computed(() => store.state.properties.type_options)
const groupViews = computed(() => store.state.properties.groupViews)
const categories = computed(() => store.state.properties.categories)
const locations = computed(() => store.state.properties.locations)

const pagedList = computed(() => store.state.properties.pagedList)
const users = computed(() => store.getters.users)


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
}
function fetchData(query) {
	console.log('query', query)
	if(!query) query = head.value.getQuery()
	state.deprecated = query.deprecated
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_PROPERTIES, query)
	.catch(error => onErrors(error))
}
function cancelForm() {
	state.form = deepClone(initialState.form)
}
function report(query) {
	const location = locations.value.find(x => x.id == query.location)
	store.dispatch(REPORT_PROPERTIES, query)
	.then(data => {
		
		const blob = new Blob([data])
		downloadFile(blob, `${location.title}資訊財產清單.xlsx`)
	})
	.catch(error => onErrors(error))
}
function onUpload() {
	state.form.title = `匯入資訊財產`
	state.form.width = WIDTH.L
	state.form.action = UPLOAD_PROPERTIES
	state.form.active = true
}
function onRemove(item) {
	// if(state.form.action === IMPORT_PROPERTIES) {
	// 	const index = state.form.model.allItems.findIndex(x => x.uid === item.uid)
	// 	state.form.model.allItems.splice(index, 1)
	// }
	
}
function importProps(list) {
	store.dispatch(IMPORT_PROPERTIES, { list })
	.then(() => {
		cancelForm()
		onSuccess()
		fetchData()
	})
	.catch(error => onSubmitError(error))
}
function onSubmitError(error) {
	let data = resolveErrorData(error)
	if(data && data.errors) store.commit(SET_ERRORS, data.errors)
	else onErrors(error)
}
function onOptionChanged(option) {
	head.value.setPageOption(option)
}
</script>

<template>
	<div>
		<PropertyHead ref="head" :type_options="type_options"
		:query="query" :labels="labels" :groupViews="groupViews"
		:categories="categories" :locations="locations" 
		@submit="fetchData" @report="report" @upload="onUpload"
		/>
		<v-row dense>
			<v-col cols="12">
				<PropertyTable :labels="labels" :deprecated="state.deprecated"
				:locations="locations" :users="users" :can_remove="true"
				:model="pagedList" :categories="categories"
				@remove="onRemove"
				@options_changed="onOptionChanged"
				/>
			</v-col>
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="state.form.width + 50">
			<v-card v-if="state.form.active" :max-width="state.form.width">
				<CommonCardTitle :title="state.form.title"
				@cancel="cancelForm"  
				/>
				<v-card-text>
					<PropertyUploadForm 
					:labels="labels" :type_options="type_options"
					@submit="importProps"
					/>
					<!-- <v-row dense v-if="state.form.action === UPLOAD_PROPERTIES">
						<v-col cols="12">
							<PropertyUploadForm
							:labels="labels" :type_options="type_options"
							@submit="upload"
							/>
						</v-col>
					</v-row>
					<v-row dense v-if="state.form.action === IMPORT_PROPERTIES">
						<v-col cols="12">
							<v-chip v-for="(category, index) in state.form.categories"  class="ml-1 mb-1" 
							:variant="category.selected ? 'tonal' : 'outlined'"
							:key="index" :color="category.selected ? 'info' : ''"
							@click="selectCategory(index)"
							>
								{{ category.name }}
							</v-chip>
						</v-col>
						<v-col cols="12">
							<PropertySourceTable
							:model="state.form.model" :labels="labels" :can_remove="true"
							@remove="onRemove"
							/>
						</v-col>
					</v-row>
					<v-row v-if="state.form.action === IMPORT_PROPERTIES">
						<v-col cols="12">
							<v-btn color="success" class="float-right"
							@click.prevent="importProps"
							>
							{{ ACTION_TITLES.SAVE }}
							</v-btn>
						</v-col>
					</v-row> -->
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>
