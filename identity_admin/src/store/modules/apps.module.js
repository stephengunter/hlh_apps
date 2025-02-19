import Errors from '@/common/errors'
import Service from '@/services/apps.service'
import { INIT_APPS, FETCH_APPS, CREATE_APP, STORE_APP, EDIT_APP, UPDATE_APP, 
   REMOVE_APP, RESET_APP_CLIENT_SECRET 
} from '@/store/actions.type'
import { SET_LOADING, SET_APPS_INDEX_MODEL, SET_APPS_LIST, SET_APPS_API_OPTIONS } from '@/store/mutations.type'
import { deepClone } from '@/utils'
import { ROUTE_NAMES } from '@/consts'

const initialState = {
   query: {
   },
   providers: {
   },
   role_options: [],
   type_options: [],
   api_options: [],
   labels: {
   },
   list: []
}

const state = deepClone(initialState)


const getters = {
   
}

const actions = {
   [INIT_APPS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
            .then(model => {
               context.commit(SET_APPS_INDEX_MODEL, model)               
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_APPS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
         .then(list => {
            context.commit(SET_APPS_LIST, list)
            resolve()
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_APP](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.create()
         .then(model => {
            context.commit(SET_APPS_API_OPTIONS, model.apiOptions)
            resolve(model.form)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_APP](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_APP](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.edit(id)
         .then(model => {
            console.log(model)
            context.commit(SET_APPS_API_OPTIONS, model.apiOptions)
            resolve(model.form)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_APP](context, { id, model }) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update({ id, model })
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_APP](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [RESET_APP_CLIENT_SECRET](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.resetClientSecret(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}

const mutations = {
   [SET_APPS_INDEX_MODEL](state, model) {
      state.query = model.request
      state.labels = model.labels
      state.type_options = model.types.map(type => {
         return { value: type, title: type }
      })
      state.role_options = model.roles.map(role => {
         return { value: role.name, title: role.title }
      })
   },
   [SET_APPS_LIST](state, list) {
      state.list = list
   },
   [SET_APPS_API_OPTIONS](state, options) {
      state.api_options = options
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 