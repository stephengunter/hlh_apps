import KeyinsBrancheService from '@/services/keyins/bracnches.service'
import { resolveErrorData, deepClone } from '@/utils'
import {
   INIT_KEYINS_BRANCHES, FETCH_KEYINS_BRANCHES, UPLOAD_KEYINS_BRANCHES, STORE_KEYINS_BRANCHES,
   EXPORT_KEYINS_BRANCHES_REPORT
} from '@/store/actions.type'

import { SET_KEYINS_BRANCHES_INDEX_MODEL, SET_KEYINS_BRANCHES, SET_LOADING } from '@/store/mutations.type'



const initialState = {
   query: {
   },
   labels: {
   },
   branches: [],
   list: [],
   years: [],
   month: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [INIT_KEYINS_BRANCHES](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         KeyinsBrancheService.init()
            .then(model => {
               context.commit(SET_KEYINS_BRANCHES_INDEX_MODEL, model)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_KEYINS_BRANCHES](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         KeyinsBrancheService.fetch(query)
            .then(list => {
               context.commit(SET_KEYINS_BRANCHES, list)
               resolve(list)
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPLOAD_KEYINS_BRANCHES](context, model) {
      const formData = new FormData()
      for (const key in model) {
         if (key === 'file' && model[key]) {
            formData.append(key, model[key], model[key].name);
         } else if (item[key] != null) {
            formData.append(key, model[key])
         }
      }

      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         KeyinsBrancheService.upload(formData)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_KEYINS_BRANCHES](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         KeyinsBrancheService.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EXPORT_KEYINS_BRANCHES_REPORT](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         KeyinsBrancheService.reports(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}


const mutations = {
   [SET_KEYINS_BRANCHES_INDEX_MODEL](state, model) {
      state.query = model.request
      state.labels = model.labels
      state.branches = model.branches
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
   [SET_KEYINS_BRANCHES](state, list) {
      state.list = list
   }
   
}

export default {
   state,
   actions,
   mutations,
   getters
}
 