<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { DIALOG_MAX_WIDTH } from '@/config'
import { FETCH_ROLES, LOGIN
} from '@/store/actions.type'
import { deepClone, onErrors, setValues, downloadFile } from '@/utils'
import { useClipboard } from '@vueuse/core'

const { text, isSupported, copy } = useClipboard()
const store = useStore()
const input = ref('')

const initialState = {
	form: {
		roles: []
	},
	text: ''
}

const state = reactive(deepClone(initialState))

const roles = computed(() => store.state.roles.list)
onBeforeMount(init)

function init() {
	state.test = 'CredentialInfo'.toUpperCase()
	store.dispatch(FETCH_ROLES)
}
function onSubmit() {
	
	store.dispatch(LOGIN)
}	
function onCopy() {
	copy(state.text)
}	
</script>

<template>
	<div>
		<div v-if="isSupported">
			<p>
				Current copied: <code>{{ text || 'none' }}</code>
			</p>
			<input v-model="state.text" type="text">
			<button @click="onCopy">
				Copy
			</button>
		</div>
		<p v-else>
			Your browser does not support Clipboard API
		</p>
	</div>
</template>