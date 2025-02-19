import Errors from '@/common/errors'
import appRoutes from '@/routes/app'
import { MENUS } from '@/consts'
import { GET_MENUS, PAGE_NOT_FOUND } from '@/store/actions.type'
import { SET_BREAD_ITEMS, SET_LOADING, SET_ERRORS, CLEAR_ERRORS, 
   SET_DRAWER, TOGGLE_DRAWER, SET_ROUTE, SET_MENUS
} from '@/store/mutations.type'
import { deepClone } from '@/utils'
import { ROUTE_NAMES } from '@/consts'

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
   lastPage(state) {
      return state.route.from
   },
   currentPage(state) {
      return state.route.to
   },
   loading(state) {
      return state.loading
   },
   errors(state) {
      return state.errors
   }
}

const setSubsActive = (item, val) => {
   if(!item.hasSubs()) return
   item.getSubitems().forEach(sub => {
      sub.setActive(val)
      setSubsActive(sub, val)
   })
}
const activateSubitems = (item, current) => {
   let subActiveCount = 0
   if (!item.hasSubs()) return subActiveCount
   // Iterate through subitems
   item.getSubitems().forEach(sub => {
      if (sub.name === current.name) {
         if(sub.isMainMenuItem()) sub.setActive(true)
         else item.setActive(true)
         
         subActiveCount++
      } else {
         sub.setActive(false)
      }
       // Recursive call to process deeper subitems
      subActiveCount += activateSubitems(sub, current)
   })

   return subActiveCount
}

const actions = {
   [GET_MENUS](context, auth) {
      if(auth) context.commit(SET_MENUS, appRoutes.filter(item => item.isMainMenuItem()).filter(item => item.isRoot()))
      else context.commit(SET_MENUS, [])
   },
   [PAGE_NOT_FOUND](context, { router, returnUrl }) {
      if(!returnUrl) {
         if(state.route.from) returnUrl = state.route.from.fullPath
      } 
      router.push({ name: ROUTE_NAMES.NOT_FOUND, query: { returnUrl } })
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
   [SET_ROUTE](state, { to, from }) {
      state.route.to = deepClone(to)
      state.route.from = deepClone(from)
   },
   [SET_MENUS](state, menus) {
      const current = state.route.to
      if(current) {
         menus.forEach(item => {
            if(item.name === current.name) {
               setSubsActive(item, false)
               item.setActive(true)
            }else {
               item.setActive(false)
               let subActive = activateSubitems(item, current)
               item.setExpand(subActive > 0)
            }
            
         })
      }
      state.menus = menus
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 