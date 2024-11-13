import { createStore } from 'vuex'

import app from './modules/app.module'
import auth from './modules/auth.module'
import users from './modules/users.module'

const store = createStore({
   modules: {
      app,
      auth,
      users
   }
})

export default store
