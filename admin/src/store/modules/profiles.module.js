import ProfilesService from '@/services/profiles.service'

import { GET_PROFILES, UPDATE_PROFILES } from '@/store/actions.type'
import { SET_LOADING } from '@/store/mutations.type'
import { deepClone } from '@/utils'

const initialState = {
   
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [GET_PROFILES](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ProfilesService.get(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_PROFILES](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ProfilesService.update(model.id, model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}


const mutations = {
   
}

export default {
   state,
   actions,
   mutations,
   getters
}
 