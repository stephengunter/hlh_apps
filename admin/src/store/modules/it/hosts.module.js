import Service from '@/services/it/hosts.service'
import { resolveErrorData, deepClone } from '@/utils'

import {
   INIT_IT_HOSTS, FETCH_IT_HOSTS, CREATE_IT_HOST, STORE_IT_HOST, 
   IT_HOST_DETAILS, EDIT_IT_HOST, UPDATE_IT_HOST, REMOVE_IT_HOST
} from '@/store/actions.type'

import { SET_IT_HOSTS_INDEX_MODEL, SET_IT_HOSTS, SET_IT_CREDENTIALINFO_LABLES, SET_LOADING } from '@/store/mutations.type'


const initialState = {
   query: {
   },
   providers: [],
   labels: {
   },
   pagedList: null
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [INIT_IT_HOSTS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
            .then(model => {
               context.commit(SET_IT_HOSTS_INDEX_MODEL, model)
               context.commit(SET_IT_CREDENTIALINFO_LABLES, model.credentialInfoLabels)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_IT_HOSTS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
            .then(model => {
               context.commit(SET_IT_HOSTS, model)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_IT_HOST](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.create()
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_IT_HOST](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [IT_HOST_DETAILS](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.details(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_IT_HOST](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_IT_HOST](context, { id, model }) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update({ id, model })
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_IT_HOST](context, id) {
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
   [SET_IT_HOSTS_INDEX_MODEL](state, model) {
      state.query = model.request
      state.labels = model.labels
      state.providers = model.providers
      console.log('state.query', state.query)
   },
   [SET_IT_HOSTS](state, pagedList) {
      state.pagedList = pagedList
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 