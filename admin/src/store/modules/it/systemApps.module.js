import Service from '@/services/it/systemApps.service'
import { resolveErrorData, deepClone } from '@/utils'

import {
   INIT_IT_SYSTEM_APPS, FETCH_IT_SYSTEM_APPS, CREATE_IT_SYSTEM_APP, STORE_IT_SYSTEM_APP, 
   IT_SYSTEM_APP_DETAILS, EDIT_IT_SYSTEM_APP, UPDATE_IT_SYSTEM_APP, REMOVE_IT_SYSTEM_APP
} from '@/store/actions.type'

import { SET_IT_SYSTEM_APPS_INDEX_MODEL, SET_IT_SYSTEM_APPS, SET_IT_CREDENTIALINFO_LABLES, SET_LOADING } from '@/store/mutations.type'



const initialState = {
   query: {
   },
   servers: [],
   labels: {
   },
   options: {
   },
   pagedList: null
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [INIT_IT_SYSTEM_APPS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
            .then(model => {
               context.commit(SET_IT_SYSTEM_APPS_INDEX_MODEL, model)
               context.commit(SET_IT_CREDENTIALINFO_LABLES, model.credentialInfoLabels)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_IT_SYSTEM_APPS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
            .then(model => {
               context.commit(SET_IT_SYSTEM_APPS, model)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_IT_SYSTEM_APP](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.create()
         .then(model => {
            state.servers = model.servers
            resolve(model.form)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_IT_SYSTEM_APP](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [IT_SYSTEM_APP_DETAILS](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.details(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_IT_SYSTEM_APP](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_IT_SYSTEM_APP](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update(model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_IT_SYSTEM_APP](context, id) {
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
   [SET_IT_SYSTEM_APPS_INDEX_MODEL](state, model) {
      state.query = model.request
      state.labels = model.labels
      state.labels = model.labels
      state.options.centralized = model.centralizedOptions
      state.options.importance = model.importanceOptions
      state.options.type = model.typeOptions
   },
   [SET_IT_SYSTEM_APPS](state, pagedList) {
      state.pagedList = pagedList
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 