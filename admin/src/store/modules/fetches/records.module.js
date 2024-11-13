import Service from '@/services/fetches/records.service'
import { resolveErrorData, deepClone } from '@/utils'
import {
   INIT_FETCHES_RECORDS, FETCH_FETCHES_RECORDS, UPLOAD_FETCHES_RECORDS, TEMPLATE_FETCHES_RECORDS,
   STORE_FETCHES_RECORDS, EXPORT_FETCHES_RECORDS_REPORT, DOWNLOAD_FETCHES_RECORDS
} from '@/store/actions.type'

import { SET_FETCHES_RECORDS_INDEX_MODEL, SET_FETCHES_RECORDS, SET_FETCHES_SYSTEMS, 
   SET_FETCHES_SYSTEMS_DEPARTMENTS, SET_LOADING 
} from '@/store/mutations.type'



const initialState = {
   query: {
   },
   list: [],
   years: [],
   month: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [INIT_FETCHES_RECORDS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
            .then(model => {
               context.commit(SET_FETCHES_RECORDS_INDEX_MODEL, model)
               context.commit(SET_FETCHES_SYSTEMS, model.systems)
               context.commit(SET_FETCHES_SYSTEMS_DEPARTMENTS, model.systemDepartments)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_FETCHES_RECORDS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
            .then(data => {
               if(query.system) {
                  context.commit(SET_FETCHES_RECORDS, data)
                  resolve()
               }else {
                  resolve(data)
               }
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPLOAD_FETCHES_RECORDS](context, model) {
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
   [STORE_FETCHES_RECORDS](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [DOWNLOAD_FETCHES_RECORDS](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.download(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [TEMPLATE_FETCHES_RECORDS](context, key) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.template(key)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EXPORT_FETCHES_RECORDS_REPORT](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.reports(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_FETCHES_RECORDS](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_FETCHES_RECORDS](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
}


const mutations = {
   [SET_FETCHES_RECORDS_INDEX_MODEL](state, model) {
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
   [SET_FETCHES_RECORDS](state, list) {
      state.list = list
   }
   
}

export default {
   state,
   actions,
   mutations,
   getters
}
 