import DepartmentsService from '@/services/departments.service'
import { resolveErrorData } from '@/utils'

import {
   FETCH_DEPARTMENTS, CREATE_DEPARTMENT, STORE_DEPARTMENT, 
   EDIT_DEPARTMENT, UPDATE_DEPARTMENT, OFF_DEPARTMENT, REMOVE_DEPARTMENT
} from '@/store/actions.type'

import { SET_DEPARTMENTS, SET_LOADING } from '@/store/mutations.type'



const initialState = {
   list: []
}

export const state = { ...initialState }
 
const getters = {
   
}


const actions = {
   [FETCH_DEPARTMENTS](context, params) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DepartmentsService.fetch(params)
            .then(list => {
               context.commit(SET_DEPARTMENTS, list)
               resolve()
            })
            .catch(error => {
               reject(error)
            })
            .finally(() => { 
               context.commit(SET_LOADING, false)
            })
      })
   },
   [CREATE_DEPARTMENT](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DepartmentsService.create()
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_DEPARTMENT](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DepartmentsService.store(model)
         .then(department => resolve(department))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_DEPARTMENT](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DepartmentsService.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_DEPARTMENT](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DepartmentsService.update(model.id, model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [OFF_DEPARTMENT](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DepartmentsService.off(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_DEPARTMENT](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DepartmentsService.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   
   
}


const mutations = {
   [SET_DEPARTMENTS](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 