<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { SIGN_IN_CALLBACK } from '@/store/actions.type'
import { SITE_TITLE } from '@/config'
import { isEmptyObject, deepClone , 
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, is400
} from '@/utils'

const name = 'SigninCallbackPage'
const route = useRoute()
const router = useRouter()
const store = useStore()

onBeforeMount(() => {
	store.dispatch(SIGN_IN_CALLBACK)
	.then(() => {
		router.push({ path: '/' })
	})
	.catch(error => onErrors(error))
})
</script>

<template>
	
</template>
