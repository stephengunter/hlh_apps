<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { SHOW_PHOTO } from '@/store/actions.type'
import { DIALOG_MAX_WIDTH } from '@/config'
import { onErrors } from '@/utils'

const name = 'LayoutShow'
const store = useStore()
const photo = ref({
   active: false,
   model: null,
   maxWidth: DIALOG_MAX_WIDTH
})
const term = ref({
   model: null,
   active: false,
   maxWidth: DIALOG_MAX_WIDTH
})
const note = ref({
   model: null,
   active: false,
   maxWidth: DIALOG_MAX_WIDTH
})
const responsive = computed(() => store.getters.responsive)
const contentMaxWidth = computed(() => store.getters.contentMaxWidth)
Bus.on(SHOW_PHOTO, showPhoto)

onMounted(() => {
	
})
onBeforeUnmount(() => {
	
})
function showPhoto(photo) {
   if(photo) {
      photo.value.model = photo;
      photo.value.active = true;
   }else {
      photo.value.model = null;
      photo.value.active = false;
   }
}
</script>
<template>
<div>
   <v-dialog v-model="photo.active" :max-width="photo.maxWidth">
      <v-card v-if="photo.model">
         <!-- <core-close-icon-button @close="showPhoto(null)" /> -->
         <v-card-text>
            <div class="text-center" style="padding-top:36px;">
               <v-img class="img-center" :src="photo.model.id | photoIdUrl"
                  :max-width="photo.model.width"
               />
               <span v-if="photo.model.title" style="font-size: 16px; display: inline-block;" class="mt-3" v-text="photo.model.title"></span>
            </div>
         </v-card-text>
      </v-card>
   </v-dialog>
</div>      
</template>