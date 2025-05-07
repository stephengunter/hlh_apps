import Errors from '@/common/errors'
import Service from '@/services/item-reports.service'
import { INIT_ITEM_REPORTS, FETCH_ITEM_REPORTS, CREATE_ITEM_REPORT, STORE_ITEM_REPORT, EDIT_ITEM_REPORT, UPDATE_ITEM_REPORT, 
   REMOVE_ITEM_REPORT, ITEM_REPORT_DETAILS
} from '@/store/actions.type'
import { SET_LOADING, SET_ITEM_REPORTS_INDEX_MODEL, SET_ITEM_REPORTS_LIST } from '@/store/mutations.type'
import { deepClone } from '@/utils'
import { ROUTE_NAMES } from '@/consts'

const initialState = {
   query: {
   },
   labels: {
   },
   balanceSheetLabels: {
   },
   year_options: [],
   list: []
}

const state = deepClone(initialState)


const getters = {
   
}

const actions = {
   [INIT_ITEM_REPORTS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
            .then(model => {
               context.commit(SET_ITEM_REPORTS_INDEX_MODEL, model)               
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_ITEM_REPORTS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
         .then(list => {
            context.commit(SET_ITEM_REPORTS_LIST, list)
            resolve()
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_ITEM_REPORT](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.create()
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_ITEM_REPORT](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [ITEM_REPORT_DETAILS](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.details(id)
         .then(model => {
            resolve(model)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_ITEM_REPORT](context, { id, model }) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update({ id, model })
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_ITEM_REPORT](context, id) {
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
   [SET_ITEM_REPORTS_INDEX_MODEL](state, model) {
      state.query = model.request
      state.labels = model.labels
      state.balanceSheetLabels = model.balanceSheetLabels
      state.year_options = model.yearOptions
   },
   [SET_ITEM_REPORTS_LIST](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 