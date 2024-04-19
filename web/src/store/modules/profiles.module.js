import ProfilesService from '@/services/profiles.service'

import { GET_PROFILES, CREATE_PROFILES, STORE_PROFILES, 
   EDIT_PROFILES, UPDATE_PROFILES, DELETE_PROFILES, FETCH_ALL_PROFILES 
} from '@/store/actions.type'
import { SET_LOADING, SET_ALL_PROFILES } from '@/store/mutations.type'
import { deepClone } from '@/utils'

const initialState = {
   all: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_ALL_PROFILES](context, params) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ProfilesService.fetch(params)
         .then(list => {
            context.commit(SET_ALL_PROFILES, list)
            resolve()
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [GET_PROFILES](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ProfilesService.get(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_PROFILES](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ProfilesService.create(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_PROFILES](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ProfilesService.store(model)
         .then(profiles => resolve(profiles))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_PROFILES](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ProfilesService.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_PROFILES](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ProfilesService.update(model.userId, model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [DELETE_PROFILES](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ProfilesService.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}


const mutations = {
   [SET_ALL_PROFILES](state, list) {
      state.all = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 