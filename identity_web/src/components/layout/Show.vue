<script setup>
import { ref, reactive, computed, onMounted, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { onSuccess, deepClone, onErrors, isPreviewable, createBlobFromFileBytes, downloadFromBlobUrl } from '@/utils'
import { SHOW_PASSWORD, GET_CRYPTO, SHOW_MODIFY_RECORDS, FETCH_MODIFY_RECORDS, PREVIEW_IMAGE, PREVIEW_ATTACHMENT, GET_ATTACHMENT } from '@/store/actions.type'
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
   password:{
      value: '',
      visible: false
   },
   active: false,
   width: WIDTH.M,
   title: ''
}

const state = reactive(deepClone(initialState))

Bus.on(SHOW_PASSWORD, showPassword)
Bus.on(SHOW_MODIFY_RECORDS, showModifyRecords)
Bus.on(PREVIEW_IMAGE, previewImage)
Bus.on(PREVIEW_ATTACHMENT, previewAttachment)

// onMounted(() => {
	
// })
function showPassword({ type, id, title }) {
   if(type === ENTITY_TYPES.CREDENTIALINFO.name) {
      store.dispatch(GET_CRYPTO, { type, id })
	   .then(data => {
         state.password.visible = false
         state.password.value = data
         state.key = SHOW_PASSWORD
         state.title = title ? title : ENTITY_TYPES.CREDENTIALINFO.title
         state.width = WIDTH.S
         state.active = true
      })
      .catch(error => onErrors(error)) 
   }
}

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
</script>
<template>
   <v-dialog persistent v-model="state.active" :width="state.width">
      <v-card v-if="state.active">
         <CommonCardTitle :title="state.title"
			@cancel="onCancel"
			/>
         <v-card-text>
            
         </v-card-text>
      </v-card>
   </v-dialog>
</template>