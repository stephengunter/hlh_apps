import Service from '@/services/fetches/systems.service'
import { resolveErrorData, deepClone } from '@/utils'
import {
   STORE_FETCHES_SYSTEM, EDIT_FETCHES_SYSTEM, UPDATE_FETCHES_SYSTEM
} from '@/store/actions.type'

import { SET_FETCHES_SYSTEMS, SET_FETCHES_SYSTEMS_DEPARTMENTS, SET_LOADING } from '@/store/mutations.type'


const initialState = {
   list: [],
   departments: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [STORE_FETCHES_SYSTEM](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(list => {
            context.commit(SET_FETCHES_SYSTEMS, list)
            resolve(list)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_FETCHES_SYSTEM](context, id) {
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
   [UPDATE_FETCHES_SYSTEM](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update(model.id, model)
         .then(list => {
            context.commit(SET_FETCHES_SYSTEMS, list)
            resolve(list)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}


const mutations = {
   [SET_FETCHES_SYSTEMS](state, list) {
      state.list = list
   },
   [SET_FETCHES_SYSTEMS_DEPARTMENTS](state, departments) {
      state.departments = departments
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 