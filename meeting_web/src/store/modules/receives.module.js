import Errors from '@/common/errors'
import Service from '@/services/receives.service'
import BaseService from '@/common/baseService'
import { INIT_RECEIVES, FETCH_RECEIVES, RECEIVE_DETAILS } from '@/store/actions.type'
import { SET_LOADING } from '@/store/mutations.type'
import { deepClone } from '@/utils'
import { ROUTE_NAMES } from '@/consts'

const initialState = {
   pagedList: null
}

const state = deepClone(initialState)


const getters = {
   
}

const actions = {
   [INIT_RECEIVES](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
         .then(model => {
            resolve(model)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_RECEIVES](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch()
         .then(model => {
            resolve(model)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [RECEIVE_DETAILS](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         UsersService.details(id)
            .then(user => resolve(user))
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
}

const mutations = {
   
}

export default {
   state,
   actions,
   mutations,
   getters
}
 