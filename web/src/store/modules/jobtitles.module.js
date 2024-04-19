import JobtitlesService from '@/services/jobtitles.service'
import { resolveErrorData, deepClone } from '@/utils'

import {
   FETCH_JOBTITLES, CREATE_JOBTITLE, STORE_JOBTITLE, 
   EDIT_JOBTITLE, UPDATE_JOBTITLE, REMOVE_JOBTITLE
} from '@/store/actions.type'

import { SET_JOBTITLES, SET_LOADING } from '@/store/mutations.type'



const initialState = {
   list: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_JOBTITLES](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobtitlesService.fetch()
            .then(list => {
               context.commit(SET_JOBTITLES, list)
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
   [CREATE_JOBTITLE](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobtitlesService.create()
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_JOBTITLE](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobtitlesService.store(model)
         .then(jobtitle => resolve(jobtitle))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_JOBTITLE](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobtitlesService.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_JOBTITLE](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobtitlesService.update(model.id, model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_JOBTITLE](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobtitlesService.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   
   
}


const mutations = {
   [SET_JOBTITLES](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 