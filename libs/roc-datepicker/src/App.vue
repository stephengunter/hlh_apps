<script setup>
import { ref, onMounted, reactive } from 'vue'
import Datepicker from './datepicker/Datepicker.vue'


const initialState = {
	date: {
		model: null,
		text: '',
		text_cn: ''

	}
}
const state = reactive({ ...initialState })

const date_picker = ref(null)

onMounted(() => {
	
})

function test() {
	date_picker.value.launch()
}
function blur(val) {
	date_picker.value.blur()
}
function focus(val) {
	date_picker.value.focus()
}
function click(val) {
	date_picker.value.click()
}
function onSelected(model) {
	console.log('onSelected', model)
}
function clear() {
	date_picker.value.clearModelValue()
}
function onValueChanged(val) {
	console.log('onValueChanged', val)
}
</script>

<template>
   <div>
		<input 
		  v-model="state.date.selected"
        type="text"
        @blur="blur"
        @focus="focus"
        @click="click"
      />
		<a href="#" @click.prevent="clear">clear</a>
		<Datepicker ref="date_picker"
		v-model="state.date.model"
		@valueChanged="onValueChanged"
		@update:modelValue="onSelected"
		/>
	</div>
</template>

