import { createStore } from 'vuex'

import app from './modules/app.module'
import auth from './modules/auth.module'
import users from './modules/users.module'
import departments from './modules/departments.module'
import cryptoes from './modules/cryptoes.module'
import items from './modules/items.module'
import item_reports from './modules/item-reports.module'
import item_transactions from './modules/item-transactions.module'


const store = createStore({
   modules: {
      app,
      auth,
      users,
      departments,
      cryptoes,
      items,
      item_reports,
      item_transactions
   }
})

export default store
