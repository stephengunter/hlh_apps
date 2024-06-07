import CalendarService from '@/services/calendars.service'
import { resolveErrorData, deepClone, now, isEmptyObject, getListFromObj } from '@/utils'
import { FETCH_CALENDARS } from '@/store/actions.type'  

import { SET_CALENDARS, SET_LOADING } from '@/store/mutations.type'
   



const initialState = {
   list: [],
   actions: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_CALENDARS](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         CalendarService.fetch()
            .then(list => {
               context.commit(SET_CALENDARS, list)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
}


const mutations = {
   [SET_CALENDARS](state, list) {
      state.list = list
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 