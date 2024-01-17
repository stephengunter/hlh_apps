import { ROUTE_TYPES, ROUTE_NAMES, MENUS } from '@/consts'
import { upperFirstLetter, pluralization } from '@/utils'
import pluralize from 'pluralize'

const applinks = [{
   name: 'close',
   path: '/close',
   view: 'Close',      
   meta: {
      title: '系統維護中'
   } 
},
{
   name: '404',
   path: '/:pathMatch(.*)*',
   view: '404',      
   meta: {
      title: 'Page Not Found'
   } 
},
{
   name: 'test',
   path: '/test',
   view: 'Test',      
   meta: { 
      title: 'Test' 
   }
}]

const adminlinks = [{
   name: 'dashboard',
   path: '/',
   view: 'Dashboard',      
   meta: {
      icon: 'mdi-view-dashboard',
      title: 'Dashboard',
      menus: [MENUS.MAIN]
   } 
},
{
   name: ROUTE_NAMES.DEPARTMENTS,
   path: `/${ROUTE_NAMES.DEPARTMENTS}`,
   view: pluralization(upperFirstLetter(ROUTE_NAMES.DEPARTMENTS)), 
   view: `Departments`,   
   meta: {
      icon: 'mdi-file-tree-outline',
      title: '組織管理',
      menus: [MENUS.MAIN]
   }
},
{
   name: ROUTE_NAMES.ARTICLE_INDEX,
   path: '/articles',
   view: 'articles/Index',      
   meta: {
      icon: 'mdi-post-outline',
      title: '文章管理',
      menus: [MENUS.MAIN]
   }
},
{
   name: ROUTE_NAMES.ARTICLE_EDIT,
   path: '/articles/edit/:id?',
   view: 'articles/Edit',
   meta: {
      title: '文章管理 - 編輯',
      parent: ROUTE_NAMES.ARTICLE_INDEX,
   }
},
{
   name: 'tags',
   path: '/tags',
   view: 'Tags',
   meta: {
      icon: 'mdi-tag-outline',
      parent: ROUTE_NAMES.ARTICLE_INDEX,
      title: '標籤管理',
      menus: [MENUS.MAIN]
   }
},
{
   name: 'profiles',
   path: '/profiles',
   view: 'Profiles',
   meta: {
      icon: 'mdi-account',
      title: 'Profiles',
      menus: [MENUS.USER]
   }
}]

const guestLinks = [{
   name: ROUTE_NAMES.LOGIN,
   path: '/login',
   view: 'Login',
   meta: {
      icon: 'mdi-login-variant',
      title: 'Login'
   } 
}]

applinks.forEach(page => {
   page.meta.type = ROUTE_TYPES.FOR_ALL
})
adminlinks.forEach(page => {
   page.meta.type = ROUTE_TYPES.ADMIN_ONLY
})
guestLinks.forEach(page => {
   page.meta.type = ROUTE_TYPES.GUEST_ONLY
})

let appRoutes = applinks.concat(adminlinks).concat(guestLinks)

for(let i = 0; i < appRoutes.length; i++) {
   let name = appRoutes[i].name
   let subs = appRoutes.filter(item => item.meta.hasOwnProperty('parent') && item.meta.parent === name)
   appRoutes[i].meta.subs = subs
   appRoutes[i].meta.order = i
}


export default appRoutes