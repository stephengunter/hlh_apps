<script setup>
import { ref, reactive, computed, onMounted, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { deepClone, onErrors, isPreviewable, createBlobFromFileBytes, downloadFromBlobUrl } from '@/utils'
import { SHOW_MODIFY_RECORDS, FETCH_MODIFY_RECORDS, PREVIEW_IMAGE, PREVIEW_ATTACHMENT, GET_ATTACHMENT } from '@/store/actions.type'
import { WIDTH, ENTITY_TYPES } from '@/consts'

const name = 'LayoutShow'
const store = useStore()

const initialState = {
   key: '',
   model: null,
   image: {
      blob: null, 
      url: '',
      width: 0,
      height: 0
   },
   attachment: {
      blob: null, 
      url: '',
      width: 0,
      height: 0
   },
   active: false,
   width: WIDTH.M,
   title: ''
}

const state = reactive(deepClone(initialState))

Bus.on(SHOW_MODIFY_RECORDS, showModifyRecords)
Bus.on(PREVIEW_IMAGE, previewImage)
Bus.on(PREVIEW_ATTACHMENT, previewAttachment)

// onMounted(() => {
	
// })

function previewImage({ ext, fileBytes, title }) {
   const blob = createBlobFromFileBytes(fileBytes, ext)
   const url = URL.createObjectURL(blob)

   const img = new Image();
   img.onload = () => {
      state.image.width = img.width
      state.image.height = img.height
   }
   img.src = url
   state.image.blob = blob
   state.image.url = url
   state.image.title = title

   state.title = title
   state.key = PREVIEW_IMAGE
   state.active = true

   state.model = { ext, fileBytes, title }
}
function previewAttachment({ id }) {
   store.dispatch(GET_ATTACHMENT, id)
	.then(data => {
      const fileType = data.fileType.toLowerCase()
      console.log('fileType', fileType)
      
		const ext = data.ext
		const fileBytes = data.fileView.fileBytes
		const title = data.title

      if(fileType === 'image') {
         previewImage({ ext, fileBytes, title })
      }else {
         const blob = createBlobFromFileBytes(fileBytes, ext)
         const blobUrl = URL.createObjectURL(blob)
         if(fileType === 'pdf') {
            state.attachment.url = blobUrl
            state.title = title
            state.key = PREVIEW_ATTACHMENT
            state.width = WIDTH.XL
            state.active = true
         }else {
            downloadFromBlobUrl(blobUrl, `${title}${ext}`)         
         }
      }
		
	})
	.catch(error => onErrors(error))
}
function downloadImage() {
   downloadFromBlobUrl(state.image.url, `${state.model.title}${state.model.ext}`)
}
function showModifyRecords({type, id, action, title, width}) {
   state.key = ENTITY_TYPES.MODIFY_RECORD
   state.title = title
   state.width = width ? width : WIDTH.M + 200
   if(type && id) {
      store.dispatch(FETCH_MODIFY_RECORDS, { type, id, action })
      .then(() => state.active = true)
      .catch(error => console.log(error))
   }else {
      state.active = true
   }
}
function onCancel() {
   state.active = false
   if(state.attachment.url) {
      URL.revokeObjectURL(state.attachment.url)
   }
   Object.assign(state, deepClone(initialState));
}
</script>
<template>
   <v-dialog persistent v-model="state.active" :width="state.width">
      <v-card v-if="state.active">
         <CommonCardTitle :title="state.title"
			@cancel="onCancel"
			/>
         <v-card-text>
            <ModifyRecordTable v-if="state.key === ENTITY_TYPES.MODIFY_RECORD" />
            <div v-if="state.key === PREVIEW_IMAGE">
               <v-row dense>
                  <v-col cols="12">
                     <CommonButtonDownload class_name="float-right" 
                     @download="downloadImage"
                     />
                  </v-col>
                  <v-col cols="12">
                     <v-img class="mx-auto" :src="state.image.url" :max-width="state.image.width"
                     :max-height="state.image.height"
                     />
                     <!-- <span v-if="state.image.title" class="mt-3" style="font-size: 1.2rem; display: inline-block;" v-text="state.image.title"></span> -->
                  </v-col>
               </v-row>
            </div>
            <div v-if="state.key === PREVIEW_ATTACHMENT">
               <iframe :src="state.attachment.url" style="width: 100%; height:100vh">
               </iframe>  
            </div>
         </v-card-text>
      </v-card>
   </v-dialog>
</template>