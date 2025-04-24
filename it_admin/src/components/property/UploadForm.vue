<script setup>
import { ref, reactive, computed, onBeforeMount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { ACTION_TITLES, FILE_TYPES } from '@/consts'
import { UPLOAD_PROPERTIES, IMPORT_PROPERTIES } from '@/store/actions.type'
import { setValues, getValue, deepClone, isEmptyObject } from '@/utils'
import PagedList from '@/models/pagedList'

const name = 'PropertyUploadForm'
const emit = defineEmits(['submit', 'cancel'])
const store = useStore()
const props = defineProps({
	type_options: {
      type: Array,
      default: () => []
   },
	labels: {
		type: Object,
		default: null
	}
})
const file_upload = ref(null)
const initialState = {
   form: {
		propertyType: 1,
   },
	upload: {
      accept_types: ['.xls', '.xlsx', 'application/vnd.ms-excel', FILE_TYPES.EXCEL ]
   },
	action: UPLOAD_PROPERTIES,
	model: null,
	list: [],
	categories: []
}
const state = reactive(deepClone(initialState))

const typeOptions = computed(() => {
	if(props.type_options.length) {
		return props.type_options.filter(x => x.value > -1)
	}
	return []
})

function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function onFileAdded(files) {
   if(files.length) upload({ propertyType: state.form.propertyType, file: files[0] })
   file_upload.value.reset()
}
function upload(form) {
	state.model = null
	state.categories = []
	store.dispatch(UPLOAD_PROPERTIES, form)
	.then(model => {
		state.model = new PagedList(model)
		const categories = [...new Set(model.allItems.map(x => x.categoryName))]
		state.categories = categories.map(name => {
			return {
				selected: false, name
			}
		})
		state.action = IMPORT_PROPERTIES
	})
	.catch(error => onErrors(error))
}
function categoryInfo(category) {
	const items = state.model.allItems.filter(x => x.categoryName === category.name).filter(x => !x.removed)
	return `${category.name} : ${items.length}`
}
function selectCategory(index) {
	let category = state.categories[index]	
	category.selected = !category.selected

	if(category.selected) {
		for(let i = 0; i < state.categories.length; i++) {
			if(i !== index) state.categories[i].selected = false
		}
	}

	filterByCategory(1)
}
function filterByCategory(page) {
	const allItems = state.model.allItems
	const selectedCategories = state.categories.filter(x => x.selected)
	if(selectedCategories.length) {
		const category_names = selectedCategories.map(x => x.name)
		state.list = allItems.filter(x => category_names.includes(x.categoryName))
		state.model.goToPage(page, state.list)
	}else {
		state.list = allItems.slice(0)
		state.model.goToPage(page, state.list)
	}
}
function onRemove(uid) {
	let entity = state.model.allItems.find(x => x.uId === uid)
	entity.removed = !entity.removed

	filterByCategory(0)
}
function importProps() {
	const list = state.model.allItems.filter(x => !x.removed)
	console.log('list', list)
	emit('submit', list)
}
function onPageOptionChanged(option) {
	if(option.hasOwnProperty('page')) state.model.goToPage(option.page, state.list)
	if(option.hasOwnProperty('size')) {
		state.model.pageSize = option.size
		if(state.list.length) {
			state.model.goToPage(0, state.list)
		}else {
			filterByCategory(0)
		}
	}
	
}
</script>

<template>
	<form>
		<v-row dense v-if="state.action === UPLOAD_PROPERTIES">
			<v-col cols="6">
				<v-select density="compact" variant="outlined" :label="getLabel('propertyType')" 
				:items="typeOptions" v-model="state.form.propertyType"
				/>
			</v-col>
			<v-col cols="6">
				<CommonInputUpload ref="file_upload" :show_button="true" :show_files="true"
            :multiple="false" :is_media="false" :allow_types="state.upload.accept_types"
				@file-added="onFileAdded"
            />
				
			</v-col>
		</v-row>
		<v-row dense v-if="state.action === IMPORT_PROPERTIES">
			<v-col cols="12">
				<v-chip v-for="(category, index) in state.categories"  class="ml-1 mb-1" 
				:variant="category.selected ? 'tonal' : 'outlined'"
				:key="index" :color="category.selected ? 'info' : ''"
				@click="selectCategory(index)"
				>
					{{ categoryInfo(category) }}
				</v-chip>
			</v-col>
			<v-col cols="12">
				<PropertySourceTable
				:model="state.model" :labels="labels" :can_remove="true"
				@remove="onRemove" @options_changed="onPageOptionChanged"
				/>
			</v-col> 
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<CommonErrorsList />
			</v-col> 
		</v-row>
		<v-row v-if="state.action === IMPORT_PROPERTIES">
			<v-col cols="12">
				<v-btn color="success" class="float-right"
				@click.prevent="importProps"
				>
				{{ ACTION_TITLES.SAVE }}
				</v-btn>
			</v-col>
		</v-row>
	</form>
</template>