import { createStore } from 'vuex'

import app from './modules/app.module'
import auth from './modules/auth.module'
import attachments from './modules/attachments.module'
import docs from './modules/docs.module'
import references from './modules/references.module'
import items from './modules/items.module'
import calendars from './modules/calendars.module'
import events from './modules/events.module'
import tasks from './modules/tasks.module'
import modify_records from './modules/modify_records.module'

const store = createStore({
   modules: {
      app,
      auth,
      attachments,
      docs,
      references,
      items,
      calendars,
      events,
      tasks,
      modify_records
   }
})

export default store
