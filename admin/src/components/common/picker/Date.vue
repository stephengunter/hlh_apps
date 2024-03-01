<script setup>
import { reactive, computed, onBeforeMount, watch } from 'vue'
import { deepClone, dateToText, textToDate, isValidDate } from '@/utils'
import { STORE_DEPARTMENT } from '@/store/actions.type';

const name = 'CommonPickerDate'
const props = defineProps({
   value: {
      type: String,
		default: ''
	},
   label: {
      type: String,
		default: '日期'
	},
   error_message: {
      type: String,
		default: ''
	}
})
const emit = defineEmits(['selected'])

const initialState = {
   active: false,
	date: {
      model: null,
      text: ''
   }
}
const state = reactive(deepClone(initialState))
const errorMessages = computed(() => props.error_message ? [props.error_message] : [])

onBeforeMount(init)
watch(() => props.value, init ,{
   deep: false
})

function init() {
   const date = textToDate(props.value)
   if(isValidDate(date)) {
      state.date.model = date
   }else {
      state.date.model = null
      state.date.text = ''
   }
}

function onSelected(val) {
   if(val) state.date.text = dateToText(val)
   else {
      state.date.model = null
      state.date.text = ''
   }
   emit('selected', state.date)
   state.active = false
}

</script>
<template>
	<v-menu :close-on-content-click="false" v-model="state.active">
      <template v-slot:activator="{ props }">
         <v-text-field :label="label" readonly v-bind="props" clearable
         :model-value="state.date.text"
         :error-messages="errorMessages"
         @click:clear="onSelected(null)"
         />
      </template>
      <v-locale-provider locale="zhTW">
         <v-date-picker  color="primary" :hide-header="true" header="" v-model="state.date.model"
         @update:modelValue="onSelected"
         />
      </v-locale-provider>
   </v-menu>
</template>