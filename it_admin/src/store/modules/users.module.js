import Errors from '@/common/errors'
import Service from '@/services/users.service'
import { FETCH_USERS } from '@/store/actions.type'
import { SET_LOADING, SET_USERS } from '@/store/mutations.type'
import { deepClone } from '@/utils'
import { ROUTE_NAMES } from '@/consts'

const initialState = {
   list: []
}

const state = deepClone(initialState)


const getters = {
   users(state) {
      return state.list
   }
}

const actions = {
   [FETCH_USERS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch()
         .then(list => {
            context.commit(SET_USERS, list)
            resolve()
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}

const mutations = {
   [SET_USERS](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 