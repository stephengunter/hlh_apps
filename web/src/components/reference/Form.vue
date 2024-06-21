<script setup>
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import Errors from '@/common/errors'
import { useVuelidate } from '@vuelidate/core'
import { url, required, helpers } from '@vuelidate/validators'
import { DIALOG_MAX_WIDTH } from '@/config'
import { WIDTH, VALIDATE_MESSAGES, ACTION_TYPES } from '@/consts'
import { deepClone, setValues } from '@/utils'

const name = 'ReferenceForm'
const props = defineProps({
   model: {
      type: Object,
      default: null
   }
})
const emit = defineEmits(['submit'])

const labels = {
   'title': '名稱',
   'url': '網址',
   'file': '網址'
}
const type_options = [{
   value: 'exist', title: '現有'
}, {
   value: 'upload', title: '上傳'
}]

const initialState = {
   type: 'link',
	form: {
      title: '',
      url: '',
      file: null
   },
   
   errors: new Errors()
}
const state = reactive(deepClone(initialState))

onBeforeMount(() => {
   setValues(props.model, state.form)
   if(props.model.file) state.type = 'upload'
   else state.type = 'link'
})

function onTypeChanged(val) {
   if(val === 'link') {
      state.form.file = null
      state.errors.clear('file')
   }else {
      state.form.url = ''
      state.errors.clear('url')
   }
   
}
function onFileAdded(files) {
   
   state.form.file = files[0]
}
function check(key) {
   if(key === 'title') {
      if(state.form.title) state.errors.clear(key)
      else state.errors.set(key, [`${VALIDATE_MESSAGES.REQUIRED(labels['title'])}`])
   }else if(key === 'url') {
      if(state.type === 'link') {
         if(state.form.url) {
            let valid = url.$validator(state.form.url)
            if(valid) state.errors.clear(key)
            else state.errors.set(key, [`${VALIDATE_MESSAGES.WRONG_FORMAT_OF(labels['url'])}`])
         }else {
            state.errors.set(key, [`${VALIDATE_MESSAGES.REQUIRED(labels['url'])}`])
         }
      }else state.errors.clear(key)
   }else if(key === 'file') {
      if(state.type === 'upload') {
         if(state.form.file) {
            state.errors.clear(key)
         }else {
            state.errors.set(key, [`必須上傳檔案`])
         }
      }else state.errors.clear(key)
   }
}
function onSubmit() {
   check('title')
	if(state.type === 'link') {
      check('url')
   }else {
      check('file')
   }
   if(state.errors.any()) return
   emit('submit', state.form)
}


</script>
<template>
   <form @submit.prevent="onSubmit">
      <v-row dense>
         <v-col cols="12">
				<v-text-field :label="labels['title']"           
				v-model="state.form.title"
				:error-messages="state.errors.get('title')"                     
				@input="check('title')" @blur="check('title')"
				/>
			</v-col>
         <v-col cols="4">
				<v-radio-group v-model="state.type" inline @update:modelValue="onTypeChanged">
					<v-radio key="link"
					label="網址連結" value="link"
					/>
               <v-radio key="upload"
					label="上傳檔案" value="upload"
					/>
				</v-radio-group>
			</v-col>
         <v-col cols="8">
				<v-text-field v-if="state.type === 'link'" :label="labels['url']"           
				v-model="state.form.url"
				:error-messages="state.errors.get('url')"                     
				@input="check('url')" @blur="check('url')"
				/>
            <CommonInputUpload v-show="state.type === 'upload'" ref="file_upload"
            :show_button="true" :is_media="false" :multiple="false"
				@file-added="onFileAdded"
				/>
            <CommonErrorsMessages v-show="state.errors.has('file')" :messages="[state.errors.get('file')]" />
			</v-col>
         <v-col cols="12">
            <v-btn class="float-right" type="submit" color="success">確定</v-btn>
         </v-col>
      </v-row>
   </form>
</template>