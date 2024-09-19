import Service from '@/services/keyins/passes.service'
import { resolveErrorData, deepClone } from '@/utils'
import {
   FETCH_KEYINS_PASSES, UPLOAD_KEYINS_PASSES, STORE_KEYINS_PASSES, EXPORT_KEYINS_PASSES_REPORT 
} from '@/store/actions.type'

import { SET_LOADING } from '@/store/mutations.type'



const initialState = {
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_KEYINS_PASSES](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch()
            .then(list => {
               resolve(list)
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPLOAD_KEYINS_PASSES](context, model) {
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
   [STORE_KEYINS_PASSES](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EXPORT_KEYINS_PASSES_REPORT](context, model) {
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
   
   
}

export default {
   state,
   actions,
   mutations,
   getters
}
 