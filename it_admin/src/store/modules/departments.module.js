import Errors from '@/common/errors'
import Service from '@/services/departments.service'
import { FETCH_DEPARTMENTS } from '@/store/actions.type'
import { SET_LOADING, SET_DEPARTMENTS } from '@/store/mutations.type'
import { deepClone } from '@/utils'
import { ROUTE_NAMES } from '@/consts'

const initialState = {
   list: []
}

const state = deepClone(initialState)


const getters = {
   departments(state) {
      return state.list
   }
}

const actions = {
   [FETCH_DEPARTMENTS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch()
         .then(list => {
            context.commit(SET_DEPARTMENTS, list)
            resolve()
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}

const mutations = {
   [SET_DEPARTMENTS](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 