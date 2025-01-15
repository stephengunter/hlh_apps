<script setup>
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { SET_PASSWORD, CHANGE_PASSWORD } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { DIALOG_MAX_WIDTH } from '@/config'
import { resolveErrorData, onErrors, deepClone } from '@/utils'

const name = 'PasswordView'
const props = defineProps({
   model: {
      type: Object,
      default: null
   }
})

const emit = defineEmits(['active', 'updated'])
const store = useStore()
const initialState = {
   form: {
		action: '',
		active: false,
		title: ''
	},
	dialog: false
}
const state = reactive(deepClone(initialState))

function onAction(key) {
	store.commit(CLEAR_ERRORS)
	state.form.title = (key === SET_PASSWORD ? '設定密碼' : '變更密碼')
   state.form.action = key
	state.form.active = true
	emit('active', true)
}
function onCancel() {
	store.commit(CLEAR_ERRORS)
	state.form.action = ''
	state.form.active = false
	state.form.title = ''
	emit('active', false)
}
function onSubmit(form) {
	store.dispatch(state.form.action, form)
	.then(() => onActionSuccess())
	.catch(error => onPasswordError(error))
}
function onPasswordError(error) {
   let errors = resolveErrorData(error)
   if(errors) store.commit(SET_ERRORS, Object.values(errors))
   else onErrors(error)
}
function onActionSuccess() {
	let msg = `${state.form.title}成功`
	emit('updated', msg)
}
</script>

<template>
	<div v-if="props.model">
		<v-row>
			<v-col v-if="props.model.hasPassword" cols="12">
				<v-chip variant="flat" color="green" prepend-icon="mdi-checkbox-marked-circle">
					密碼已設定
				</v-chip>
				<v-btn class="ml-2" variant="outlined" density="comfortable" color="primary"
				@click.prevent="onAction(CHANGE_PASSWORD)"
				>
					變更密碼
				</v-btn>
			</v-col> 
			<v-col v-else cols="12">
				<v-chip variant="flat" color="red" prepend-icon="mdi-alert-circle">
					密碼未設定
				</v-chip>
				<v-btn class="ml-2" variant="outlined" density="comfortable" color="primary"
				@click.prevent="onAction(SET_PASSWORD)"
				>
					立即設定
				</v-btn>
			</v-col>  
		</v-row>
		<v-dialog persistent v-model="state.form.active" :width="DIALOG_MAX_WIDTH + 50">
			<v-card :max-width="DIALOG_MAX_WIDTH">
				<v-card-title>
					<CoreCloseButton @close="onCancel" />
					<h2 class="ma-2">{{ state.form.title }}</h2>					
				</v-card-title>
        		<v-card-text>
					<v-container>
						<PasswordForm v-if="state.form.active" :action="state.form.action" 
						@submit="onSubmit"
						/>
					</v-container>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>