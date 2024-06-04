import vue3GoogleLogin from 'vue3-google-login'
import { GOOGLE_AUTH_PARAMS } from '@/config'


export const addGoogleLogin = (app) => {
   app.use(vue3GoogleLogin, {
      clientId: GOOGLE_AUTH_PARAMS.client_id
   })
}