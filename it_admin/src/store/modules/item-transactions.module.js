import Errors from '@/common/errors'
import Service from '@/services/item-transactions.service'
import { INIT_ITEM_TRANSACTIONS, FETCH_ITEM_TRANSACTIONS, CREATE_ITEM_TRANSACTION, STORE_ITEM_TRANSACTION, EDIT_ITEM_TRANSACTION, UPDATE_ITEM_TRANSACTION, 
   REMOVE_ITEM_TRANSACTION, ITEM_TRANSACTION_DETAILS
} from '@/store/actions.type'
import { SET_LOADING, SET_ITEM_TRANSACTIONS_INDEX_MODEL, SET_ITEM_TRANSACTIONS_LIST } from '@/store/mutations.type'
import { deepClone } from '@/utils'
import { ROUTE_NAMES } from '@/consts'

const initialState = {
   query: {
   },
   labels: {
   },
   balanceSheetLabels: {
   },
   item_options: [],
   year_options: [],
   month_options: [],
   list: []
}

const state = deepClone(initialState)


const getters = {
   
}

const actions = {
   [INIT_ITEM_TRANSACTIONS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
            .then(model => {
               context.commit(SET_ITEM_TRANSACTIONS_INDEX_MODEL, model)               
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_ITEM_TRANSACTIONS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
         .then(list => {
            context.commit(SET_ITEM_TRANSACTIONS_LIST, list)
            resolve()
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_ITEM_TRANSACTION](context, item) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.create({ item })
         .then(model => {
            resolve(model)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_ITEM_TRANSACTION](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_ITEM_TRANSACTION](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.edit(id)
         .then(model => {
            resolve(model)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_ITEM_TRANSACTION](context, { id, model }) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update({ id, model })
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_ITEM_TRANSACTION](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}

const mutations = {
   [SET_ITEM_TRANSACTIONS_INDEX_MODEL](state, model) {
      state.query = model.request
      state.labels = model.labels
      state.year_options = model.yearOptions
      state.item_options = model.itemOptions
      let month_options = []
      for(let i = 1; i <= 12; i++) {
         month_options.push({ value: i, title: `${i}月` })
      }
      state.month_options = month_options
   },
   [SET_ITEM_TRANSACTIONS_LIST](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 