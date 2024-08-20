import TagService from '@/services/tags.service'
import { resolveErrorData, deepClone } from '@/utils'

import {
   FETCH_TAGS, CREATE_TAG, STORE_TAG, TAG_DETAILS,
   EDIT_TAG, UPDATE_TAG, REMOVE_TAG
} from '@/store/actions.type'

import { SET_TAGS, SET_LOADING } from '@/store/mutations.type'


const initialState = {
   list: []
}

const state = deepClone(initialState)
 
const getters = {
   tags(state) {
      return state.list
   },
}


const actions = {
   [FETCH_TAGS](context, params) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         TagService.fetch(params)
            .then(list => {
               context.commit(SET_TAGS, list)
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
   [CREATE_TAG](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         TagService.create()
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_TAG](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         TagService.store(model)
         .then(TAG => resolve(TAG))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [TAG_DETAILS](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         TagService.details(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_TAG](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         TagService.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_TAG](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         TagService.update(model.id, model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_TAG](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         TagService.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   
   
}


const mutations = {
   [SET_TAGS](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 