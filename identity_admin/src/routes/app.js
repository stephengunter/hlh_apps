import { ROUTE_TYPES, ROUTE_NAMES, MENUS, ENTITY_TYPES } from '@/consts'
import { isNullOrEmpty, upperFirstLetter, pluralization } from '@/utils'
import Page from '@/models/page'

const APP = ENTITY_TYPES.APP
const USER = ENTITY_TYPES.USER
const PROFILES = ENTITY_TYPES.PROFILES
const DEPARTMENT = ENTITY_TYPES.DEPARTMENT
const JOB = ENTITY_TYPES.JOB
const LOCATION = ENTITY_TYPES.LOCATION


const applinks = [
new Page({
   name: ROUTE_NAMES.CLOSE,
   path: `/${ROUTE_NAMES.CLOSE}`,
   view: `${upperFirstLetter(ROUTE_NAMES.CLOSE)}`,
   icon: '',
   title: '系統維護中',
   menus: []
}),
new Page({
   name: ROUTE_NAMES.NOT_FOUND,
   path: '/:pathMatch(.*)*',
   view: '404', 
   icon: '',
   title: 'Page Not Found',
   menus: []
}),
new Page({
   name: 'test',
   path: '/test',
   view: 'Test',      
   icon: '',
   title: 'Test',
   menus: []
}),
new Page({
   name: ROUTE_NAMES.SIGN_IN_CALLBACK,
   path: `/${ROUTE_NAMES.SIGN_IN_CALLBACK}`,
   view: `SigninCallback`,
   icon: '',
   title: '',
   menus: [],
})
]

const adminlinks = [
// groups
new Page({
   name: ROUTE_NAMES.DASHBOARDS,
   path: `/${ROUTE_NAMES.DASHBOARDS}`,
   view: `${upperFirstLetter(ROUTE_NAMES.DASHBOARDS)}`,
   icon: 'mdi-view-dashboard',
   title: '儀表版',
   menus: [MENUS.MAIN],
   alias: '/'
}),
new Page({
   name: ROUTE_NAMES.APPS,
   path: `/${pluralization(APP.name)}`,
   view: `${pluralization(APP.name)}/Index`,
   icon: 'mdi-apps', 
   title: `${APP.title}管理`,
   menus: [MENUS.MAIN]
}),
new Page({
   name: ROUTE_NAMES.USERS,
   path: `/${pluralization(USER.name)}`,
   view: `${pluralization(USER.name)}/Index`,
   icon: 'mdi-account', 
   title: `${USER.title}管理`,
   menus: [MENUS.MAIN]
}),
new Page({
   name: pluralization(DEPARTMENT.name),
   path: `/${pluralization(DEPARTMENT.name)}`,
   view: `${pluralization(DEPARTMENT.name)}/Index`,
   icon: 'mdi-file-tree-outline', 
   title: '組織管理',
   menus: [MENUS.MAIN]
}),

//Groups Users
new Page({
   name: ROUTE_NAMES.USER_DETAILS,
   path: '/users/:id',
   view: 'users/Details',
   icon: '', 
   title: `${USER.title}管理`,
   menus: [],
   parent: 'users'
}),
//Groups Departments
new Page({
   name: pluralization(JOB.name),
   path: `/${pluralization(JOB.name)}`,
   view: `${pluralization(JOB.name)}/Index`,
   icon: 'mdi-briefcase-outline',
   title: `${JOB.title}管理`,
   menus: [MENUS.MAIN],
   parent: pluralization(DEPARTMENT.name),
}),
new Page({
   name: ROUTE_NAMES.JOB_DETAILS,
   path: '/jobs/:id',
   view: `${pluralization(JOB.name)}/Details`,
   icon: '',
   title: `${JOB.title}管理`,
   menus: [],
   parent: pluralization(JOB.name),
}),
new Page({
   name: pluralization(LOCATION.name),
   path: `/${pluralization(LOCATION.name)}`,
   view: `${pluralization(LOCATION.name)}/Index`,
   icon: 'mdi-office-building',
   title: `${LOCATION.title}管理`,
   menus: [MENUS.MAIN],
   parent: pluralization(DEPARTMENT.name),
})
]
const guestLinks = [
new Page({
   name: ROUTE_NAMES.LOGIN,
   path: `/${ROUTE_NAMES.LOGIN}`,
   view: `${upperFirstLetter(ROUTE_NAMES.LOGIN)}`,
   icon: '',
   title: 'Login',
   menus: []
})
]

applinks.forEach(page => page.setType(ROUTE_TYPES.FOR_ALL))

adminlinks.forEach(page => page.setType(ROUTE_TYPES.ADMIN_ONLY))

guestLinks.forEach(page => page.setType(ROUTE_TYPES.GUEST_ONLY))

const appRoutes = applinks.concat(adminlinks).concat(guestLinks)

appRoutes.forEach((page, index) => {
   page.loadSubItems(appRoutes)
   page.setOrder(index)
})
console.log('appRoutes', appRoutes)
export default appRoutes