<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import Errors from '@/common/errors'
import { useVuelidate } from '@vuelidate/core'
import { url, required, helpers } from '@vuelidate/validators'
import { DIALOG_MAX_WIDTH } from '@/config'
import { WIDTH, VALIDATE_MESSAGES, ACTION_TYPES } from '@/consts'
import { deepClone, setValues, isValidURL, getFilenameWithoutExtension, previewAttachment } from '@/utils'

const name = 'DocForm'
const props = defineProps({
	list: {
		type: Array,
		default: () => []
	},
   keep_reasons: {
		type: Array,
		default: () => []
	}
})
const emit = defineEmits(['submit'])

const initialState = {
   models: []
}
const state = reactive(deepClone(initialState))

onBeforeMount(() => {
   props.list.forEach(item => {
      let model = deepClone(item)
      model.error = ''
      state.models.push(model)
   })
   
})
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
         if(state.form.file || state.attachment) {
            state.errors.clear(key)
         }else {
            state.errors.set(key, [`必須上傳檔案`])
         }
      }else state.errors.clear(key)
   }
}

function onSubmit() {
   state.models.forEach(model => {
      if(model.keep < 1) {
         model.error = '必須選擇保留原因'
      }else model.error = ''
   })

   let error_index = state.models.findIndex(x => x.error !== '')
   if(error_index < 0) {
      emit('submit', state.models)
   }
   
}


</script>
<template>
   <form @submit.prevent="onSubmit">
      <v-row dense>
         <v-col cols="12">
				<DocTable :can_check="false" :list="state.models" 
            :keep_reasons="keep_reasons" 
            />
			</v-col>
         <v-col cols="12">
            <v-btn class="float-right" type="submit" color="success">確定</v-btn>
         </v-col>
      </v-row>
   </form>
</template>