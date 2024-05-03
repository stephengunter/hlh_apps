<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import Errors from '@/common/errors'
import { FETCH_JUDGEBOOK_TYPES } from '@/store/actions.type'
import { isEmptyObject, deepClone , copyFromQuery, areObjectsEqual,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, is400, showAlert
} from '@/utils'
import JudgebookFile from '@/models/files/judgebook'

const name = 'FilesJudgebookHead'
const store = useStore()
const route = useRoute()
const router = useRouter()

const emit = defineEmits(['submit', 'upload'])
defineExpose({
   init, setParams, getParams, setPageOption
})

const initialState = {
	params: {
		typeId: 0,
		courtType: '',
		year: '',
		category: '',
		num: '',
		page: -1,
		pageSize: 50
	}
}

function checkYear(val) {
   if(val) return  JudgebookFile.checkYear(val)
   return true
}
function checkCategory(val) {
   return true
}
function checkNum(val) {
   if(val) return JudgebookFile.isValidNum(val)
   return true
}

const state = reactive(deepClone(initialState))

const type_options = computed(() => {
	return store.state.files_judgebooks.types.map(item => ({
		value: item.id, title: item.title
	}))
})

const courtTypesOptions = computed(() => {
	let options = store.state.files_judgebooks.courtTypes.slice()
	// options.splice(0, 0, {
	// 	value: '', title: '全部'
	// })
	return options
})
const labels = computed(() => store.state.files_judgebooks.labels)
const rules = computed(() => {
	return {
		year: { 
			isValid: helpers.withMessage(`${labels.value['year']}不正確`, checkYear)
		},
      category: { 
			isValid: helpers.withMessage(`${labels.value['category']}不正確`, checkCategory)
		},
      num: { 
			isValid: helpers.withMessage(`${labels.value['num']}不正確`, checkNum)
		}
	}
})

const query_match_params = computed(() => {
	if(route.query) {
		return areObjectsEqual(state.params, route.query, true)
	} return false
})

const v$ = useVuelidate(rules, state.params)

watch(route, init)

function init() {
   if(!state.params.typeId) state.params.typeId = type_options.value[0].value
	if(!state.params.courtType) state.params.courtType = courtTypesOptions.value[0].value

	if(isEmptyObject(route.query)) {
		router.push({ path: route.path, query: { ...state.params } })
		return
	}

	copyFromQuery(state.params, route.query)
	if(!state.params.typeId) state.params.typeId = type_options.value[0].value
	if(!state.params.courtType) state.params.courtType = courtTypesOptions.value[0].value

	if(!query_match_params.value) {
		router.push({ path: route.path, query: { ...state.params } })
		return
	}

	const errors = checkParams()
	if(errors.any()) {
		badRequest('BAD_REQUEST ', '錯誤的查詢參數', errors.getAll())
		return 
	}
	
	if(errors.any()) {
		badRequest('BAD_REQUEST ', '錯誤的查詢參數', errors.getAll())
		return 
	}
	
	emit('submit', state.params)
	
}

function checkParams() {
	let errors = new Errors()
	const year = state.params.year
   if(!checkYear(year)) errors.set('year', [`錯誤的${labels['year']}`])

   const num = state.params.num
   if(!checkNum(num)) errors.set('num', [`錯誤的${labels['num']}`])

	return errors
}
function setPageOption(option) {
	if(option.hasOwnProperty('page')) state.params.page = option.page
	if(option.hasOwnProperty('size')) state.params.pageSize = option.size
	onSubmit()
}
function setParams(model) {
   setValues(model, state.params)
}
function getParams() {
   return state.params
}

function onSubmit() {
	if(query_match_params.value) emit('submit', state.params)
	else router.push({ path: route.path, query: { ...state.params } })
	
}
function onUpload() {
	if(state.params.courtType) emit('upload')
	else showAlert(`請先選擇${labels.value['courtType']}`)
   
}

function onParamsChanged() {
	onSubmit()
}

</script>

<template>
   <form @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row dense>
			<v-col cols="2">
				<v-select :label="labels['typeId']" density="compact" 
            :items="type_options" v-model="state.params.typeId"
				@update:modelValue="onParamsChanged"
            />
			</v-col>
			<v-col cols="2">
				<v-select :label="labels['courtType']" density="compact" 
            :items="courtTypesOptions" v-model="state.params.courtType"
            @update:modelValue="onParamsChanged"
				/>
			</v-col>
			<v-col cols="2">
				<v-text-field :label="labels['year']"  density="compact"
				v-model="state.params.year"
            :error-messages="v$.year.$errors.map(e => e.$message)"                     
				@input="v$.year.$touch"
				@blur="v$.year.$touch"
				/>
			</v-col>
			<v-col cols="2">
				<v-text-field :label="labels['category']"  density="compact"        
				v-model="state.params.category"
            :error-messages="v$.category.$errors.map(e => e.$message)"                     
				@input="v$.category.$touch"
				@blur="v$.category.$touch"
				/>
			</v-col>
			<v-col cols="2">
				<v-text-field :label="labels['num']"  density="compact" :clearable="true"       
				v-model="state.params.num"
            :error-messages="v$.num.$errors.map(e => e.$message)"                     
				@input="v$.num.$touch"
				@blur="v$.num.$touch"
				/>
			</v-col>
			<v-col cols="2">
				<v-tooltip text="查詢">
					<template v-slot:activator="{ props }">
						<v-btn class="float-left" v-bind="props" color="success"
						type="submit"
						>
						查詢
						</v-btn>
					</template>
				</v-tooltip>
				<v-tooltip text="上傳">
					<template v-slot:activator="{ props }">
						<v-btn class="float-right" icon="mdi-upload" v-bind="props" size="small" color="info"
						@click.prevent="onUpload"
						/>
					</template>
				</v-tooltip>
			</v-col>
		</v-row>
	</form>
</template>