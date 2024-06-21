import TaskService from '@/services/tasks.service'
import { resolveErrorData, deepClone, isEmptyObject, getListFromObj } from '@/utils'
import { FETCH_TASKS, CREATE_TASK, STORE_TASK, TASK_DETAILS } from '@/store/actions.type'  

import { SET_TASKS, SET_LOADING } from '@/store/mutations.type'
   



const initialState = {
   params: {

   },
   list: [],
   labels: {
      'title': '名稱',
      'content': '內容',
      'deadLine': '截止日期',
      'ps': '備註'
   },
   actions: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_TASKS](context, params) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         TaskService.fetch(params)
         .then(list => {
            context.commit(SET_TASKS, list)
            resolve(list)
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
}


const mutations = {
   [SET_TASKS](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 