import JobsService from '@/services/jobs.service'
import { resolveErrorData, deepClone } from '@/utils'

import {
   FETCH_JOBS, CREATE_JOB, STORE_JOB, JOB_DETAILS,
   EDIT_JOB, UPDATE_JOB, OFF_JOB, REMOVE_JOB
} from '@/store/actions.type'

import { SET_JOBS, SET_LOADING } from '@/store/mutations.type'


const initialState = {
   list: null,
   role_options: [{
      value: 0, text: '一般'
   },{
      value: 1, text: '副主管'
   },{
      value: 2, text: '主管'
   }]
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_JOBS](context, params) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobsService.fetch(params)
            .then(list => {
               context.commit(SET_JOBS, list)
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
   [CREATE_JOB](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobsService.create()
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_JOB](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobsService.store(model)
         .then(job => resolve(job))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [JOB_DETAILS](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobsService.details(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_JOB](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobsService.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_JOB](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobsService.update(model.id, model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [OFF_JOB](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobsService.off(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_JOB](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobsService.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   
   
}


const mutations = {
   [SET_JOBS](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 