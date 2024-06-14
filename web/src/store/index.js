import { createStore } from 'vuex'

import app from './modules/app.module'
import auth from './modules/auth.module'
import attachments from './modules/attachments.module'
import calendars from './modules/calendars.module'
import events from './modules/events.module'
import modify_records from './modules/modify_records.module'

const store = createStore({
   modules: {
      app,
      auth,
      attachments,
      calendars,
      events,
      modify_records
   }
})

export default store
