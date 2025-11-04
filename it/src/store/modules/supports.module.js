import Service from '@/services/supports.service'
import { resolveErrorData, deepClone } from '@/utils'
import {
   INIT_SUPPORTS, FETCH_SUPPORTS, EXPORT_SUPPORTS_SUMMARY_REPORT, EXPORT_SUPPORTS_REPORT
} from '@/store/actions.type'

import { SET_SUPPORTS_INDEX_MODEL, SET_SUPPORTS, SET_LOADING } from '@/store/mutations.type'



const initialState = {
   query: {
   },
   labels: {
   },
   list: [],
   years: [],
   month: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [INIT_SUPPORTS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
            .then(model => {
               context.commit(SET_SUPPORTS_INDEX_MODEL, model)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_SUPPORTS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
            .then(list => {
               context.commit(SET_SUPPORTS, list)
               resolve(list)
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EXPORT_SUPPORTS_SUMMARY_REPORT](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.summary_report(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EXPORT_SUPPORTS_REPORT](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.reports(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}


const mutations = {
   [SET_SUPPORTS_INDEX_MODEL](state, model) {
      state.query = model.request
      state.labels = model.labels
      const year = model.request.year
      const month = model.request.month
      let years = model.years.slice(0)
      if(month === 12) years.push(year + 1)
      state.years = years
      let month_list = []
      for(let i = 1; i <= 12; i++) {
         month_list.push(i)
      }
      state.month = month_list
   },
   [SET_SUPPORTS](state, list) {
      state.list = list
   }
   
}

export default {
   state,
   actions,
   mutations,
   getters
}
 