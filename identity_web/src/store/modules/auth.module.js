import { UserManager } from 'oidc-client-ts'
import Errors from '@/common/errors'
import BaseService from '@/common/baseService'
import Service from '@/services/auth.service'
import { OIDC } from '@/config'
import { resolveUserFromClaims, isAdmin, isEmptyObject, deepClone } from '@/utils'

import { CHECK_AUTH, LOGIN, SIGN_IN_CALLBACK, LOGOUT, PASSWORD_LOGIN, REFRESH_TOKEN } from '@/store/actions.type'
import { PURGE_AUTH, SET_USER, SET_LOADING } from '@/store/mutations.type'

const userManager = new UserManager(OIDC)

const initialState = {
   user: {}
}

const state = deepClone(initialState)

const getters = {
   currentUser(state) {
     return state.user
   },
   isAuthenticated(state) {
     return !isEmptyObject(state.user)
   }
}
const defaultError = {
   status: 400,
   data: {'': ['身分驗證失敗, 請重新登入.']}
}

const actions = {
   [PASSWORD_LOGIN](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.login(model)
         .then(data => {
            console.log(data)
            resolve(true)
         })
         .catch(error => reject(error))
         .finally(() => { 
            context.commit(SET_LOADING, false)
         })
      })     
   },
   [LOGIN](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         userManager.signinRedirect()
         .then(() => resolve(true))
         .catch(error => reject(error))
         .finally(() => { 
            context.commit(SET_LOADING, false)
         })
      })     
   },
   [SIGN_IN_CALLBACK](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         userManager.signinRedirectCallback()
         .then(user => {
            console.log(user)
            resolve(true)
         })
         .catch(error => reject(error))
         .finally(() => { 
            context.commit(SET_LOADING, false)
         })
      })     
   },
   [LOGOUT](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         userManager.signoutRedirect()
         //userManager.removeUser()
         .then(() => {
            context.commit(PURGE_AUTH)
            resolve(true)
         })
         .catch(error => reject(error))
         .finally(() => { 
            context.commit(SET_LOADING, false)
         })
      })
   },
   [CHECK_AUTH](context) {
      return new Promise((resolve) => {
         userManager.getUser()
         .then(user => {
            if(user && !user.expired) {
               const accessToken = user.access_token
               BaseService.setHeader(accessToken)
               context.commit(SET_USER, resolveUserFromClaims(user.profile)) 
               resolve(true)
            }else {
               resolve(false)
            }
         }).catch(err => {
            console.error('Error checking authentication:', err);
            resolve(false)
         })
      })
   }  
}


const mutations = {
   [SET_USER](state, user) {
      state.user = user
   },
   [PURGE_AUTH](state) {
      state.isAuthenticated = false
      state.user = null
      BaseService.setHeader(null)
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 