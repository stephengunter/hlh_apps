<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import Errors from '@/common/errors'
import { FETCH_JUDGEBOOKFILES, UPLOAD_JUDGEBOOKFILES, DOWNLOAD_JUDGEBOOKFILE,
	EDIT_JUDGEBOOKFILE, UPDATE_JUDGEBOOKFILE, REMOVE_JUDGEBOOKFILE, FETCH_JUDGEBOOK_TYPES 
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, is400, isNumeric,
	buildQuery, bytesToBinary, getMimeType, showModifyRecords
} from '@/utils'
import { WIDTH, ROUTE_NAMES, VALIDATE_MESSAGES, ACTION_TITLES, ENTITY_TYPES } from '@/consts'

const name = 'FilesJudgebooksView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const ENTITY_TYPE = ENTITY_TYPES.JUDGEBOOKFILE

const initialState = {
	upload: {
		title: `${ACTION_TITLES.UPLOAD}${ENTITY_TYPE.title}`,
		type: null,
		courtType: null,
		active: false
	},
	form: {
		title: '',
		active: false,
		model: {},
		action: ''
	}
}


const state = reactive(deepClone(initialState))

const types = computed(() => store.state.files_judgebooks.types)
const courtTypes = computed(() => store.state.files_judgebooks.courtTypes)

const head = ref(null)
const pagedList = computed(() => store.state.files_judgebooks.pagedList)


onMounted(() => {
	if(types.value.length) init()
	else {
		store.dispatch(FETCH_JUDGEBOOK_TYPES)
		.then(() => {
			nextTick(init)
		})
		.catch(error => onErrors(error))
	}
})

function init() {
	head.value.init()
}
function fetchData(params) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_JUDGEBOOKFILES, params)
	.then(model => {
		if(model.request) {
			head.value.setParams(model.request)
		}
	})
	.catch(error => onErrors(error))
}
function onOptionChanged(option) {
	head.value.setPageOption(option)
}

function edit(id) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(EDIT_JUDGEBOOKFILE, id)
	.then(model => {
		state.form.title = `${ACTION_TITLES.EDIT}${ENTITY_TYPE.title}`,
		state.form.model = deepClone(model)
		state.form.action = UPDATE_JUDGEBOOKFILE
		state.form.active = true
	})
	.catch(error => onErrors(error))
}
function download(id) {
	store.dispatch(DOWNLOAD_JUDGEBOOKFILE, id)
	.then(data => {
		const file = data.fileView
		const ext = data.ext
		const fileBytes = bytesToBinary(file.fileBytes)
		const blob = new Blob([fileBytes], { type: getMimeType(ext) })
		downloadFile(blob, data.fileView.fileName)
	})
	.catch(error => onErrors(error))
}
function onUpload(active) {
	if(active) {
		const params = head.value.getParams()
		const type = types.value.find(item => item.id === params.typeId)
		const courtType = courtTypes.value.find(item => item.value === params.courtType) 
		state.upload.title = `${ACTION_TITLES.UPLOAD}${type.title} (${courtType.title})`
		state.upload.type = type
		state.upload.courtType = courtType
	} 
	else {
		state.upload.type = null
		state.upload.courtType = null
		state.upload.title = ''
	} 
	
	state.upload.active = active
}
function upload(models) {
	store.commit(CLEAR_ERRORS)
	store.dispatch(UPLOAD_JUDGEBOOKFILES, models)
	.then(results => {
		nextTick(() => {
			if(!store.state.files_judgebooks.upload.has_error) {
				fetchData(head.value.getParams())
				onUpload(false)
				onSuccess()
			}	
		})
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
function onFind(model) {
	const path = `${window.location.origin}${route.path}`
	const params = {
		year: model.year,
		category: model.category,
		num: model.num
	}
	window.open(buildQuery(path, params), '_blank')
}
function remove() {
	const id = state.form.model.id
	store.dispatch(REMOVE_JUDGEBOOKFILE, id)
	.then(() => {
		fetchData(head.value.getParams())
		onCancel()
		onSuccess('刪除成功')
	})
	.catch(error => {
		let errors = resolveErrorData(error)
		if(errors) store.commit(SET_ERRORS, Object.values(errors))
		else onErrors(error)
	})
}
</script>

<template>
	<FilesJudgebookHead ref="head"
	@submit="fetchData" @upload="onUpload(true)"
	/>
	<v-row dense>
		<v-col cols="12">
			<FilesJudgebookTable v-if="!isEmptyObject(pagedList)" 
			:model="pagedList" :court_types="courtTypes"
			@select="edit" @download="download"
			@options_changed="onOptionChanged"
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
				:model="state.form.model" :court_types="courtTypes"
				@submit="onSubmit" @remove="remove"
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
				<FilesJudgebookUpload :type="state.upload.type" :courtType="state.upload.courtType"
				@submit="upload" @find="onFind"
				/>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>