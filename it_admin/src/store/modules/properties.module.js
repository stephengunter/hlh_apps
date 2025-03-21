import Errors from '@/common/errors'
import Service from '@/services/properties.service'
import { INIT_PROPERTIES, FETCH_PROPERTIES
} from '@/store/actions.type'
import { SET_LOADING, SET_PROPERTIES_ADMIN_MODEL, SET_PROPERTIES_INDEX_MODEL, SET_PROPERTIES_LIST } from '@/store/mutations.type'
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
   }
}

const mutations = {
   [SET_PROPERTIES_ADMIN_MODEL](state, model) {
      state.query = model.request
      state.labels = model.labels
      state.locations = model.locations
      state.categories = model.categories
   },
   [SET_PROPERTIES_INDEX_MODEL](state, model) {
      state.pagedList = model
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
 