import { createStore } from 'vuex'

import app from './modules/app.module'
import auth from './modules/auth.module'

import keyins_persons from './modules/keyins/persons.module'
import keyins_branches from './modules/keyins/branches.module'
import keyins_passes from './modules/keyins/passes.module'
import fixes from './modules/fixes.module'
import supports from './modules/supports.module'

const store = createStore({
   modules: {
      app,
      auth,
      keyins_persons,
      keyins_branches,
      keyins_passes,
      fixes,
      supports
   }
})

export default store
