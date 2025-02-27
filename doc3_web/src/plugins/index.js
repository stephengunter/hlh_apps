import vuetify from './vuetify'
import { Vue3Mq } from 'vue3-mq'

import router from '@/routes'
import store from '@/store'

export const registerPlugins = (app) => {
	app.use(vuetify)
		.use(Vue3Mq, {
			preset: 'vuetify'
		})
		.use(router)
		.use(store)
		
}
