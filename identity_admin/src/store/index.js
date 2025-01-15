import { createStore } from 'vuex'

import app from './modules/app.module'
import apps from './modules/apps.module'
import auth from './modules/auth.module'
import cryptoes from './modules/cryptoes.module'
import departments from './modules/departments.module'
import jobs from './modules/jobs.module'
import jobUserProfiles from './modules/job_user_profiles.module'
import locations from './modules/locations.module'
import passwords from './modules/passwords.module'
import profiles from './modules/profiles.module'
import roles from './modules/roles.module'
import users from './modules/users.module'


const store = createStore({
   modules: {
      app,
      apps,
      auth,
      cryptoes,
      departments,
      jobs,
      jobUserProfiles,
      locations,
      passwords,
      profiles,
      roles,
      users
   }
})

export default store
