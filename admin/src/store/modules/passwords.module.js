import PasswordsService from '@/services/passwords.service'

import { SET_PASSWORD, CHANGE_PASSWORD } from '@/store/actions.type'
import { SET_LOADING } from '@/store/mutations.type'
import { deepClone } from '@/utils'

const initialState = {
   
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [SET_PASSWORD](context, form) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         PasswordsService.store(form)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CHANGE_PASSWORD](context, form) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         PasswordsService.update(form.userId, form)
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
 