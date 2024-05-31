import CalendarService from '@/services/calendars.service'
import { resolveErrorData, deepClone, now, isEmptyObject, getListFromObj } from '@/utils'
import { FETCH_CALENDAR_CATEGORIES } from '@/store/actions.type'
   

import { SET_CALENDAR_CATEGORIES,
   SET_LOADING 
} from '@/store/mutations.type'


const initialState = {
   categories: [],
   labels: {
      ps: '備註',
      createdAtText: '建檔日期',
   },
   params: {
		year: now(),
      month: ''
	},
   actions: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_CALENDAR_CATEGORIES](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         CalendarService.categories()
            .then(categories => {
               context.commit(SET_CALENDAR_CATEGORIES, categories)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
}


const mutations = {
   [SET_CALENDAR_CATEGORIES](state, categories) {
      state.categories = categories
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 