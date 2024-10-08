import ReferenceService from '@/services/references.service'
import { resolveErrorData, deepClone, now, isEmptyObject, getListFromObj } from '@/utils'
import { STORE_REFERENCE, GET_REFERENCE, UPDATE_REFERENCE, REMOVE_REFERENCE } from '@/store/actions.type'  

import { SET_LOADING } from '@/store/mutations.type'
   



const initialState = {
   
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [STORE_REFERENCE](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ReferenceService.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_REFERENCE](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ReferenceService.update(model.id, model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [GET_REFERENCE](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ReferenceService.get(id)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_REFERENCE](context, ids) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ReferenceService.remove(ids)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
}


const mutations = {
   
}

export default {
   state,
   actions,
   mutations,
   getters
}
 