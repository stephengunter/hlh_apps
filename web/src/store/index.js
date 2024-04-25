import { createStore } from 'vuex'

import app from './modules/app.module'
import auth from './modules/auth.module'
import files_judgebooks from './modules/files/judgebooks.module'

const store = createStore({
   modules: {
      app,
      auth,
      files_judgebooks
   }
})

export default store
