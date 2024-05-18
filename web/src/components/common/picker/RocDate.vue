<script setup>
import { ref, onMounted, reactive } from 'vue'
import Datepicker from 'roc-datepicker'
import 'roc-datepicker/dist/Datepicker.css'


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
   <div class="datepicker-container">
     <div class="input-wrapper">
       <input class="styled-input"
        v-model="state.date.text_cn"
        type="text"
        @blur="blur"
        @focus="focus"
        @click="click"
         
       />
       <span class="material-icons clear-icon" >
         <v-icon icon="mdi-close" />
       </span>
     </div>
     <Datepicker ref="date_picker"
		v-model="state.date.model"
		@valueChanged="onValueChanged"
		@update:modelValue="onSelected"
		/>
   </div>
 </template>
 
 <style scoped>
 .datepicker-container {
   position: relative;
   display: inline-block;
 }
 
 .input-wrapper {
   position: relative;
 }
 
 .styled-input {
   width: 100%;
   padding: 0.75rem 1rem;
   font-size: 1rem;
   line-height: 1.5;
   color: #495057;
   background-color: #fff;
   background-clip: padding-box;
   border: 1px solid #ced4da;
   border-radius: 0.25rem;
   transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
   padding-right: 2.5rem; /* Add space for the icon */
 }
 
 .styled-input:focus {
   color: #495057;
   background-color: #fff;
   border-color: #80bdff;
   outline: 0;
   box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
 }
 
 .styled-input::placeholder {
   color: #6c757d;
   opacity: 1;
 }
 
 .styled-input:disabled {
   background-color: #e9ecef;
   opacity: 1;
 }
 
 .clear-icon {
   position: absolute;
   top: 50%;
   right: 1rem;
   transform: translateY(-50%);
   cursor: pointer;
   color: #999;
   transition: color 0.3s;
 }
 
 .clear-icon:hover {
   color: #333;
 }
 </style>
 