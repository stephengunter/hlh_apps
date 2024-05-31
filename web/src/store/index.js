import { createStore } from 'vuex'

import app from './modules/app.module'
import auth from './modules/auth.module'
import modify_records from './modules/modify_records.module'
import events from './modules/events.module'

const store = createStore({
   modules: {
      app,
      auth,
      modify_records,
      events
   }
})

export default store
