import ArticlesService from '@/services/articles.service'
import { resolveErrorData } from '@/utils'

import {
   FETCH_ARTICLES, CREATE_ARTICLE, STORE_ARTICLE, 
   EDIT_ARTICLE, UPDATE_ARTICLE, OFF_ARTICLE, REMOVE_ARTICLE
} from '@/store/actions.type'

import { SET_ARTICLES, SET_LOADING } from '@/store/mutations.type'



const initialState = {
   pagedList: null
}

export const state = { ...initialState }
 
const getters = {
   
}


const actions = {
   [FETCH_ARTICLES](context, params) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ArticlesService.fetch(params)
            .then(model => {
               context.commit(SET_ARTICLES, model)
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
   [CREATE_ARTICLE](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ArticlesService.create()
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_ARTICLE](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ArticlesService.store(model)
         .then(article => resolve(article))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_ARTICLE](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ArticlesService.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_ARTICLE](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ArticlesService.update(model.id, model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [OFF_ARTICLE](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ArticlesService.off(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_ARTICLE](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ArticlesService.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   
   
}


const mutations = {
   [SET_ARTICLES](state, pagedList) {
      state.pagedList = pagedList
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 