import Errors from '@/common/errors'
import Service from '@/services/items.service'
import { INIT_ITEMS, FETCH_ITEMS, CREATE_ITEM, STORE_ITEM, EDIT_ITEM, UPDATE_ITEM, 
   REMOVE_ITEM
} from '@/store/actions.type'
import { SET_LOADING, SET_ITEMS_ADMIN_MODEL, SET_ITEMS_INDEX_MODEL, SET_ITEMS_LIST } from '@/store/mutations.type'
import { deepClone } from '@/utils'
import { ROUTE_NAMES } from '@/consts'

const initialState = {
   query: {
   },
   labels: {
   },
   transactionLabels: {
   },
   item_options: [],
   lastReport: null,
   list: []
}

const state = deepClone(initialState)


const getters = {
   
}

const actions = {
   [INIT_ITEMS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
            .then(model => {
               context.commit(SET_ITEMS_ADMIN_MODEL, model)               
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_ITEMS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
         .then(model => {
            context.commit(SET_ITEMS_INDEX_MODEL, model)
            resolve()
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_ITEM](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.create()
         .then(model => {
            resolve(model)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_ITEM](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_ITEM](context, id) {
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
   [UPDATE_ITEM](context, { id, model }) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update({ id, model })
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_ITEM](context, id) {
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
   [SET_ITEMS_ADMIN_MODEL](state, model) {
      state.query = model.request
      state.labels = model.labels
      state.transactionLabels = model.transactionLabels
      state.item_options = model.itemOptions
   },
   [SET_ITEMS_INDEX_MODEL](state, model) {
      state.list = model.items
      state.lastReport = model.lastReport
   },
   [SET_ITEMS_LIST](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 