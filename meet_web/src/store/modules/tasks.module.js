import TaskService from '@/services/tasks.service'
import { resolveErrorData, deepClone, isEmptyObject, getListFromObj } from '@/utils'
import { FETCH_TASKS, CREATE_TASK, STORE_TASK, TASK_DETAILS, EDIT_TASK, UPDATE_TASK } from '@/store/actions.type'  

import { SET_TASKS, SET_LOADING } from '@/store/mutations.type'
   



const initialState = {
   query: {

   },
   list: [],
   labels: {
      'title': '名稱',
      'content': '說明',
      'deadLine': '截止日期',
      'ps': '備註'
   },
   actions: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_TASKS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         TaskService.fetch(query)
         .then(model => {
            context.commit(SET_TASKS, model)
            resolve()
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_TASK](context, params) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         TaskService.create(params)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_TASK](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         TaskService.store(model)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [TASK_DETAILS](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         TaskService.details(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_TASK](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         TaskService.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_TASK](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         TaskService.update(model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}


const mutations = {
   [SET_TASKS](state, model) {
      state.query = model.request
      state.actions = model.actions
      state.pagedList = model.pagedList
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 