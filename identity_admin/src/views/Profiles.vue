<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { GET_PROFILES, UPDATE_PROFILES, SHOW_CONFIRM, HIDE_CONFIRM, LOGOUT } from '@/store/actions.type'
import { SET_ERRORS } from '@/store/mutations.type'
import { setValues, resolveErrorData, onErrors, onSuccess, deepClone } from '@/utils'
import { DIALOG_MAX_WIDTH } from '@/config'
import { ROUTE_NAMES } from '@/consts'


const name = 'ProfilesView'
const store = useStore()
const router = useRouter()

const initialState = {
   model: null,
   password: {
      active: false
   }
}
const state = reactive(deepClone(initialState))
const form = ref({})

onMounted(init)

function init() {
	store.dispatch(GET_PROFILES, store.getters.currentUser.id)
   .then(model => {
      state.model = model
      nextTick(() => form.value.init())
   })
	.catch(error => onErrors(error))
}
function onSubmit(form) {
   setValues(form, state.model)
   store.dispatch(UPDATE_PROFILES, state.model)
      .then(() => onUpdated('個人資料更新成功'))
      .catch(error => {
         let errors = resolveErrorData(error)
         if(errors) store.commit(SET_ERRORS, Object.values(errors))
         else onErrors(error)
      })
}
function onUpdated(msg) {
	onSuccess(msg)

	Bus.emit(SHOW_CONFIRM, {
		type: '',
		title: msg + ' , 請重新登入',
		text: '',
		onOk: () => {
			Bus.emit(HIDE_CONFIRM)
			store.dispatch(LOGOUT)
   		.then(() => router.push({ name: ROUTE_NAMES.LOGIN }))
		}
	})
}


</script>
<template>
   <div>
      <v-card :max-width="DIALOG_MAX_WIDTH">
         <v-card-title class="font-weight-black">
            <h2 class="ma-2">Profiles</h2>              
         </v-card-title>
         <v-card-text>
            <v-container>
               <ProfileForm ref="form"
               :model="state.model" :active="!state.password.active"
               @submit="onSubmit"
               />
            </v-container>
         </v-card-text>
      </v-card>
      <v-card :max-width="DIALOG_MAX_WIDTH">
         <v-card-title class="font-weight-black">
            <h2 class="ma-2">Password</h2>              
         </v-card-title>
         <v-card-text>
            <v-container>
               <PasswordView v-if="state.model" :model="state.model"
               @active="(val) => state.password.active = val" 
               @updated="onUpdated"
               />
            </v-container>
         </v-card-text>
      </v-card>
      
   </div>
</template>