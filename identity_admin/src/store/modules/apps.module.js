import Errors from '@/common/errors'
import Service from '@/services/apps.service'
import { INIT_APPS, FETCH_APPS, CREATE_APP, STORE_APP, EDIT_APP, UPDATE_APP } from '@/store/actions.type'
import { SET_LOADING, SET_APPS_INDEX_MODEL, SET_APPS_LIST } from '@/store/mutations.type'
import { deepClone } from '@/utils'
import { ROUTE_NAMES } from '@/consts'

const initialState = {
   query: {
   },
   providers: {
   },
   type_options: [],
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
         .then(model => resolve(model))
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
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_APP](context, { id, model }) {
      console.log(UPDATE_APP)
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update({ id, model })
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
}

const mutations = {
   [SET_APPS_INDEX_MODEL](state, model) {
      state.query = model.request
      state.labels = model.labels
      state.type_options = model.types.map(type => {
         return { value: type, title: type }
      })
   },
   [SET_APPS_LIST](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 