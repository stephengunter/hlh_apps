<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { deepClone, photoCustomTag, onSuccess, dateToText, textToDate } from '@/utils'

const initialState = {
	class_name: 'float-right',
	date: '',
	page: 1,
   dialog: false,
	text: '<p>Example Text</p><p>I will display &#x1f60e;</p>',
	items: [
        { text: 'Real-Time', icon: 'mdi-clock' , subItems: [{
			text: 'Sub1', icon: 'mdi-view-dashboard', subItems: []
		  },{
			text: 'Sub2', icon: 'mdi-file-tree-outline', subItems: []
		  }]},
        { text: 'Audience', icon: 'mdi-account', subItems: []},
        { text: 'Conversions', icon: 'mdi-flag' , subItems: []},
      ],
}
const state = reactive(deepClone(initialState))

function save() {
	onSuccess('登入成功')
   // const content = tiptap.value.getContent()
	// console.log(content)
}

const tiptap = ref(null)

onMounted(() => {
	
	
})
function onDragEnd ({ oldIndex, newIndex }) {
   console.log('onDragEnd', oldIndex, newIndex )
}
function test() {
	console.log('test')
	//console.log(dateToText(val))
}
</script>

<template>
	<div>
	<v-row>
		<v-col cols="12">
			<a href="#" @click.prevent="test">test</a>
		</v-col>
		<v-col cols="12">
			
			
		</v-col>
		<v-col cols="12">
		
		</v-col>
		<v-col cols="12">
			
		</v-col>
		<v-col cols="12">
			
		</v-col>
	</v-row>
</div>
</template>