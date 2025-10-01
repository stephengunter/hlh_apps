import ItemService from '@/services/Items.service'
import { resolveErrorData, deepClone, now, isEmptyObject, getListFromObj } from '@/utils'
import { STORE_ITEM, GET_ITEM, UPDATE_ITEM, REMOVE_ITEM } from '@/store/actions.type'  

import { SET_LOADING } from '@/store/mutations.type'
   



const initialState = {
   
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [STORE_ITEM](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ItemService.store(model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_ITEM](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ItemService.update(model.id, model)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [GET_ITEM](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ItemService.get(id)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_ITEM](context, ids) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         ItemService.remove(ids)
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
 