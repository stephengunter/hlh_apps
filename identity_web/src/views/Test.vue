<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { deepClone, onErrors, setValues } from '@/utils'

const initialState = {
	form: {
		roles: []
	},
	text: '',
}

const state = reactive(deepClone(initialState))

onBeforeMount(init)

function init() {
	
}
</script>

<template>
	<div>
		test
	</div>
</template>