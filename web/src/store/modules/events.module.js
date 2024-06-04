import EventsService from '@/services/events.service'
import { resolveErrorData, deepClone, now, isEmptyObject, getListFromObj } from '@/utils'
import { FETCH_EVENTS } from '@/store/actions.type'  

import { SET_EVENTS_LIST, SET_LOADING } from '@/store/mutations.type'
   



const initialState = {
   list: [],
   params: {
		calendar: '',
		start: '',
      end: ''
	},
   labels: {
      year: '年度',
      month: '月份'
   },
   actions: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_EVENTS](context, params) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         EventsService.fetch(params)
            .then(list => {
               
               context.commit(SET_EVENTS_LIST, list)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
}


const mutations = {
   [SET_EVENTS_LIST](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 