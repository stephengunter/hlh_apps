<script setup>
import { reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { LOGIN } from '@/store/actions.type'
import { IDENTITY_API } from '@/config'
import { isEmptyObject, deepClone , 
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, is400
} from '@/utils'

const name = 'LoginPage'
const route = useRoute()
const router = useRouter()
const store = useStore()

const initialState = {	
	
}
const state = reactive(deepClone(initialState))
const isAuthenticated = computed(() => store.getters.isAuthenticated)

onBeforeMount(init)

function init() {
	if(fromIdentity()) onSubmit()
	else {
		if(isAuthenticated.value) {
			router.push({ path: '/', query: { } })
		}
	}
}
function fromIdentity() {
	if(isEmptyObject(route.query)) return false
	const source = route.query['source']
	if(source && source === IDENTITY_API) return true
	return false
}
function onSubmit() {
	store.dispatch(LOGIN)
	.then(() => {})
	.catch(error => onErrors(error))	
}
</script>

<template>
	<v-responsive class="align-centerfill-height mx-auto" max-width="900">
		<v-row>
			<v-col cols="12" class="text-center">
				<form @submit.prevent="onSubmit">
					<v-btn  type="submit"
					prepend-icon="mdi-account-circle" size="large" color="blue-darken-4"
					rounded="1" variant="outlined"
					>
						登入
					</v-btn>
				</form>
			</v-col>
			<v-col cols="6">
				
			</v-col>
		</v-row>
	</v-responsive>
</template>
