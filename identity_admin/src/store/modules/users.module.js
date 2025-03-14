import UsersService from '@/services/users.service'
import { resolveErrorData, deepClone } from '@/utils'

import { INIT_USERS, FETCH_USERS, CREATE_USER, STORE_USER, SYNC_USERS, UPDOWN_USERS, USER_DETAILS, EDIT_USER,
   UPDATE_USER, ADD_USER_PASSWORD } from '@/store/actions.type'
import { SET_USERS_INDEX_MODEL, SET_USERS, SET_ROLES, SET_DEPARTMENTS, SET_LOADING } from '@/store/mutations.type'
import { ROLES } from '@/consts'



const initialState = {
   query: {
   },
   labels: {
   },
   pagedList: null,
   rootDepartment: null,
   roles: [],
   departments: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [INIT_USERS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         UsersService.init()
            .then(model => {
               context.commit(SET_USERS_INDEX_MODEL, model)
               if(model.roles) context.commit(SET_ROLES, model.roles)              
               if(model.departments.length) {
                  context.commit(SET_DEPARTMENTS, model.departments)
               }
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_USERS](context, params) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         UsersService.fetch(params)
            .then(model => {
               context.commit(SET_USERS, model)
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
   [SYNC_USERS](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         UsersService.sync(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDOWN_USERS](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         UsersService.updown(model)
         .then(data => resolve(data))
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
   [SET_USERS_INDEX_MODEL](state, model) {
      state.query = model.request
      state.labels = model.labels
   },
   [SET_USERS](state, model) {
      state.pagedList = model
   },
   [SET_DEPARTMENTS](state, departments) {
      state.departments = departments
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 