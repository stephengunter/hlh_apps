<script setup>
import { computed} from 'vue'
import { converCustomTags } from '@/utils'

const name = 'ArticlesContent'
const props = defineProps({
   content: {
		type: String,
		default: ''
	}
})
const content = computed(() => converCustomTags(props.content))
</script>

<template>
	<article v-html="content">
   </article>
</template>


