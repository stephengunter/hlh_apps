import Service from '@/services/it/servers.service'
import { resolveErrorData, deepClone } from '@/utils'
import { SERVER_TYPES } from '@/consts'
import {
   INIT_IT_SERVERS, FETCH_IT_SERVERS, CREATE_IT_SERVER, STORE_IT_SERVER, 
   IT_SERVER_DETAILS, EDIT_IT_SERVER, UPDATE_IT_SERVER, REMOVE_IT_SERVER
} from '@/store/actions.type'

import { SET_IT_SERVERS_INDEX_MODEL, SET_IT_SERVERS, SET_IT_CREDENTIALINFO_LABLES, SET_LOADING } from '@/store/mutations.type'


const initialState = {
   query: {
   },
   hosts: [],
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
   [INIT_IT_SERVERS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.init()
            .then(model => {
               context.commit(SET_IT_SERVERS_INDEX_MODEL, model)
               context.commit(SET_IT_CREDENTIALINFO_LABLES, model.credentialInfoLabels)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_IT_SERVERS](context, query) {
      console.log(FETCH_IT_SERVERS, query)
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.fetch(query)
            .then(list => {
               context.commit(SET_IT_SERVERS, list)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_IT_SERVER](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.create()
         .then(model => {
            state.hosts = model.hosts
            resolve(model.form)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_IT_SERVER](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [IT_SERVER_DETAILS](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.details(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_IT_SERVER](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.edit(id)
         .then(model => {
            state.hosts = model.hosts
            resolve(model.form)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_IT_SERVER](context, { id, model }) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         Service.update({ id, model })
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_IT_SERVER](context, id) {
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
   [SET_IT_SERVERS_INDEX_MODEL](state, model) {
      state.query = model.request
      state.labels = model.labels
      state.providers = model.providers
      let options = []
      for(const [key, obj] of Object.entries(SERVER_TYPES)) {
         const value = obj.name
         const title = obj.title
         const icon = obj.icon
         options.push({ value, title, icon})
      }
      state.type_options = options
   },
   [SET_IT_SERVERS](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 