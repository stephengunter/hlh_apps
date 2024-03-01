import LocationsService from '@/services/locations.service'
import { resolveErrorData, loadParent, loadSubItems, deepClone, getFullText, getSubItems } from '@/utils'
import Category from '@/models/category'
import {
   FETCH_LOCATIONS, CREATE_LOCATION, STORE_LOCATION, ORDERS_LOCATION, 
   EDIT_LOCATION, UPDATE_LOCATION, OFF_LOCATION, REMOVE_LOCATION, EXPORT_LOCATION, IMPORT_LOCATION
} from '@/store/actions.type'

import { SET_LOCATIONS, SET_LOADING, SET_JOBTITLES } from '@/store/mutations.type'



const initialState = {
   all: [],
   roots: [],
   options: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_LOCATIONS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         LocationsService.fetch()
            .then(list => {
               context.commit(SET_LOCATIONS, list)
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
   [CREATE_LOCATION](context, parentId) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         LocationsService.create(parentId)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_LOCATION](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         LocationsService.store(model)
         .then(location => resolve(location))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_LOCATION](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         LocationsService.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_LOCATION](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         LocationsService.update(model.id, model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [OFF_LOCATION](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         LocationsService.off(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_LOCATION](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         LocationsService.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [ORDERS_LOCATION](context, ids) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         const model = { ids }
         LocationsService.orders(model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EXPORT_LOCATION](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         LocationsService.exporting(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [IMPORT_LOCATION](context, { key, files }) {
      context.commit(SET_LOADING, true)
      let form = new FormData()
      form.append('key', key)
      for (let i = 0; i < files.length; i++) {
         form.append('files', files[i])
      }
      return new Promise((resolve, reject) => {
         LocationsService.importing(form)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}


const mutations = {
   [SET_LOCATIONS](state, list) {
      state.all = list.map(item => new Category(item))
      state.all.forEach(c => c.loadParentIds(state.all))
      
      let roots = state.all.filter(c => c.isRootItem)
      state.roots = roots.slice(0)

      state.options = state.all.map(item => ({
         value: item.id,
         text: item.getFullText(list)
      }))
      
   },
   [SET_JOBTITLES](state, list) {
      state.job_titles = list
   },
}

export default {
   state,
   actions,
   mutations,
   getters
}
 