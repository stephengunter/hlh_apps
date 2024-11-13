<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { DIALOG_MAX_WIDTH } from '@/config'
import { FETCH_ROLES
} from '@/store/actions.type'
import { deepClone, onErrors, setValues, downloadFile } from '@/utils'

const store = useStore()
const initialState = {
	form: {
		roles: []
	}
}
const state = reactive(deepClone(initialState))
const roles = computed(() => store.state.roles.list)
onBeforeMount(init)

function init() {
	store.dispatch(FETCH_ROLES)
}
function onSubmit() {
	
}	
</script>

<template>
	<div>
		<form @submit.prevent="onSubmit">
			<v-row>
				<v-col cols="4" v-for="role in roles">
					<v-checkbox density="compact"
					hide-details
					v-model="state.form.roles"
					:label="role.title"
					:value="role.id"
					
					/>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12">
					<v-btn color="success" type="submit">
						存檔
					</v-btn>
				</v-col>
			</v-row>
		</form>
	</div>
</template>