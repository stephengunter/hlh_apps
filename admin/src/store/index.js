import { createStore } from 'vuex'

import app from './modules/app.module'
import auth from './modules/auth.module'
import articles from './modules/articles.module'
import jobs from './modules/jobs.module'
import departments from './modules/departments.module'
import users from './modules/users.module'
import profiles from './modules/profiles.module'
import passwords from './modules/passwords.module'

const store = createStore({
   modules: {
      app,
      auth,
      articles,

      departments,
      jobs,
      users,
      profiles,
      passwords
   }
})

export default store
