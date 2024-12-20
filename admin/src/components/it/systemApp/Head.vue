<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , activeOptions, areObjectsEqual, reviewedOptions,
	setValues, badRequest, tryParseInt, isTrue
} from '@/utils'

const name = 'ITSystemAppHead'
const emit = defineEmits(['submit', 'create'])
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
	centralized_options: {
      type: Array,
      default: () => []
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
const ready = computed(() => store.state.it_systemApps.pagedList != null)

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
	state.query.active = isTrue(state.query.active)
	state.query.centralized = tryParseInt(state.query.centralized)
	state.query.page = tryParseInt(state.query.page)
	state.query.pageSize = tryParseInt(state.query.pageSize)
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
function onCreate() {
	emit('create')
}

</script>


<template>
   <form v-show="!isEmptyObject(state.query)" @submit.prevent="onSubmit">
		<v-row dense>
			<v-col cols="3">
				<v-radio-group v-model="state.query.active" inline @update:modelValue="onQueryChanged">
					<v-radio v-for="(item, index) in active_options" :key="index"
					:label="item.title" :value="item.value"
					/>
				</v-radio-group>
			</v-col>
         <v-col cols="3">
				<v-select density="compact" label="維運"
				:items="centralized_options" v-model="state.query.centralized"
				@update:modelValue="onQueryChanged"
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field label="關鍵字"  density="compact" clearable    
				v-model="state.query.keyword"
				/>
			</v-col>
			<v-col cols="2">
				
			</v-col>
			<v-col cols="1">
            <CommonButtonCreate class_name="float-right"
				@create="onCreate"
            />
			</v-col>
		</v-row>
	</form>
</template>