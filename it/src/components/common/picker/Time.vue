<script setup>
import { reactive, computed, onBeforeMount, watch } from 'vue'
import { deepClone, isValidTime } from '@/utils'

const name = 'CommonPickerTime'
const props = defineProps({
   value: {
      type: String,
		default: ''
	},
   label: {
      type: String,
		default: ''
	},
   title: {
      type: String,
		default: '選擇時間'
	},
   minute: {
      type: Number,
		default: -1
	},
   error_messages: {
      type: Array,
		default: () => []
	},
   clearable: {
      type: Boolean,
		default: true
	},
   show_icon: {
      type: Boolean,
		default: false
	}
})
const emit = defineEmits(['selected'])

const initialState = {
   time: null,
   menu: false,
}

const state = reactive(deepClone(initialState))
//const errorMessages = computed(() => props.error_message ? [props.error_message] : [])

onBeforeMount(init)
watch(() => props.value, init ,{
   deep: false
})

function init() {
   if(props.value && isValidTime(props.value)) {
      state.time = props.value
   }else {
      state.time = null
   }
}
function onSelected(val) {
   state.menu = false
	emit('selected', val)
}

</script>
<template>
	<v-text-field v-model="state.time" :active="state.menu" :focus="state.menu"
   :label="label" :prepend-icon="props.show_icon ? 'mdi-clock-time-four-outline' : ''"
   :error-messages="error_messages"
   readonly
   >
      <v-menu v-model="state.menu"
      :close-on-content-click="false"
      activator="parent" transition="scale-transition"
      >
         <v-time-picker full-width format="24hr" :title="title"
         v-if="state.menu" v-model="state.time"
         @update:modelValue="onSelected"     
         />
      </v-menu>
   </v-text-field>
</template>