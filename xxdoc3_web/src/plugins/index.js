import vuetify from './vuetify'

import router from '@/routes'
import store from '@/store'

export const registerPlugins = (app) => {
	app.use(vuetify)
		.use(router)
		.use(store)
		
}
