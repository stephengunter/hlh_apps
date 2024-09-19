<script setup>
import { reactive } from 'vue'
import { DIALOG_MAX_WIDTH } from '@/config'
import { resolveErrorData, onErrors, onWarning } from '@/utils'

const data = reactive({
	image: {
		active: false
	}
})
  
function image(val) {
	onErrors()
	//data.image.active = val
}

function onImageSelected(model) {
	
	//image(false)
}
</script>

<template>
	<div>
		<v-row>
			<v-col cols="12">
				<TagSearch />
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				
			</v-col>
		</v-row>
		
	</div>
 </template>