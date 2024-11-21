import Service from '@/services/cryptoes.service'
import { resolveErrorData, deepClone } from '@/utils'

import { GET_CRYPTO } from '@/store/actions.type'
import { SET_LOADING } from '@/store/mutations.type'

const initialState = {
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [GET_CRYPTO](context, { type, id }) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.get({ type, id })
         .then(model => {
            resolve(model)
         })
         .catch(error => {
            reject(error) 
         })
         .finally(() => { 
            context.commit(SET_LOADING, false)
         })
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
 