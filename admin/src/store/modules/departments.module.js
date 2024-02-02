import DepartmentsService from '@/services/departments.service'
import { resolveErrorData, loadParent, loadSubItems, deepClone, getFullText, getSubItems } from '@/utils'
import Category from '@/models/category'
import {
   FETCH_DEPARTMENTS, CREATE_DEPARTMENT, STORE_DEPARTMENT, ORDERS_DEPARTMENT,
   EDIT_DEPARTMENT, UPDATE_DEPARTMENT, OFF_DEPARTMENT, REMOVE_DEPARTMENT
} from '@/store/actions.type'

import { SET_DEPARTMENTS, SET_DEPARTMENT_KEYS, SET_LOADING, CLEAR_DEPARTMENT_KEYS } from '@/store/mutations.type'



const initialState = {
   keys: {},
   all: [],
   roots: [],
   options: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_DEPARTMENTS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DepartmentsService.fetch()
            .then(model => {
               context.commit(SET_DEPARTMENT_KEYS, model.keys)
               context.commit(SET_DEPARTMENTS, model.departments)
               resolve()
            })
            .catch(error => {
               console.log(error)
               reject(error)
            })
            .finally(() => { 
               context.commit(SET_LOADING, false)
            })
      })
   },
   [CREATE_DEPARTMENT](context, parentId) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DepartmentsService.create(parentId)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_DEPARTMENT](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DepartmentsService.store(model)
         .then(department => resolve(department))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_DEPARTMENT](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DepartmentsService.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_DEPARTMENT](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DepartmentsService.update(model.id, model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [OFF_DEPARTMENT](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DepartmentsService.off(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_DEPARTMENT](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DepartmentsService.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [ORDERS_DEPARTMENT](context, ids) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         const model = { ids }
         DepartmentsService.orders(model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
   
   
}


const mutations = {
   [SET_DEPARTMENT_KEYS](state, keys) {
      state.keys = keys
   },
   [CLEAR_DEPARTMENT_KEYS](state) {
      state.keys = {}
   },
   [SET_DEPARTMENTS](state, departments) {
      state.all = departments.map(item => new Category(item))
      state.all.forEach(c => c.loadParentIds(state.all))
      
      let roots = state.all.filter(c => c.isRootItem)
      state.roots = roots.slice(0)

      state.options = state.all.map(item => ({
         value: item.id,
         text: item.getFullText(departments)
      }))
      
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 