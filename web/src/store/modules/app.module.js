import Errors from '@/common/errors'
import { SET_BREAD_ITEMS, SET_LOADING, SET_ERRORS, CLEAR_ERRORS, 
   SET_DRAWER, SET_MENUS, TOGGLE_DRAWER, SET_ROUTE
} from '@/store/mutations.type'

const initialState = {
   breadItems: [],
   loading: false,
   drawer: true,
   menus: [],
   errors: new Errors(),
   route: null
}

export const state = { ...initialState }


const getters = {
   drawer(state) {
      return state.drawer
   },
   breadItems(state) {
      return state.breadItems
   },
   loading(state) {
      return state.loading
   },
   menus(state) {
      return state.menus
   },
   errors(state) {
      return state.errors
   }
}



const mutations = {
   [SET_BREAD_ITEMS](state, items) {
      state.breadItems = items
   },
   [SET_LOADING](state, loading) {
      state.loading = loading
   },
   [SET_DRAWER](state, drawer) {
      state.drawer = drawer
   },
   [TOGGLE_DRAWER](state) {
      state.drawer = !state.drawer
   },
   [SET_MENUS](state, menus) {
      state.menus = menus
   },
   [SET_ERRORS](state, errors) {
      console.log(errors)
      state.errors.record(errors)
   },
   [CLEAR_ERRORS](state) {
      state.errors.clear()   
   },
   [SET_ROUTE](state, model) {
      state.route = model
   }
}

export default {
   state,
   mutations,
   getters
}
 