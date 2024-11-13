<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { SHOW_PHOTO } from '@/store/actions.type'
import { WIDTH } from '@/consts'

const name = 'LayoutShow'
const store = useStore()
const photo = ref({
   active: false,
   model: null,
   maxWidth: WIDTH.S
})
const term = ref({
   model: null,
   active: false,
   maxWidth: WIDTH.S
})
const note = ref({
   model: null,
   active: false,
   maxWidth: WIDTH.S
})

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