import { createStore } from 'vuex'

import app from './modules/app.module'
import apps from './modules/apps.module'
import auth from './modules/auth.module'

const store = createStore({
   modules: {
      app,
      apps,
      auth
   }
})

export default store
