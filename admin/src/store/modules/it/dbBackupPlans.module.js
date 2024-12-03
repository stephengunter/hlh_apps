import Service from '@/services/it/dbBackupPlans.service'
import { resolveErrorData, deepClone } from '@/utils'

import {
   INIT_IT_DBBACKUPPLANS, FETCH_IT_DBBACKUPPLANS, CREATE_IT_DBBACKUPPLAN, STORE_IT_DBBACKUPPLAN, IT_DBBACKUPPLAN_DETAILS,
   EDIT_IT_DBBACKUPPLAN, UPDATE_IT_DBBACKUPPLAN, REMOVE_IT_DBBACKUPPLAN
} from '@/store/actions.type'

import { SET_IT_DBBACKUPPLANS_LABELS, SET_LOADING } from '@/store/mutations.type'


const initialState = {
   labels: {
   }
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_IT_DBBACKUPPLANS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
            .then(list => {
               resolve(list)
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_IT_DBBACKUPPLAN](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.create()
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_IT_DBBACKUPPLAN](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [IT_DBBACKUPPLAN_DETAILS](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.details(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_IT_DBBACKUPPLAN](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_IT_DBBACKUPPLAN](context, { id, model }) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update({ id, model })
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_IT_DBBACKUPPLAN](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }   
}


const mutations = {
   [SET_IT_DBBACKUPPLANS_LABELS](state, labels) {
      state.labels = labels
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 