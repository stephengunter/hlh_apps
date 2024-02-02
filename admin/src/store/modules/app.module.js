import Errors from '@/common/errors'
import appRoutes from '@/routes/app'
import { MENUS } from '@/consts'
import { GET_MENUS } from '@/store/actions.type'
import { SET_BREAD_ITEMS, SET_LOADING, SET_ERRORS, CLEAR_ERRORS, 
   SET_DRAWER, TOGGLE_DRAWER, SET_ROUTE, SET_MENUS
} from '@/store/mutations.type'
import { isMainMenuItem, hasParent, deepClone } from '@/utils'

const initialState = {
   breadItems: [],
   loading: false,
   drawer: true,
   errors: new Errors(),
   route: {
      to: {}, 
      from: {}
   },
   menus: []
}

const state = deepClone(initialState)


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
   errors(state) {
      return state.errors
   }
}


const actions = {
   [GET_MENUS](context, auth) {
      if(auth) {
         let mainMenus = appRoutes.filter(item => isMainMenuItem(item))
                                 .filter(item => !hasParent(item))
         context.commit(SET_MENUS, mainMenus)
      } 
      else context.commit(SET_MENUS, [])
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
   [SET_ERRORS](state, errors) {
      state.errors.record(errors)
   },
   [CLEAR_ERRORS](state) {
      state.errors.clear()   
   },
   [SET_ROUTE](state, to, from) {
      state.route.to = { ...to }
      state.route.from = { ...from }
   },
   [SET_MENUS](state, menus) {
      state.menus = menus
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 