
<script setup>
import { reactive, onBeforeMount, computed, watch } from 'vue'
import { deepClone } from '@/utils'
const name = 'DepartmentSelector'
const props = defineProps({
   label: {
      type: String,
      default: '科室'
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
	if(props.list.length) return props.list.map(x => x.title)
	return []
})
onBeforeMount(init)

function init() {
   state.val = props.keyword
}
function onSelected() {
	if(state.val) {
		emit('selected', props.list.find(x => x.title === state.val))
	}
	else emit('selected', null)
}
</script>

<template>
   <v-autocomplete :density="density"
	:clearable="clearable" :multiple="multiple"
	v-model="state.val"
	:items="items"
	:label="label"
	@update:modelValue="onSelected"
	/>
</template>