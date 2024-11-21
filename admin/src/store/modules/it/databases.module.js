import Service from '@/services/it/databases.service'
import { resolveErrorData, deepClone } from '@/utils'

import {
   INIT_IT_DATABASES, FETCH_IT_DATABASES, CREATE_IT_DATABASE, STORE_IT_DATABASE, 
   EDIT_IT_DATABASE, UPDATE_IT_DATABASE, REMOVE_IT_DATABASE
} from '@/store/actions.type'

import { SET_IT_DATABASES_INDEX_MODEL, SET_IT_DATABASES, SET_LOADING } from '@/store/mutations.type'


const initialState = {
   query: {
   },
   servers: [],
   labels: {
   },
   list: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [INIT_IT_DATABASES](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
            .then(model => {
               context.commit(SET_IT_DATABASES_INDEX_MODEL, model)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_IT_DATABASES](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
            .then(model => {
               context.commit(SET_IT_DATABASES, model)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_IT_DATABASE](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.create()
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_IT_DATABASE](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_IT_DATABASE](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_IT_DATABASE](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update(model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_IT_DATABASE](context, id) {
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
   [SET_IT_DATABASES_INDEX_MODEL](state, model) {
      state.query = model.request
      state.labels = model.labels
      state.servers = model.servers
   },
   [SET_IT_DATABASES](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 