import SystemAppsService from '@/services/it/systemApps.service'
import { resolveErrorData, deepClone } from '@/utils'

import {
   FETCH_IT_SYSTEM_APPS, CREATE_IT_SYSTEM_APP, STORE_IT_SYSTEM_APP, 
   EDIT_IT_SYSTEM_APP, UPDATE_IT_SYSTEM_APP, REMOVE_IT_SYSTEM_APP
} from '@/store/actions.type'

import { SET_IT_SYSTEM_APPS, SET_LOADING } from '@/store/mutations.type'


const initialState = {
   query: {
      active: true,
      page: 1,
      pageSize: 10
   },
   labels: {
      title: '名稱',
      key: 'Key',
      provider: 'Provider',
   },
   pagedList: null
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_IT_SYSTEM_APPS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         SystemAppsService.fetch(query)
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
         SystemAppsService.create()
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_IT_SYSTEM_APP](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         SystemAppsService.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_IT_SYSTEM_APP](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         SystemAppsService.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_IT_SYSTEM_APP](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         SystemAppsService.update(model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_IT_SYSTEM_APP](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         SystemAppsService.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }   
}


const mutations = {
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
 