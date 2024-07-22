<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
import Errors from '@/common/errors'
import { useVuelidate } from '@vuelidate/core'
import { url, required, helpers } from '@vuelidate/validators'
import { DIALOG_MAX_WIDTH } from '@/config'
import { WIDTH, VALIDATE_MESSAGES, ACTION_TYPES } from '@/consts'
import { deepClone, setValues, isValidURL, getFilenameWithoutExtension, previewAttachment } from '@/utils'

const name = 'ItemForm'
const props = defineProps({
   model: {
      type: Object,
      default: null
   }
})
const emit = defineEmits(['submit'])

const labels = {
   'title': '標題',
   'file': '檔案'
}

const initialState = {
	form: {
      title: '',
      file: null,
      fileName: '',
      files: [],
   },
   
   attachments: [],
   
   errors: new Errors()
}
const state = reactive(deepClone(initialState))
const file_upload = ref(null)

const rules = {
	title: { 
      required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['title']), required)
   }
}

const v$ = useVuelidate(rules, state.form)

onBeforeMount(() => {
   setValues(props.model, state.form)
   if(props.model.id) {

   }else {

   }
})

onMounted(() => {
   if(state.form.files && state.form.files.length) file_upload.value.setFiles(state.form.files)
})

function onFileAdded(files) {
   state.files = files
}

function onSubmit() {
   v$.value.$validate().then(valid => {
		if(!valid) return
      if(state.errors.any()) return

      emit('submit', { model: state.form, files: state.files } )
	})
}


</script>
<template>
   <form @submit.prevent="onSubmit">
      <v-row dense>
         <v-col cols="10">
				<v-text-field :label="labels['title']"           
				v-model="state.form.title"
				:error-messages="v$.title.$errors.map(e => e.$message)"                  
				@input="v$.title.$touch" @blur="v$.title.$touch"
				/>
			</v-col>
         <v-col cols="2">
				<v-switch class="float-right" color="success" label="已完成" hide-details
            v-model="state.form.done"
            />
			</v-col>
         <v-col cols="12">
				<CommonInputUpload ref="file_upload"
            :show_button="true" :is_media="false" :multiple="true"
            @file-added="onFileAdded" @file-removed="onFileAdded"
            />
			</v-col>
         <v-col cols="12">
            <v-btn :disabled="state.errors.any()" class="float-right" type="submit" color="success">確定</v-btn>
         </v-col>
      </v-row>
   </form>
</template>