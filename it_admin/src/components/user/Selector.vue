
<script setup>
import { reactive, onBeforeMount, computed, watch } from 'vue'
import { deepClone } from '@/utils'
const name = 'UserSelector'
const props = defineProps({
   label: {
      type: String,
      default: '用戶'
   },
	keyword: {
      type: String,
      default: ''
   },
	density: {
      type: String,
      default: 'compact'
   },
   list: {
      type: Array,
      default: () => []
   },
	clearable: {
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
const emit = defineEmits(['selected'])
defineExpose({
   init
})
const initialState = {
   val: '' 
}
const state = reactive(deepClone(initialState))

const items = computed(() => {
	if(props.list.length) return props.list.map(x => x.profiles.name)
	return []
})
onBeforeMount(init)
const errorMessages = computed(() => props.error_message ? [props.error_message] : [])


function init() {
   state.val = props.keyword
}
function onSelected() {
	if(state.val) {
		emit('selected', props.list.find(x => x.profiles.name === state.val))
	}
	else emit('selected', null)
}
</script>

<template>
   <v-autocomplete :density="density"
	:clearable="clearable" :multiple="multiple"
   :error-messages="errorMessages"
	v-model="state.val"
	:items="items"
	:label="label"
	@update:modelValue="onSelected"
	/>
</template>