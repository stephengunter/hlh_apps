import Service from '@/services/roles.service'
import { resolveErrorData, deepClone } from '@/utils'

import { FETCH_ROLES } from '@/store/actions.type'
import { SET_ROLES, SET_LOADING } from '@/store/mutations.type'



const initialState = {
   list: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_ROLES](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch()
            .then(roles => {
               context.commit(SET_ROLES, roles)
               resolve(roles)
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   }
}


const mutations = {
   [SET_ROLES](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 