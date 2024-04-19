import JobUserProfilesService from '@/services/job_user_profiles.service'
import { resolveErrorData, deepClone } from '@/utils'

import {
   FETCH_JOB_USER_PROFILES_BY_JOB, FETCH_JOB_USER_PROFILES_BY_USER, CREATE_JOB_USER_PROFILES, STORE_JOB_USER_PROFILES, 
   EDIT_JOB_USER_PROFILES, UPDATE_JOB_USER_PROFILES, OFF_JOB_USER_PROFILES, REMOVE_JOB_USER_PROFILES
} from '@/store/actions.type'

import { SET_LOADING } from '@/store/mutations.type'



const initialState = {

}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_JOB_USER_PROFILES_BY_JOB](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobUserProfilesService.fetchByJob(id)
            .then(list => resolve(list))
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_JOB_USER_PROFILES_BY_USER](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobUserProfilesService.fetchByUser(id)
         .then(list => resolve(list))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_JOB_USER_PROFILES](context, jobId) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobUserProfilesService.create(jobId)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_JOB_USER_PROFILES](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobUserProfilesService.store(model)
         .then(jobuserprofiles => resolve(jobuserprofiles))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_JOB_USER_PROFILES](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobUserProfilesService.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_JOB_USER_PROFILES](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobUserProfilesService.update(model.id, model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [OFF_JOB_USER_PROFILES](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobUserProfilesService.off(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_JOB_USER_PROFILES](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JobUserProfilesService.remove(id)
         .then(() => resolve())
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
 