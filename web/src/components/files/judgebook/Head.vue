<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import Errors from '@/common/errors'
import { FETCH_JUDGEBOOKFILES, UPLOAD_JUDGEBOOKFILES } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , activeOptions, copyFromQuery, 
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, is400, isNumeric,
	formatNumberWithLeadingZeros, tryParseInt
} from '@/utils'
import { WIDTH, ROUTE_NAMES, VALIDATE_MESSAGES } from '@/consts'
import JudgebookFile from '@/models/files/judgebook'

const name = 'FilesJudgebookHead'
const store = useStore()
const route = useRoute()
const router = useRouter()

const emit = defineEmits(['submit', 'upload'])
defineExpose({
   setParams, getParams
})

const initialState = {
	params: {
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
const v$ = useVuelidate(rules, state.params)

onBeforeMount(init)

watch(route, init)

function init() {
	if(isEmptyObject(route.query)) {
		router.push({ path: route.path, query: { ...state.params } })
		return
	} 
	copyFromQuery(state.params, route.query)
	const errors = checkParams()
	
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
	return errors;
}
function setParams(model) {
   setValues(model, state.params)
}
function getParams() {
   return state.params
}

function onSubmit() {
	router.push({ path: route.path, query: { ...state.params } })
}
function onUpload() {
   emit('upload')
}

</script>

<template>
   <form @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row dense>
			<v-col cols="3">
				<v-text-field :label="labels['year']"  density="compact"
				v-model="state.params.year"
            :error-messages="v$.year.$errors.map(e => e.$message)"                     
				@input="v$.year.$touch"
				@blur="v$.year.$touch"
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field :label="labels['category']"  density="compact"        
				v-model="state.params.category"
            :error-messages="v$.category.$errors.map(e => e.$message)"                     
				@input="v$.category.$touch"
				@blur="v$.category.$touch"
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field :label="labels['num']"  density="compact" :clearable="true"       
				v-model="state.params.num"
            :error-messages="v$.num.$errors.map(e => e.$message)"                     
				@input="v$.num.$touch"
				@blur="v$.num.$touch"
				/>
			</v-col>
			<v-col cols="3">
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