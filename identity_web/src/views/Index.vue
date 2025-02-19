<script setup>
import { onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { FETCH_APPS } from '@/store/actions.type'
import { onErrors } from '@/utils'

const store = useStore()

onBeforeMount(() => {
	// store.dispatch(FETCH_APPS)
	// .then(data => {
	// 	console.log(data)
	// })
	// .catch(error => onErrors(error))
})
const apps = [{
	title: 'app1',
	url: 'http://localhost:3000'
}]

function logout() {
	store.dispatch(LOGOUT)
		.then(() => {
			
		})
		.catch(error => onErrors(error))
}
</script>

<template>
	<v-responsive>
		<v-row>
			<v-col cols="6" v-for="app in apps">
				<v-card append-icon="mdi-open-in-new" class="py-4" color="surface-variant" :title="app.title"
					:href="app.url" rel="noopener noreferrer" rounded="lg" target="_blank" variant="text">
					<v-overlay opacity=".06" scrim="primary" contained model-value persistent />
				</v-card>
			</v-col>
		</v-row>
	</v-responsive>
</template>
