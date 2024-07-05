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
	range: {
		roc: true,
		dates: [],
      values: [],
		models: {},
		hours_allow: [],
		minutes_allow: []
	},

	photo: {
		url: ''
	},
	
	errors: new Errors()
}
const  period_picker = ref(null)
const state = reactive(deepClone(initialState))

onBeforeMount(() => {
	
	store.dispatch(GET_ATTACHMENT, 4)
	.then(data => {
		const ext = data.ext
		const fileBytes = data.fileView.fileBytes
		const title = data.title
		previewImage({ ext, fileBytes, title })
		
	})
	.catch(error => onErrors(error))
})

function onDateSelected({ date, model }, selected = true) {	
	
}
function create() {
	console.log('create')
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
				<CommonInputUpload :show_button="true"
				@file-added="onFileAdded"
				/>
			</v-col>
			<v-col cols="12">
				<v-img v-if="state.photo.url" :src="state.photo.url" />
               
			</v-col>
		</v-row>

	</div>
</template>