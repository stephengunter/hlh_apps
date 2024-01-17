<script setup>
import { reactive, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { CHECK_AUTH, REFRESH_TOKEN } from '@/store/actions.type'
import { LOGIN, RE_LOGIN, SHOW_CONFIRM, HIDE_CONFIRM } from '@/store/actions.type'
import { DIALOG_MAX_WIDTH } from '@/config'
import { ERRORS, WARNING, SUCCESS, ICONS, DIALOG_TITLE, DIALOG_MESSAGE } from '@/consts'


const name = 'LayoutFeedBack'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
   success: {
		color: SUCCESS,
		icon: ICONS[SUCCESS],
		show: false,
		timeout: 1500,
		msg: '存檔成功'
	},
	confirm: {
		type: '',
		title: '',
		text: '',
		active: false,
		maxWidth: DIALOG_MAX_WIDTH,
		ok_text: '確定',
		cancel_text: '',
		on_ok: null,
		on_cancel: null
	}
}
const state = reactive({
   ...initialState,
})

const confirmNoAction = computed(() => {
	if(state.confirm.on_ok) return false
	if(state.confirm.on_cancel) return false
	return true
})

function onError(error) {
	let confirm = {
		type: ERRORS,
		title: DIALOG_TITLE[ERRORS],
		text: DIALOG_MESSAGE[ERRORS]
	}
	if(error) {
		if(error.title) confirm.title = error.title
		if(error.text) confirm.text = error.text
		errorHandler(error, confirm)
	}else {
		// no error state
		showConfirm(confirm)
	}
}
function errorHandler(error, confirm) {
	if(error.status === 400) {
		let errors = resolveErrorData(error)
		if(errors) {
			if(Object.values(errors)) {
				let text = ''
				Object.values(errors).forEach(item => {
					text += `<ul><li>${item}</li></ul>`
				})
				confirm.text = text
			}
			
      }
		showConfirm(confirm)
	}else if(error.status === 401) {	
		reLogin(() => {
			showConfirm({
				type: '',
				title: '請重新操作',
				text: '您的驗証剛剛刷新，請重新操作一次'
			})
		})
	}else if(error.status === 403) {
		//Forbidden
		showConfirm({
			type: '',
			title: '權限不足',
			text: '',
			ok: '確定',
			cancel: ''
		})
	}else if(error.status === 500) {
		confirm.text = DIALOG_MESSAGE[SERVER_ERROR]
		showConfirm(confirm)
	}else {
		showConfirm(confirm)
	}
}
function reLogin(callback = null) {
   //重新登入
   store.dispatch(CHECK_AUTH).then(auth => {
      if(auth){
         store.dispatch(REFRESH_TOKEN).then(token => {	
            if(token) {
               store.dispatch(CHECK_AUTH);
               if(callback) callback()
            } 
            else redirect('login', route.path)
         })
      }else {
         //無token
         redirect('login', route.path)
      }
   })
}
function redirect(name, returnUrl) {
	if(name === 'login') router.push({ name: 'login', query: { returnUrl } })
}

function onSuccess(msg) {
	console.log('onSuccess', msg)
	state.success.icon = ICONS[SUCCESS]
	state.success.color = SUCCESS
	state.success.msg = msg ? msg : '存檔成功'
	state.success.show = true
}
function onWarning(msg){
	state.success.icon = ICONS[WARNING]
	state.success.color = WARNING
	state.success.msg = msg
	state.success.show = true
}

function showConfirm({type, title, text, ok ='確定', cancel = '', onOk = null, onCancel = null, maxWidth = 0 }) {
	state.confirm = {
		type,
		title,
		text,
		maxWidth: maxWidth ? maxWidth : DIALOG_MAX_WIDTH,
		ok_text: ok,
		cancel_text: cancel,
		active: true,
		on_ok: onOk,
		on_cancel: onCancel
	}
}
function hideConfirm() {
	state.confirm = initialState.confirm
}

Bus.on(ERRORS, onError)
Bus.on(SUCCESS, onSuccess)
Bus.on(WARNING, onWarning)
Bus.on(SHOW_CONFIRM, showConfirm)
Bus.on(HIDE_CONFIRM, hideConfirm)
Bus.on(RE_LOGIN, reLogin)

</script>
<template>
	<div>

		<LayoutLoading />

		<LayoutShow />

		<v-snackbar :timeout="state.success.timeout"
		:color="state.success.color" v-model="state.success.show"
		>
			<v-icon :icon="state.success.icon" color="white" />
			<span class="ml-3">
				{{ state.success.msg  }}
			</span>
		</v-snackbar>

		<v-dialog v-model="state.confirm.active" :max-width="state.confirm.maxWidth" :persistent="!confirmNoAction">
			<CoreConfirmation :type="state.confirm.type"
			:title="state.confirm.title" :text="state.confirm.text"
			:ok_text="state.confirm.ok_text"  :cancel_text="state.confirm.cancel_text"
			:on_cancel="state.confirm.on_cancel"  :on_ok="state.confirm.on_ok"
			@ok="hideConfirm" @cancel="hideConfirm"
			/>
		</v-dialog>
		
	</div>
</template>