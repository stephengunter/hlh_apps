import UsersService from '@/services/users.service'
import { resolveErrorData, deepClone } from '@/utils'

import { FETCH_USERS, CREATE_USER, STORE_USER, FETCH_ROLES, IMPORT_USERS, USER_DETAILS, EDIT_USER,
   UPDATE_USER, ADD_USER_PASSWORD } from '@/store/actions.type'
import { SET_USERS, SET_ROLES, SET_LOADING } from '@/store/mutations.type'
import { ROLES } from '@/consts'



const initialState = {
   pagedList: null,
   roles: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_USERS](context, params) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         UsersService.fetch(params)
            .then(model => {
               context.commit(SET_USERS, model.pagedList)
               context.commit(SET_ROLES, model.roles)
               resolve(model)
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_USER](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         UsersService.create()
            .then(model => resolve(model))
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_USER](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         UsersService.store(model)
            .then(user => resolve(user))
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_ROLES](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         UsersService.roles()
            .then(roles => {
               context.commit(SET_ROLES, roles)
               resolve(roles)
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [IMPORT_USERS](context, files) {
      context.commit(SET_LOADING, true)
      let form = new FormData()
      for (let i = 0; i < files.length; i++) {
         form.append('files', files[i]);
      }
      return new Promise((resolve, reject) => {
         UsersService.importing(form)
            .then(data => {
               console.log(data)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [USER_DETAILS](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         UsersService.details(id)
            .then(user => resolve(user))
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_USER](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         UsersService.edit(id)
            .then(user => resolve(user))
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_USER](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         UsersService.update(model)
            .then(() => resolve())
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [ADD_USER_PASSWORD](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         UsersService.addPassword(model)
         .then(() => resolve(true))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}


const mutations = {
   [SET_USERS](state, model) {
      state.pagedList = model
   },
   [SET_ROLES](state, roles) {
      state.roles = roles
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 