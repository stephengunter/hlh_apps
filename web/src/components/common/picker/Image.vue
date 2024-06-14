<script setup>
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { url, required, helpers } from '@vuelidate/validators'
import { DIALOG_MAX_WIDTH } from '@/config'
import { WIDTH, VALIDATE_MESSAGES, ACTION_TYPES } from '@/consts'
import { deepClone } from '@/utils'
import Upload from '../input/Upload.vue'

const name = 'CommonPickerImage'
const props = defineProps({
   sources: {
      type: Array,
      default: () => ['upload', 'link']
   },
   auto_submit: {
      type: Boolean,
      default: false
   }
})
const emit = defineEmits(['selected'])

const source_items = [{ value: 'upload', title: '上傳新圖片'},{ value: 'link', title: '外部連結'}]
const labels = {
   'source':'來源', 
   'url':'Url',
   'title':'標題',
   'text':'說明'
}

const initialState = {
	form: {
		source: '',
	   url: '',
      title: '',
      text: '',
      files: []
	},
   upload: {
      source: 'upload',
      files: [], 
      thumbs: []
   },
   sources: []
}
const state = reactive(deepClone(initialState))

const file_upload = ref(null)

const rules = {
	url: { 
      required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED('Url'), required), 
      url: helpers.withMessage(VALIDATE_MESSAGES.WRONG_FORMAT_OF('Url'), url)
   }
}

const v$ = useVuelidate(rules, state.form)


onBeforeMount(() => {
   props.sources.forEach(key => {
      const item = source_items.find(x => x.value === key)
      state.sources.push(item)
   })
   state.form.source = props.sources[0]
})

function onSubmit() {
	v$.value.$validate().then(valid => {
		if(valid) emit('selected', state.form)
	})
}
function onFileAdded({files, thumbs}) {
   state.upload.files = files
   state.upload.thumbs = thumbs
   if(props.auto_submit) emit('selected', state.upload)
}

</script>
<template>
   <form  @submit.prevent="onSubmit">
      <v-row dense v-show="state.sources.length > 1">
         <v-col cols="12">
            <v-select 
            :items="state.sources" 
            :label="labels['source']"
            v-model="state.form.source"
            />
         </v-col>
      </v-row> 
      <v-row dense v-show="state.form.source === 'link'">
         <v-col cols="12">
            <v-text-field
            :label="labels['url']"
            v-model="state.form.url"
            :error-messages="v$.url.$errors.map(e => e.$message)"
            @input="v$.url.$touch"
            @blur="v$.url.$touch"
            />
            <v-text-field
            :label="labels['title']"
            v-model="state.form.title"
            />
            <v-text-field
            :label="labels['text']"
            v-model="state.form.text"
            />
         </v-col>
      </v-row> 
      <v-row dense v-show="state.form.source === 'upload'">
         <v-col cols="12">
            <CommonInputUpload ref="file_upload" 
            :is_media="true" :multiple="false" :show_button="true"
            @file-added="onFileAdded" @file-removed="onFileAdded"
            />
         </v-col>
      </v-row>
      <v-row dense v-show="!props.auto_submit">
         <v-col cols="12">
            <v-btn class="float-right" type="submit" color="success">確定</v-btn>
         </v-col>
      </v-row>
   </form>
</template>