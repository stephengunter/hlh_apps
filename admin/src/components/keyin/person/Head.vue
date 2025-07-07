<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , activeOptions, areObjectsEqual, reviewedOptions,
	setValues, badRequest, tryParseInt, isTrue
} from '@/utils'

const name = 'KeyinPersonHead'
const emit = defineEmits(['submit', 'download', 'upload', 'report'])
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
	can_report: {
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
	state.query.year = tryParseInt(state.query.year)
	state.query.month = tryParseInt(state.query.month)

	console.log(state.query)
	
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
function onReport() {
	emit('report', state.query)
}
function onUpload() {
	emit('upload', state.query)
}
function download() {
	emit('download', state.query)
}

</script>


<template>
   <form v-show="!isEmptyObject(state.query)" @submit.prevent="onSubmit">
		<v-row dense>
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
				
			</v-col>
			<v-col cols="3">
				<v-tooltip text="上傳">
					<template v-slot:activator="{ props }">
						<v-btn class="float-right ml-1"
						icon="mdi-upload" v-bind="props" size="small" color="success"
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
				<v-tooltip text="下載範本Excel檔">
					<template v-slot:activator="{ props }">
						<v-btn class="float-right mr-1"
						icon="mdi-download" v-bind="props" size="small" color="info"
						@click.prevent="download"
						/>
					</template>
				</v-tooltip>
			</v-col>
		</v-row>
	</form>
</template>