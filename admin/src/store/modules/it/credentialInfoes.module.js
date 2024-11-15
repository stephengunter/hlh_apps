import Service from '@/services/it/credentialInfoes.service'
import { resolveErrorData, deepClone } from '@/utils'

import {
   INIT_IT_CREDENTIALINFOS, FETCH_IT_CREDENTIALINFOS, CREATE_IT_CREDENTIALINFO, STORE_IT_CREDENTIALINFO, 
   IT_CREDENTIALINFO_DETAILS, EDIT_IT_CREDENTIALINFO, UPDATE_IT_CREDENTIALINFO, REMOVE_IT_CREDENTIALINFO
} from '@/store/actions.type'

import { SET_IT_CREDENTIALINFO_LABLES, SET_LOADING } from '@/store/mutations.type'


const initialState = {
   query: {
   },
   labels: {
   },
   pagedList: null
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [INIT_IT_CREDENTIALINFOS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
            .then(model => {
               //context.commit(SET_IT_CREDENTIALINFOS_INDEX_MODEL, model)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_IT_CREDENTIALINFOS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
            .then(model => {
               context.commit(SET_IT_CREDENTIALINFOS, model)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_IT_CREDENTIALINFO](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.create()
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_IT_CREDENTIALINFO](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [IT_CREDENTIALINFO_DETAILS](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.details(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_IT_CREDENTIALINFO](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_IT_CREDENTIALINFO](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update(model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_IT_CREDENTIALINFO](context, id) {
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
   [SET_IT_CREDENTIALINFO_LABLES](state, labels) {
      state.labels = labels
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 