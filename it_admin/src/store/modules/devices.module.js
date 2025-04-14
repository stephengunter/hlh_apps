import Errors from '@/common/errors'
import Service from '@/services/devices.service'
import { INIT_DEVICES, FETCH_DEVICES, CREATE_DEVICE, STORE_DEVICE, EDIT_DEVICE, UPDATE_DEVICE, 
   REMOVE_DEVICE, IMPORT_DEVICES
} from '@/store/actions.type'
import { SET_LOADING, SET_DEVICES_ADMIN_MODEL, SET_DEVICES_INDEX_MODEL, SET_DEVICES_LIST } from '@/store/mutations.type'
import { deepClone } from '@/utils'
import { ROUTE_NAMES } from '@/consts'

const initialState = {
   query: {
   },
   labels: {
   },
   transactionLabels: {
   },
   pagedList: null,
   locations: [],
   categories: [],  
   rootCategory: null,
   list: []
}

const state = deepClone(initialState)


const getters = {
   
}

const actions = {
   [INIT_DEVICES](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
            .then(model => {
               context.commit(SET_DEVICES_ADMIN_MODEL, model)               
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_DEVICES](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
         .then(model => {
            context.commit(SET_DEVICES_INDEX_MODEL, model)
            resolve()
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_DEVICE](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.create()
         .then(model => {
            resolve(model)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_DEVICE](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_DEVICE](context, id) {
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
   [UPDATE_DEVICE](context, { id, model }) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update({ id, model })
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_DEVICE](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [IMPORT_DEVICES](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.imports()
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
}

const mutations = {
   [SET_DEVICES_ADMIN_MODEL](state, model) {
      state.query = model.request
      state.labels = model.labels
      state.categories = model.categories
      state.locations = model.locations
      state.rootCategory = model.rootCategory
   },
   [SET_DEVICES_INDEX_MODEL](state, model) {
      state.pagedList = model
   },
   [SET_DEVICES_LIST](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 