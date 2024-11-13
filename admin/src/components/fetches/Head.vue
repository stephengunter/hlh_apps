<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , activeOptions, areObjectsEqual, reviewedOptions,
	setValues, badRequest, tryParseInt, isTrue
} from '@/utils'

const name = 'FetchesHead'
const emit = defineEmits(['submit', 'create-system', 'edit-system', 'upload', 'report', 'template'])
defineExpose({
   init, setQuery, getQuery, setPageOption
})

const store = useStore()
const route = useRoute()
const router = useRouter()

const props = defineProps({
	query: {
      type: Object,
      default: null
   },
	labels: {
      type: Object,
      default: null
   },
	year_options: {
      type: Array,
      default: () => []
   },
	month_options: {
      type: Array,
      default: () => []
   },
	system_options: {
      type: Array,
      default: () => []
   },
	can_report: {
      type: Boolean,
      default: false
   },
	has_template: {
      type: Boolean,
      default: false
   }
})
const initialState = {
	query: {
	},
}
const state = reactive(deepClone(initialState))
const active_options = activeOptions
const query_match_route = computed(() => {
	if(route.query) {
		return areObjectsEqual(state.query, route.query, true)
	} return false
})
const ready = computed(() => store.state.fetches_records.pagedList != null)

watch(route, init)

function init() {
   initQuery()
   emit('submit', state.query)
}
function initQuery() {
	if(isEmptyObject(route.query)) {
		router.push({ path: route.path, query: { ...props.query } })
      return
	}
	
	state.query = { ...route.query }
	state.query.system = tryParseInt(state.query.system)
	state.query.year = tryParseInt(state.query.year)
	state.query.month = tryParseInt(state.query.month)
}
function setQuery(model) {
   setValues(model, state.query)
}
function getQuery() {
   return state.query
}
function setPageOption(option) {
	if(option.hasOwnProperty('page')) state.query.page = option.page
	if(option.hasOwnProperty('size')) state.query.pageSize = option.size
	onSubmit()
}
function onQueryChanged() {
	onSubmit()
}
function onSubmit() {
	if(query_match_route.value) emit('submit', state.query)
	else router.push({ path: route.path, query: { ...state.query } })	
}
function createSystem() {
	emit('create-system')
}
function editSystem() {
	console.log('editSystem')
	emit('edit-system', state.query.system)
}
function onReport() {
	emit('report', state.query)
}
function onUpload() {
	emit('upload', state.query)
}
function onTemplate() {
	emit('template', state.query)
}


</script>


<template>
   <form v-show="!isEmptyObject(state.query)" @submit.prevent="onSubmit">
		<v-row dense>
			<v-col cols="3">
				<v-select density="compact" label="系統"
				:items="system_options" v-model="state.query.system"
				@update:modelValue="onQueryChanged"
				/>
			</v-col>
			<v-col cols="3">
				<v-select density="compact" 
				:items="year_options" v-model="state.query.year"
				@update:modelValue="onQueryChanged"
				/>
			</v-col>
         <v-col cols="3">
				<v-select density="compact"
				:items="month_options" v-model="state.query.month"
				@update:modelValue="onQueryChanged"
				/>
			</v-col>
			
			<v-col cols="3">
				<CommonButtonCreate class_name="float-right ml-1" 
				tooltip="新增系統"
				@create="createSystem"
				/>
				<CommonButtonEdit :disabled="state.query.system < 1" class_name="float-right ml-1" 
				tooltip="編輯系統" color="default"
				@edit="editSystem"
				/>
				<v-tooltip text="下載範本" v-if="has_template">
					<template v-slot:activator="{ props }">
						<v-btn class="float-right ml-1"
						icon="mdi-download" v-bind="props" size="small" color="warning"
						@click.prevent="onTemplate"
						/>
					</template>
				</v-tooltip>
				<v-tooltip text="上傳">
					<template v-slot:activator="{ props }">
						<v-btn class="float-right ml-1"
						icon="mdi-upload" v-bind="props" size="small" color="purple"
						@click.prevent="onUpload"
						/>
					</template>
				</v-tooltip>
				<v-tooltip text="報表" v-if="can_report">
					<template v-slot:activator="{ props }">
						<v-btn class="float-right" 
						icon="mdi-file-document" v-bind="props" size="small" color="warning"
						@click.prevent="onReport"
						/>
					</template>
				</v-tooltip>
			</v-col>
		</v-row>
	</form>
</template>