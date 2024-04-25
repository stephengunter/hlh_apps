<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import Errors from '@/common/errors'
import { FETCH_JUDGEBOOKFILES, UPLOAD_JUDGEBOOKFILES, EDIT_JUDGEBOOKFILE, UPDATE_JUDGEBOOKFILE } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , activeOptions, copyFromQuery, 
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, is400, isNumeric,
	buildQuery, tryParseInt
} from '@/utils'
import { WIDTH, ROUTE_NAMES, VALIDATE_MESSAGES } from '@/consts'
import JudgebookFile from '@/models/files/judgebook'

const name = 'FilesJudgebooksView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	upload: {
		title: '上傳文書',
		active: false
	},
	form: {
		title: '上傳文書',
		active: false,
		model: {},
		action: ''
	}
}


const state = reactive(deepClone(initialState))


const head = ref(null)
const file_upload = ref(null)
const pagedList = computed(() => store.state.files_judgebooks.pagedList)



function fetchData(params) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_JUDGEBOOKFILES, params)
	.then(model => {
		if(model.request) {
			head.value.setParams(model.request)
			//setValues(model.request, state.params)
			//checkParams() 
		}
	})
	.catch(error => onErrors(error))
}

function edit(id) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_JUDGEBOOKFILE, id)
	.then(model => {
		state.form.model = deepClone(model)
		state.form.action = UPDATE_JUDGEBOOKFILE
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function download(id) {
	console.log('download', id)
}
function onUpload(active) {
	state.upload.active = active
}
function upload(models) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(UPLOAD_JUDGEBOOKFILES, models)
	.then(results => {
		console.log(results)
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = deepClone(initialState.form)
}
function onSubmit(form) {
	setValues(form, state.form.model)
	store.dispatch(state.form.action, state.form.model)
	.then(() => {
		fetchData(head.value.getParams())
		onCancel()
		onSuccess()
	})
	.catch(error => handleSubmitError(error))
}



function handleSubmitError(error) {
	if(is400(error)) {
		let errors = resolveErrorData(error)
		if(errors) store.commit(SET_ERRORS, Object.values(errors))
		else onErrors(error)
	}else onErrors(error)
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}
function onFind(model) {
	const path = `${window.location.origin}${route.path}`
	const params = {
		year: model.year,
		category: model.category,
		num: model.num
	}
	window.open(buildQuery(path, params), '_blank')
}
</script>

<template>
	<FilesJudgebookHead ref="head"
	@submit="fetchData" @upload="onUpload(true)"
	/>
	<v-row dense>
		<v-col cols="12">
			<FilesJudgebookTable v-if="!isEmptyObject(pagedList)" 
			:model="pagedList" 
			@select="edit" @download="download"
			/>
		</v-col>
	</v-row>
	<v-dialog persistent v-model="state.form.active" :width="WIDTH.S + 50">
		<v-card v-if="state.form.active" :max-width="WIDTH.S">
			<CommonCardTitle :title="state.form.title"
			@cancel="onCancel"  
			/>
			<v-card-text>
				<FilesJudgebookForm v-if="state.form.action === UPDATE_JUDGEBOOKFILE"
				:model="state.form.model"
				@submit="onSubmit"
				/>
			</v-card-text>
		</v-card>
	</v-dialog>
	<v-dialog persistent v-model="state.upload.active" :width="WIDTH.L + 50">
		<v-card v-if="state.upload.active" :max-width="WIDTH.L">
			<CommonCardTitle :title="state.upload.title" 
			@cancel="onUpload(false)"
			/>
			<v-card-text>
				<FilesJudgebookUpload
				@submit="upload" @find="onFind"
				/>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>