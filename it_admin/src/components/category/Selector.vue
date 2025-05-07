
<script setup>
import { reactive, onBeforeMount, computed, watch } from 'vue'
import { deepClone } from '@/utils'
const name = 'CategorySelector'
const props = defineProps({
   type: {
      type: String,
      default: 'Property'
   },
   label: {
      type: String,
      default: '分類'
   },
	keyword: {
      type: String,
      default: ''
   },
	density: {
      type: String,
      default: 'compact'
   },
   variant: {
      type: String,
      default: 'outlined'
   },
   list: {
      type: Array,
      default: () => []
   },
	clearable: {
      type: Boolean,
      default: false
   },
   can_edit: {
      type: Boolean,
      default: false
   },
	multiple: {
      type: Boolean,
      default: false
   },
   error_message: {
      type: String,
		default: ''
	}
})
const emit = defineEmits(['selected', 'edit'])
defineExpose({
   init
})
const initialState = {
   val: ''
}
const state = reactive(deepClone(initialState))
watch(() => props.keyword, init ,{
   deep: false
})

const items = computed(() => {
	if(props.list.length) return props.list.map(x => x.title)
	return []
})
onBeforeMount(init)

const errorMessages = computed(() => props.error_message ? [props.error_message] : [])


function init() {
   state.val = props.keyword
}
function onSelected() {
	if(state.val) {
		emit('selected', props.list.find(x => x.title === state.val))
	}
	else emit('selected', null)
}

function edit() {
	emit('edit')
}
</script>

<template>
   <v-autocomplete :density="density" :variant="variant"
	:clearable="clearable" :multiple="multiple"
   :error-messages="errorMessages"
	v-model="state.val" :disabled="state.active"
	:items="items" 
	:label="label"
	@update:modelValue="onSelected"
	>
      <template v-if="can_edit" v-slot:append>
         <CommonButtonDefault   tooltip="編輯分類" :icon_only="true" 
         icon="mdi-pencil" color=""
         @click="edit"
         />
        </template>
   </v-autocomplete>
</template>