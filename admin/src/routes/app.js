import { ROUTE_TYPES, ROUTE_NAMES, MENUS, ENTITY_TYPES } from '@/consts'
import { isNullOrEmpty, upperFirstLetter, pluralization } from '@/utils'

const toLink = (name, meta, view = '', alias = '') => {
   const temp = pluralization(name)
   let route = {
      name: temp,
      path: `/${temp}`,
      view: isNullOrEmpty(view) ?  `${upperFirstLetter(temp)}` : view,
      meta
   }
   if(alias) route.alias = alias
   return route
}

const USER = ENTITY_TYPES.USER
const PROFILES = ENTITY_TYPES.PROFILES
const DEPARTMENT = ENTITY_TYPES.DEPARTMENT
const JOB = ENTITY_TYPES.JOB

const groups = {
   [ROUTE_NAMES.DASHBOARD]: toLink(ROUTE_NAMES.DASHBOARD,{
      icon: 'mdi-view-dashboard',
      title: '儀表版',
      menus: [MENUS.MAIN]
   }, '', '/'),
   [USER.name]: toLink(USER.name, {
      icon: 'mdi-account',      
      title: `${USER.title}管理`,
      menus: [MENUS.MAIN]
   }, `${pluralization(USER.name)}/Index`
   ),
   [DEPARTMENT.name]: toLink(DEPARTMENT.name, {
      icon: 'mdi-file-tree-outline',      
      title: '組織管理',
      menus: [MENUS.MAIN]
   }, `${pluralization(DEPARTMENT.name)}/Index`
   )
}

const applinks = [{
   name: 'close',
   path: '/close',
   view: 'Close',      
   meta: {
      title: '系統維護中'
   } 
},
{
   name: ROUTE_NAMES.NOT_FOUND,
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

const adminlinks = [
{ 
   ...groups[ROUTE_NAMES.DASHBOARD]
},
{ 
   ...groups[USER.name]
},
{ 
   ...groups[DEPARTMENT.name]
},
{
   name: ROUTE_NAMES.USER_DETAILS,
   path: '/users/:id',
   view: 'users/Details',
   meta: {
      title: `${USER.title}管理`,
      parent: groups[USER.name].name
   }
},
toLink(JOB.name, {
   icon: 'mdi-briefcase-outline',
   parent: groups[DEPARTMENT.name].name,
   title: JOB.title,
   menus: [MENUS.MAIN]
},`${pluralization(DEPARTMENT.name)}/Jobs`
),
toLink(PROFILES.name, {
   icon: 'mdi-account',
   title: pluralization(PROFILES.name),
   menus: [MENUS.USER]
})
// {
//    name: ROUTE_NAMES.ARTICLE_INDEX,
//    path: '/articles',
//    view: 'articles/Index',      
//    meta: {
//       icon: 'mdi-post-outline',
//       title: '文章管理',
//       menus: [MENUS.MAIN]
//    }
// },
// {
//    name: ROUTE_NAMES.ARTICLE_EDIT,
//    path: '/articles/edit/:id?',
//    view: 'articles/Edit',
//    meta: {
//       title: '文章管理 - 編輯',
//       parent: ROUTE_NAMES.ARTICLE_INDEX,
//    }
// },
]
const guestLinks = [{
   name: 'login',
   path: '/login',
   view: 'Login',
   meta: {
      title: 'Login',
      menus: []
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