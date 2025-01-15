import Errors from '@/common/errors'
import Service from '@/services/apps.service'
import BaseService from '@/common/baseService'
import { FETCH_APPS } from '@/store/actions.type'
import { SET_LOADING } from '@/store/mutations.type'
import { deepClone } from '@/utils'
import { ROUTE_NAMES } from '@/consts'

const initialState = {
   items: []
}

const state = deepClone(initialState)


const getters = {
   
}

const actions = {
   [FETCH_APPS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch()
         .then(model => {
            resolve(model)
         })
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
 