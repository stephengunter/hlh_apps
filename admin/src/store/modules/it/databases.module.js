import DatabasesService from '@/services/it/databases.service'
import { resolveErrorData, deepClone } from '@/utils'

import {
   FETCH_IT_DATABASES, CREATE_IT_DATABASE, STORE_IT_DATABASE, 
   EDIT_IT_DATABASE, UPDATE_IT_DATABASE, REMOVE_IT_DATABASE
} from '@/store/actions.type'

import { SET_IT_DATABASES, SET_LOADING } from '@/store/mutations.type'


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
   [FETCH_IT_DATABASES](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DatabasesService.fetch(query)
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
         DatabasesService.create()
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_IT_DATABASE](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DatabasesService.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_IT_DATABASE](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DatabasesService.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_IT_DATABASE](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DatabasesService.update(model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_IT_DATABASE](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DatabasesService.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }   
}


const mutations = {
   [SET_IT_DATABASES](state, pagedList) {
      state.pagedList = pagedList
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 