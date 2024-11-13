import Service from '@/services/criminals/records.service'
import { resolveErrorData, deepClone } from '@/utils'
import {
   INIT_CRIMINALS_RECORDS, FETCH_CRIMINALS_RECORDS, UPLOAD_CRIMINALS_RECORDS,
   STORE_CRIMINALS_RECORDS, EXPORT_CRIMINALS_RECORDS_REPORT
} from '@/store/actions.type'

import { SET_CRIMINAL_RECORDS_INDEX_MODEL, SET_CRIMINAL_RECORDS, SET_LOADING } from '@/store/mutations.type'



const initialState = {
   query: {
   },
   pagedList: null,
   years: [],
   month: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [INIT_CRIMINALS_RECORDS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
            .then(model => {
               context.commit(SET_CRIMINAL_RECORDS_INDEX_MODEL, model)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_CRIMINALS_RECORDS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
            .then(model => {
               context.commit(SET_CRIMINAL_RECORDS, model)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPLOAD_CRIMINALS_RECORDS](context, model) {
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
         Service.upload(formData)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_CRIMINALS_RECORDS](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EXPORT_CRIMINALS_RECORDS_REPORT](context, model) {
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
   [SET_CRIMINAL_RECORDS_INDEX_MODEL](state, model) {
      state.query = model.request
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
   [SET_CRIMINAL_RECORDS](state, model) {
      state.pagedList = model
   }
   
}

export default {
   state,
   actions,
   mutations,
   getters
}
 