import { createStore } from 'vuex'

import app from './modules/app.module'
import auth from './modules/auth.module'
import modify_records from './modules/modify_records.module'
import calendars from './modules/calendars.module'

const store = createStore({
   modules: {
      app,
      auth,
      modify_records,
      calendars
   }
})

export default store
