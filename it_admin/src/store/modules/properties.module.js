import Errors from '@/common/errors'
import Service from '@/services/properties.service'
import { INIT_PROPERTIES, FETCH_PROPERTIES, EDIT_PROPERTY, UPDATE_PROPERTY,
   REPORT_PROPERTIES, UPLOAD_PROPERTIES, IMPORT_PROPERTIES,
   REMOVE_PROPERTY, EDIT_PROPERTY_CATEGORY, REMOVE_PROPERTY_CATEGORY } from '@/store/actions.type'
import { SET_LOADING, SET_PROPERTIES_ADMIN_MODEL, SET_PROPERTIES_INDEX_MODEL, SET_PROPERTIES_LIST } from '@/store/mutations.type'
import { deepClone } from '@/utils'
import { ROUTE_NAMES } from '@/consts'

const initialState = {
   query: {
   },
   labels: {
   },
   type_options: [],
   device_options: [],
   pagedList: null,
   groupViews: [],
   locations: [],
   categories: [],  
   list: []
}

const state = deepClone(initialState)


const getters = {
   
}

const actions = {
   [INIT_PROPERTIES](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
            .then(model => {
               context.commit(SET_PROPERTIES_ADMIN_MODEL, model)               
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_PROPERTIES](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
         .then(model => {
            context.commit(SET_PROPERTIES_INDEX_MODEL, model)
            resolve()
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_PROPERTY](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.edit(id)
         .then(model => {
            resolve(model)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_PROPERTY](context, { id, model }) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update({ id, model })
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPLOAD_PROPERTIES](context, model) {
      const formData = new FormData()
      for (const key in model) {
         if (key === 'file' && model[key]) {
            formData.append(key, model[key], model[key].name);
         } else if (model[key] != null) {
            formData.append(key, model[key])
         }
      }
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.upload(formData)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [IMPORT_PROPERTIES](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.imports(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REPORT_PROPERTIES](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.reports(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_PROPERTY](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_PROPERTY_CATEGORY](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.editCategory(id)
         .then(model => {
            resolve(model)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_PROPERTY_CATEGORY](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.removeCategory(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}

const mutations = {
   [SET_PROPERTIES_ADMIN_MODEL](state, model) {
      state.query = model.request
      state.labels = model.labels
      state.type_options = model.typeOptions
      state.device_options = model.deviceOptions
      state.locations = model.locations
      state.categories = model.categories
   },
   [SET_PROPERTIES_INDEX_MODEL](state, model) {
      state.pagedList = model.pagedList
      state.groupViews = model.groupViews
   },
   [SET_PROPERTIES_LIST](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 