<script setup>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs, not, helpers } from '@vuelidate/validators'
import { SET_PASSWORD, CHANGE_PASSWORD } from '@/store/actions.type'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES } from '@/consts'

const name = 'PasswordForm'
const props = defineProps({
   action: {
      type: String,
      default: ''
   }
})

const emit = defineEmits(['submit'])
const store = useStore()
const initialState = {
   form: {
		userId : store.getters.currentUser.id,
      password: '',
      token: '',
		confirm_pw: ''
   },
	password: {
      visible: false
   },
	token: {
      visible: false
   },
	confirm_pw: {
      visible: false
   }
}
const state = reactive({
   ...initialState,
})

const token = computed(() => state.form.token)
const rules = computed(() => {
	if(props.action === CHANGE_PASSWORD) {
		return {
			token: { 
				required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED('原密碼'), required)
			},
			password: { 
				required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED('新密碼'), required), 
				minLength: helpers.withMessage(VALIDATE_MESSAGES.MIN_LENGTH(6, '新密碼'), minLength(6)),
				notOld: helpers.withMessage(VALIDATE_MESSAGES.NOT_SAME_AS('新密碼', '原密碼'), not(sameAs(token)))
			},
			confirm_pw: { 
				required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED('確認密碼'), required),
				sameAsPassword: helpers.withMessage(VALIDATE_MESSAGES.SAME_AS('確認密碼', '新密碼'), sameAs(state.form.password)), 
			}
		}
	}else {
		return {
			password: { 
				required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED('密碼'), required), 
				minLength: helpers.withMessage(VALIDATE_MESSAGES.MIN_LENGTH(6, '密碼'), minLength(6))
			},
			confirm_pw: { 
				required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED('確認密碼'), required),
				sameAsPassword: helpers.withMessage(VALIDATE_MESSAGES.SAME_AS('確認密碼', '密碼'), sameAs(state.form.password)), 
			}
		}
	}
})

const v$ = useVuelidate(rules, state.form)

function onSubmit() {
	v$.value.$validate().then(valid => {
      if(!valid) return
      emit('submit', state.form)
	})
}
function onInputChanged() {
   store.commit(CLEAR_ERRORS)
}
</script>

<template>
   <form @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row>
			<v-col v-if="props.action === SET_PASSWORD" cols="12">
				<v-text-field variant="outlined" prepend-inner-icon="mdi-lock-outline"
				density="compact" label="密碼" placeholder="請輸入密碼"
				:append-inner-icon="state.password.visible ? 'mdi-eye-off' : 'mdi-eye'"
				:type="state.password.visible ? 'text' : 'password'"
				v-model="state.form.password" :error-messages="v$.password.$errors.map(e => e.$message)"
				@input="v$.password.$touch"
				@blur="v$.password.$touch"
				@click:append-inner="state.password.visible = !state.password.visible"
				/>
				<v-text-field variant="outlined" prepend-inner-icon="mdi-lock-outline"
				density="compact" label="確認密碼" placeholder="請再次輸入密碼"
				:append-inner-icon="state.confirm_pw.visible ? 'mdi-eye-off' : 'mdi-eye'"
				:type="state.confirm_pw.visible ? 'text' : 'password'"
				v-model="state.form.confirm_pw" :error-messages="v$.confirm_pw.$errors.map(e => e.$message)"
				@input="v$.confirm_pw.$touch"
				@blur="v$.confirm_pw.$touch"
				@click:append-inner="state.confirm_pw.visible = !state.confirm_pw.visible"
				/>
			</v-col>
			<v-col v-else cols="12">
				<v-text-field variant="outlined" prepend-inner-icon="mdi-lock-outline"
				density="compact" label="原密碼" placeholder="請輸入原密碼"
				:append-inner-icon="state.token.visible ? 'mdi-eye-off' : 'mdi-eye'"
				:type="state.token.visible ? 'text' : 'password'"
				v-model="state.form.token" :error-messages="v$.token.$errors.map(e => e.$message)"
				@input="v$.token.$touch"
				@blur="v$.token.$touch"
				@click:append-inner="state.token.visible = !state.token.visible"
				/>
				<v-text-field variant="outlined" prepend-inner-icon="mdi-lock-outline"
				density="compact" label="新密碼" placeholder="請輸入新密碼"
				:append-inner-icon="state.password.visible ? 'mdi-eye-off' : 'mdi-eye'"
				:type="state.password.visible ? 'text' : 'password'"
				v-model="state.form.password" :error-messages="v$.password.$errors.map(e => e.$message)"
				@input="v$.password.$touch"
				@blur="v$.password.$touch"
				@click:append-inner="state.password.visible = !state.password.visible"
				/>
				<v-text-field variant="outlined" prepend-inner-icon="mdi-lock-outline"
				density="compact" label="確認密碼" placeholder="請再次輸入新密碼"
				:append-inner-icon="state.confirm_pw.visible ? 'mdi-eye-off' : 'mdi-eye'"
				:type="state.confirm_pw.visible ? 'text' : 'password'"
				v-model="state.form.confirm_pw" :error-messages="v$.confirm_pw.$errors.map(e => e.$message)"
				@input="v$.confirm_pw.$touch"
				@blur="v$.confirm_pw.$touch"
				@click:append-inner="state.confirm_pw.visible = !state.confirm_pw.visible"
				/>
			</v-col>
			<v-col cols="12">
				<v-btn type="submit" color="success" class="float-right">
				確定
				</v-btn>
			</v-col> 
			<v-col cols="12">
				<CoreErrorList />
			</v-col>  
		</v-row>
	</form>
</template>