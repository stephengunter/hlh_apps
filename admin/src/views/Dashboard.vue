<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { resolveErrorData, photoCustomTag, onSuccess } from '@/utils'
import pluralize from 'pluralize'

const data = reactive({
	dialog: false,
	text: '<p>Example Text</p><p>I will display &#x1f60e;</p>'
})

function save() {
	onSuccess('登入成功')
   // const content = tiptap.value.getContent()
	// console.log(content)
}

const tiptap = ref(null)

onMounted(() => {
	console.log(pluralize('test')) //=> "tests"
	//if(!matches) return result;
	//console.log(tiptap.value);
})
</script>

<template>
	<div>
	<v-row>
		<v-col cols="12">
			<CoreUploadButton />
			
		</v-col>
		<v-col cols="12">
			<p>
				cscscc
			<span style="display: inline-block;" class="qqface-wrapper">
				<img src="/qqface.png" class="qqface qqface15">
			</span>
			</p>
			
		</v-col>
		<v-col cols="12">
			<editor-tiptap ref="tiptap" />
		</v-col>
		<v-col cols="12">
			<v-btn @click.prevent="save" >
				Save
			</v-btn>
		</v-col>
		<v-col cols="12">
			
		</v-col>
	</v-row>
</div>
</template>