import EventsService from '@/services/events.service'
import { resolveErrorData, deepClone, now, isEmptyObject, getListFromObj } from '@/utils'
import { FETCH_EVENTS, CREATE_EVENT, STORE_EVENT, EVENT_DETAILS } from '@/store/actions.type'  

import { SET_LOADING } from '@/store/mutations.type'
   



const initialState = {
   list: [],
   labels: {
      'title': '標題',
      'content': '內容',
      'allDay': '全天',
      'startDate': '開始日期',
      'endDate': '結束日期',
      'ps': '備註',
      'active': '狀態'
   },
   actions: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_EVENTS](context, { calendar, start, end }) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         EventsService.fetch({ calendar, start, end })
         .then(list => {
            resolve(list)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_EVENT](context, params) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         EventsService.create(params)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_EVENT](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         EventsService.store(model)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EVENT_DETAILS](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         EventsService.details(id)
         .then(model => resolve(model))
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
 