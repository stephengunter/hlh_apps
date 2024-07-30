import DocService from '@/services/docs.service'
import { resolveErrorData, deepClone, isEmptyObject, getListFromObj } from '@/utils'
import Doc from '@/models/doc'
import { INIT_DOCS, FETCH_DOCS, CREATE_DOC, STORE_DOC, DOC_DETAILS, EDIT_DOC, UPDATE_DOC } from '@/store/actions.type'  

import { SET_DOCS, SET_DOC_DEPARTMENTS, SET_LOADING } from '@/store/mutations.type'
   



const initialState = {
   query: {

   },
   departments: [],
   tels: [],
   list: [],
   labels: {
      'tel': '分機',
      'ps': '備註'
   },
   actions: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [INIT_DOCS](context) {
      let state = context.state
      state.query = { ...initialState.query }
      
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DocService.init()
            .then(model => {
               context.commit(SET_DOC_DEPARTMENTS, model.departments)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_DOCS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DocService.fetch(query)
         .then(model => {
            context.commit(SET_DOCS, model)
            resolve()
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_DOC](context, params) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DocService.create(params)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_DOC](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DocService.store(model)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [DOC_DETAILS](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DocService.details(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_DOC](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DocService.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_DOC](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DocService.update(model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}


const mutations = {
   [SET_DOCS](state, model) {
      state.query = model.request
      state.actions = model.actions
      state.pagedList = model.pagedList
   },
   [SET_DOC_DEPARTMENTS](state, departments) {
      state.departments = []
      state.tels = []
      departments.forEach(d => {
         let entry = new Doc(d)
         state.tels = state.tels.concat(entry.tels)
         state.departments.push(entry)
      })
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 