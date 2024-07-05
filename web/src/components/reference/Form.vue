<script setup>
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import Errors from '@/common/errors'
import { useVuelidate } from '@vuelidate/core'
import { url, required, helpers } from '@vuelidate/validators'
import { DIALOG_MAX_WIDTH } from '@/config'
import { WIDTH, VALIDATE_MESSAGES, ACTION_TYPES } from '@/consts'
import { deepClone, setValues, isValidURL, getFilenameWithoutExtension } from '@/utils'

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

const initialState = {
   type: 'upload',
	form: {
      title: '',
      url: '',
      file: null,
      fileName: ''
   },
   
   errors: new Errors()
}
const state = reactive(deepClone(initialState))

const no_file = computed(() => {
   if(state.form.file) return false
   return true
})

onBeforeMount(() => {
   setValues(props.model, state.form)
   if(props.model.file) state.type = 'upload'
   if(props.model.url) state.type = 'link'
   

   if(state.form.file) state.form.fileName = state.form.file.name

   console.log(state.form)
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
function upload() {
   state.form.fileName = ''
   file_upload.value.launch()
}
function onFileAdded(files) {
   const file = files[0]
   state.form.file = file
   if(!state.form.title) {
      state.form.title =  getFilenameWithoutExtension(file.name)
      check('title')
   }
}
function check(key) {
   if(key === 'title') {
      if(state.form.title) state.errors.clear(key)
      else state.errors.set(key, [`${VALIDATE_MESSAGES.REQUIRED(labels['title'])}`])
   }else if(key === 'url') {
      if(state.type === 'link') {
         if(state.form.url) {
            let valid = isValidURL(state.form.url)
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
               <v-radio key="upload"
					label="上傳檔案" value="upload"
					/>
               <v-radio key="link"
					label="網址連結" value="link"
					/>
				</v-radio-group>
			</v-col>
         <v-col cols="8" v-if="state.type === 'link'">
				<v-text-field :label="labels['url']"           
				v-model="state.form.url"
				:error-messages="state.errors.get('url')"                     
				@input="check('url')" @blur="check('url')"
				/>
			</v-col>
         <v-col cols="8" v-else>
            <div class="mb-3">
               <div v-show="!state.form.fileName">
						<CommonInputUpload v-show="state.type === 'upload'" ref="file_upload"
                  :show_button="true" :is_media="false" :multiple="false"
                  @file-added="onFileAdded"
                  />
                  <CommonErrorsMessages v-show="state.errors.has('file')" :messages="[state.errors.get('file')]" />
					</div>
					<div v-show="state.form.fileName">
						<span>檔案文件：</span>
						<v-icon size="small" icon="mdi-file" /> {{ state.form.fileName }}
						<v-tooltip text="刪除重傳">
							<template v-slot:activator="{ props }">
								<v-icon size="small" v-bind="props" color="red-lighten-1" icon="mdi-close" 
								@click.prevent="upload"
								/>
							</template>
						</v-tooltip>
					</div>
						
					
					
				</div>
            
			</v-col>
         <v-col cols="12">
            <v-btn class="float-right" type="submit" color="success">確定</v-btn>
         </v-col>
      </v-row>
   </form>
</template>