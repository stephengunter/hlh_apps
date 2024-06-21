<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, mergeProps } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { helpers } from '@vuelidate/validators'
import date from '@/plugins/date'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual, dateToRocFormat,
	setValues, badRequest, toYearTW, dateToText, textToDate, isValidDate, tryParseInt
} from '@/utils'
import { ROUTE_NAMES, ENTITY_TYPES } from '@/consts'

const name = 'TaskHead'
const store = useStore()
const route = useRoute()
const router = useRouter()
const dateAdapter = new date.adapter({ locale: date.locale.zhTW })

const emit = defineEmits(['submit', 'add'])
defineExpose({
   init, setParams, getParams
})

const props = defineProps({
   
})

const initialState = {
	params: {
		
	}
}

const state = reactive(deepClone(initialState))

const params = computed(() => store.state.tasks.params)

const rules = computed(() => {
	return {
		
	}
})

const params_are_match = computed(() => {
	if(route.params) {
		return areObjectsEqual(state.params, route.params, true)
	} return false
})

const v$ = useVuelidate(rules, state.params)


function init() {
	if(route.params) copyFromQuery(state.params, route.params)
	if(!checkParams()) {
	}

	onParamsChanged()
}
function checkParams() {
	
	return true
}
function setParams(model) {
   setValues(model, state.params)
	onParamsChanged()
}
function getParams() {
   return state.params
}
function onParamsChanged() {
	onSubmit()
}
function onSubmit() {
	if(params_are_match.value) emit('submit', { ...state.params })
	else router.push({ name: ROUTE_NAMES.TASKS_INDEX, params: state.params })
}
function create() {
	emit('add')
}


</script>

<template>
	<div>
		<form @submit.prevent="onSubmit">
			<v-row dense>
				<v-col cols="10">

				</v-col>
				<v-col cols="2">
					<CommonButtonCreate class_name="float-right" 
					@create="create"
					/>
				</v-col>
			</v-row>	
		</form>
	</div>
</template>