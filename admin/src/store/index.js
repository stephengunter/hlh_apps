import { createStore } from 'vuex'

import app from './modules/app.module'
import auth from './modules/auth.module'
import articles from './modules/articles.module'
import attachments from './modules/attachments.module'
import cryptoes from './modules/cryptoes.module'

import locations from './modules/locations.module'
import jobUserProfiles from './modules/job_user_profiles.module'
import jobs from './modules/jobs.module'
import departments from './modules/departments.module'
import tags from './modules/tags.module'
import users from './modules/users.module'
import roles from './modules/roles.module'
import profiles from './modules/profiles.module'
import passwords from './modules/passwords.module'

import keyins_persons from './modules/keyins/persons.module'
import keyins_branches from './modules/keyins/branches.module'
import keyins_passes from './modules/keyins/passes.module'

import criminals_records from './modules/criminals/records.module'
import fetches_records from './modules/fetches/records.module'
import fetches_systems from './modules/fetches/systems.module'

import it_hosts from './modules/it/hosts.module'
import it_servers from './modules/it/servers.module'
import it_credentialInfoes from './modules/it/credentialInfoes.module'
import it_databases from './modules/it/databases.module'
import it_dbBackupPlans from './modules/it/dbBackupPlans.module'
import it_systemApps from './modules/it/systemApps.module'

const store = createStore({
   modules: {
      app,
      auth,
      articles,
      attachments,
      cryptoes,
      locations,
      departments,
      jobs,
      jobUserProfiles,
      tags,
      users,
      roles,
      profiles,
      passwords,
      keyins_persons,
      keyins_branches,
      keyins_passes,
      criminals_records,
      fetches_records,
      fetches_systems,
      it_hosts,
      it_servers,
      it_credentialInfoes,
      it_databases,
      it_dbBackupPlans,
      it_systemApps
   }
})

export default store
