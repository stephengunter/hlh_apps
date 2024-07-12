<script setup>
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { url, required, helpers } from '@vuelidate/validators'
import { DIALOG_MAX_WIDTH } from '@/config'
import { WIDTH, VALIDATE_MESSAGES, ACTION_TYPES } from '@/consts'
import { deepClone, setValues } from '@/utils'
import { el } from 'date-fns/locale'

const name = 'AttachmentIcon'
const props = defineProps({
   model: {
      type: Object,
      default: null
   },
   tooltip: {
      type: String,
      default: ACTION_TYPES.PREVIEW['title']
   },
   disabled: {
      type: Boolean,
      default: false
   },
   class_name: {
      type: String,
      default: ''
   },
   size: {
      type: String,
      default: 'default'
   },
   icon_only: {
      type: Boolean,
      default: true
   }
})
const emit = defineEmits(['click'])

const initialState = {
	color: '',
   icon: ''
}

const state = reactive(deepClone(initialState))

onBeforeMount(() => {
   const model = props.model
   if(model) {
      const fileType = model.fileType.toLowerCase()
      
      if(fileType === 'pdf') {
         state.icon = 'mdi-file-pdf-box'
         state.color = 'red'
      } 
      else if(fileType === 'image') state.icon = 'mdi-image'
      else if(fileType === 'word') state.icon = 'mdi-microsoft-word'
      else if(fileType === 'excel') state.icon = 'mdi-microsoft-excel'
      else state.icon = 'mdi-file-document'
   }
})


</script>
<template>
   <v-tooltip v-if="tooltip" top>
      <template v-slot:activator="{ props }">
         <v-btn  v-bind="props"
         :icon="state.icon" :color="state.color" :size="size"
         :disabled="disabled" :class="class_name"
         :variant="icon_only ? 'text' : 'elevated'"
         @click.prevent="() => emit('click')" 
         />
         {{ model.fileType }}
      </template>
      <span v-text="tooltip"></span>
   </v-tooltip>
   <v-btn v-else :icon="state.icon" :color="state.color" :size="size"
   :disabled="disabled" :class="class_name"
   :variant="icon_only ? 'text' : 'elevated'"
   @click.prevent="() => emit('click')" 
   />
</template>