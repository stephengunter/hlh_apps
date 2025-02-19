<script setup>
import { reactive, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { email, required, helpers } from '@vuelidate/validators'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'  
import { VALIDATE_MESSAGES, WIDTH } from '@/consts'
import { resolveErrorData, onErrors, onSuccess, setValues, deepClone } from '@/utils'

const name = 'LoginForm'
const store = useStore()

const initialState = {
   form: {
      username: '',
      password: ''
   },
   password:{
      visible: false
   }
}
const emit = defineEmits(['submit'])
const state = reactive(deepClone(initialState))
const labels = {
	'username':'使用者名稱',
	'password':'密碼'
}

const rules = {
   username: { 
      required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['username']), required) 
   },
   password: {
      required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['password']), required)
   } 
}

const v$ = useVuelidate(rules, state.form)

onBeforeMount(() => {
	
})

function onSubmit() {
	v$.value.$validate().then(valid => {
      if(!valid) return
      emit('submit', state.form)
	})
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}
</script>


<template>
   <v-card :max-width="WIDTH.S">
      <v-card-title class="font-weight-black">
         <h2 class="ma-2">登入</h2>            
      </v-card-title>
      <v-card-text>
            <form @submit.prevent="onSubmit" @input="onInputChanged">
               <v-row>
                  <v-col cols="12">
                     <v-text-field variant="outlined" :label="labels['username']"
                     prepend-inner-icon="mdi-account"
                     density="compact" :placeholder="`請輸入${labels['username']}`"                     
                     v-model="state.form.username"
                     :error-messages="v$.username.$errors.map(e => e.$message)"                     
                     @input="v$.username.$touch"
                     @blur="v$.username.$touch"
                     />
                     <v-text-field variant="outlined" :label="labels['password']"
                     prepend-inner-icon="mdi-lock-outline"
                     density="compact" :placeholder="`請輸入${labels['password']}`" 
                     :append-inner-icon="state.password.visible ? 'mdi-eye-off' : 'mdi-eye'"
                     :type="state.password.visible ? 'text' : 'password'"
                     v-model="state.form.password"
                     :error-messages="v$.password.$errors.map(e => e.$message)"
                     @input="v$.password.$touch"
                     @blur="v$.password.$touch"
                     @click:append-inner="state.password.visible = !state.password.visible"
                     />
                  </v-col>
                  <v-col cols="12">
                     <v-btn type="submit" color="success" class="float-right">
                     登入
                     </v-btn>
                  </v-col> 
                  <v-col cols="12">
                     <CommonErrorsList />
                  </v-col>
               </v-row>
            </form>
      </v-card-text>
   </v-card>
</template>