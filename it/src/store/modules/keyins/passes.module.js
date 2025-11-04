import Service from '@/services/keyins/passes.service'
import { resolveErrorData, deepClone } from '@/utils'
import {
   FETCH_KEYINS_PASSES, REMOVE_KEYINS_PASSES, CREATE_KEYINS_PASSES, STORE_KEYINS_PASSES, 
   EDIT_KEYINS_PASSES, UPDATE_KEYINS_PASSES, EXPORT_KEYINS_PASSES_REPORT 
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
         Service.fetch(query)
            .then(list => {
               resolve(list)
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_KEYINS_PASSES](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.create()
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_KEYINS_PASSES](context, model) {
      console.log(STORE_KEYINS_PASSES, model)
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_KEYINS_PASSES](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_KEYINS_PASSES](context, { id, model }) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update({ id, model })
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_KEYINS_PASSES](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.remove(id)
         .then(() => resolve())
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
 