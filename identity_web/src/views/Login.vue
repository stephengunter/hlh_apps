<script setup>
import { reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { PASSWORD_LOGIN } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type' 
import { SITE_TITLE } from '@/config'
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

async function onSubmit(model) {
	const response = await fetch('https://localhost:7221/connect/token', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	},
	body: new URLSearchParams({
		grant_type: 'password',
		username: model.username,
		password: model.password,
		client_id: 'identity-web',
		scope: 'openid profile',
	}),
	});

	const data = await response.json();
	console.log(data); // Handle the response (access token)

	// store.commit(CLEAR_ERRORS)
	// store.dispatch(PASSWORD_LOGIN, model)
	// .then(() => {})
	// .catch(error => onSubmitError(error))
	
}
function onSubmitError(error) {
	console.log('onSubmitError', error);
	
	let data = resolveErrorData(error)
	console.log('data', data);
	if(data) {
		store.commit(SET_ERRORS, data)
	} 
	else onErrors(error)
}
</script>

<template>
	<v-responsive>
		<v-row>
			<v-col cols="12">
				<!-- <form @submit.prevent="onSubmit">
					<v-btn  type="submit"
					prepend-icon="mdi-account-circle" size="large" color="blue-darken-4"
					rounded="1" variant="outlined"
					>
						登入
					</v-btn>
				</form> -->
				<LoginForm 
				@submit="onSubmit"
				/>
			</v-col>
			<v-col cols="6">
				
			</v-col>
		</v-row>
	</v-responsive>
</template>
