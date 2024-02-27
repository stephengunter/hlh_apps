import vuetify from './vuetify'
import vue3GoogleLogin from 'vue3-google-login'
import { Vue3Mq } from 'vue3-mq'
import { GOOGLE_AUTH_PARAMS } from '@/config'

import router from '@/routes'
import store from '@/store'

export const registerPlugins = (app) => {
	app.use(vuetify)
		.use(Vue3Mq, {
			preset: 'vuetify'
		})
		.use(vue3GoogleLogin, {
			clientId: GOOGLE_AUTH_PARAMS.client_id
		})
		.use(router)
		.use(store)
		
}
