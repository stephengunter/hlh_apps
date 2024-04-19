import { createStore } from 'vuex'

import app from './modules/app.module'
import auth from './modules/auth.module'

const store = createStore({
   modules: {
      app,
      auth
   }
})

export default store
