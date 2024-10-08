<script setup>
import { reactive, ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { deepClone, dateToText, textToDate, now, onErrors, bytesToBinary, downloadFile, previewImage } from '@/utils'
import { TEMP_ATTACHMENTS, STORE_ATTACHMENT, GET_ATTACHMENT } from '@/store/actions.type'  
import { VALIDATE_MESSAGES, POST_TYPES } from '@/consts'
import Errors from '@/common/errors'
import date from '@/plugins/date'
import { da } from 'date-fns/locale'
const dateAdapter = new date.adapter({ locale: date.locale.zhTW })

const name = 'TestPage'

const store = useStore()
const initialState = {
	form: {
		model: {
			postType: '',
			postId: 0,
			title: '',
			done: false,
			order: 0
		}
		
	},

	photo: {
		url: ''
	},
	
	errors: new Errors()
}
const  period_picker = ref(null)
const state = reactive(deepClone(initialState))

onBeforeMount(() => {
	
	// store.dispatch(GET_ATTACHMENT, 4)
	// .then(data => {
	// 	const ext = data.ext
	// 	const fileBytes = data.fileView.fileBytes
	// 	const title = data.title
	// 	previewImage({ ext, fileBytes, title })
		
	// })
	// .catch(error => onErrors(error))
})

function onDateSelected({ date, model }, selected = true) {	
	
}
function create() {
	
}

function onFileAdded({ files }) {
	const file = files[0]
	console.log(file)
	return
	const model = {
		postType: POST_TYPES.REFERENCE,
		postId: 0,
		title: 'plY',
		description: 'ddd',
		file: file
	}
   store.dispatch(STORE_ATTACHMENT, model)
	.then(data => {
		console.log(data)
	})
	.catch(error => onErrors(error))
}
</script>

<template>
	<div>
		<v-row>
			<v-col cols="12">
			<CommonButtonCreate  size="x-small"
			@create="create"	
			/>
			</v-col>
			<v-col cols="12">
			<ItemForm 
			:model="state.form.model"
			/>	
               
			</v-col>
		</v-row>

	</div>
</template>