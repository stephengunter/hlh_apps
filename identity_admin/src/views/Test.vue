<script setup>
import { ref, reactive, computed, onBeforeMount, nextTick } from 'vue'
import { setValues, getValue, isValidURL, deepClone, isEmptyObject } from '@/utils'

onBeforeMount(() => {
	console.log(isValidURL('http://localhost:3000'))
})
</script>

<template>
	<div>
		test
	</div>
</template>