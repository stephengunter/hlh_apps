import { createStore } from 'vuex'

import app from './modules/app.module'
import auth from './modules/auth.module'
import articles from './modules/articles.module'
import locations from './modules/locations.module'
import jobUserProfiles from './modules/job_user_profiles.module'
import jobs from './modules/jobs.module'
import departments from './modules/departments.module'
import tags from './modules/tags.module'
import users from './modules/users.module'
import profiles from './modules/profiles.module'
import passwords from './modules/passwords.module'
import keyins_persons from './modules/keyins/persons.module'
import keyins_branches from './modules/keyins/branches.module'
import keyins_passes from './modules/keyins/passes.module'

import it_databases from './modules/it/databases.module'
import it_systemApps from './modules/it/systemApps.module'

const store = createStore({
   modules: {
      app,
      auth,
      articles,
      
      locations,
      departments,
      jobs,
      jobUserProfiles,
      tags,
      users,
      profiles,
      passwords,
      keyins_persons,
      keyins_branches,
      keyins_passes,
      it_databases,
      it_systemApps
   }
})

export default store
