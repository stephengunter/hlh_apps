import { ROUTE_TYPES } from '@/consts'
import appRoutes from '@/routes/app'

export const getMainMenus = (currentRoute, user) => {
   let routes = []
   if(user) {
      routes = appRoutes.filter(item => item.meta.type !== ROUTE_TYPES.GUEST_ONLY)
   }else {
      routes = appRoutes.filter(item => item.meta.type !== ROUTE_TYPES.ADMIN_ONLY)
   }
   
   let mainLinks = getMainLinks(routes)
   // mainLinks.forEach(item => {
   //    item.active =  (item.name === currentRoute.name)
   //    item.subs = getSubLinks(routes, item.name)
   //    item.subs.forEach(subItem => {
   //       subItem.active =  (subItem.name === currentRoute.name)
   //    })
   // })

   return mainLinks
}

const getMainLinks = (routes) => routes.filter(item => item.meta.menu)