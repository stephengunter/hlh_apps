import { ROUTE_TYPES, ROUTE_NAMES, MENUS, ENTITY_TYPES } from '@/consts'
import { isNullOrEmpty, upperFirstLetter, pluralization } from '@/utils'
import Page from '@/models/page'

const USER = ENTITY_TYPES.USER
const PROFILES = ENTITY_TYPES.PROFILES
const DEPARTMENT = ENTITY_TYPES.DEPARTMENT
const JOB = ENTITY_TYPES.JOB
const LOCATION = ENTITY_TYPES.LOCATION
const KEYIN = ENTITY_TYPES.KEYIN
const CRIMINALS_RECORDS = ENTITY_TYPES.CRIMINALS_RECORDS
const FETCHES_RECORDS = ENTITY_TYPES.FETCHES_RECORDS
const HOST = ENTITY_TYPES.HOST
const SERVER = ENTITY_TYPES.SERVER
const DATABASE = ENTITY_TYPES.DATABASE
const SYSTEM_APP = ENTITY_TYPES.SYSTEM_APP


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
   name: ROUTE_NAMES.CRIMINALS_RECORDS,
   path: `/${ROUTE_NAMES.CRIMINALS_RECORDS}`,
   view: `criminals/Index`,
   icon: 'mdi-text-search',
   title: `${CRIMINALS_RECORDS.title}`,
   menus: [MENUS.MAIN]
}),

new Page({
   name: ROUTE_NAMES.FETCHES_RECORDS,
   path: `/fetches`,
   view: `fetches/Index`,
   icon: 'mdi-api',
   title: `${FETCHES_RECORDS.title}`,
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
new Page({
   name: pluralization(KEYIN.name),
   path: `/${pluralization(KEYIN.name)}`,
   view: `${pluralization(KEYIN.name)}/Index`,
   icon: 'mdi-keyboard-outline', 
   title: `${KEYIN.title},${KEYIN.title} - 個人成績`,
   menus: [MENUS.MAIN]
}),

// IT
new Page({
   name: ROUTE_NAMES.HOSTS,
   path: `/it/${pluralization(HOST.name)}`,
   view: `it/${pluralization(HOST.name)}/Index`,
   icon: 'mdi-server', 
   title: `${HOST.title}管理`,
   menus: [MENUS.MAIN],
   parent: ''
}),
new Page({
   name: ROUTE_NAMES.DATABASES,
   path: `/it/${pluralization(DATABASE.name)}`,
   view: `it/${pluralization(DATABASE.name)}/Index`,
   icon: 'mdi-database', 
   title: `${DATABASE.title}管理`,
   menus: [MENUS.MAIN],
   parent: ''
}),
new Page({
   name: ROUTE_NAMES.SYSTEM_APPS,
   path: `/it/${pluralization(SYSTEM_APP.name)}`,
   view: `it/${pluralization(SYSTEM_APP.name)}/Index`,
   icon: 'mdi-web', 
   title: `${SYSTEM_APP.title}管理`,
   menus: [MENUS.MAIN],
   parent: ''
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
}),
//Groups KEYIN
new Page({
   name: 'keyins-branches',
   path: `/${pluralization(KEYIN.name)}/branches`,
   view: `${pluralization(KEYIN.name)}/Branches`,
   icon: 'mdi-office-building',
   title: `法院成績,${KEYIN.title} - 法院成績`,
   menus: [MENUS.MAIN],
   parent: pluralization(KEYIN.name),
}),

new Page({
   name: 'keyins-passes',
   path: `/${pluralization(KEYIN.name)}/passes`,
   view: `${pluralization(KEYIN.name)}/Passes`,
   icon: 'mdi-check-circle',
   title: `免測人員`,
   menus: [MENUS.MAIN],
   parent: pluralization(KEYIN.name),
}),
//Groups IT/Hosts
new Page({
   name: ROUTE_NAMES.HOST_DETAILS,
   path: `/it/${pluralization(HOST.name)}/:id`,
   view: `it/${pluralization(HOST.name)}/Details`,
   icon: '', 
   title: `${HOST.title}管理`,
   menus: [],
   parent: ROUTE_NAMES.HOST
}),

//Groups IT/Servers
new Page({
   name: pluralization(SERVER.name),
   path: `/it/${pluralization(SERVER.name)}`,
   view: `it/${pluralization(SERVER.name)}/Index`,
   icon: 'mdi-server',
   title: `${SERVER.title}管理`,
   menus: [MENUS.MAIN],
   parent: pluralization(HOST.name),
}),
new Page({
   name: ROUTE_NAMES.SERVER_DETAILS,
   path: `/it/${pluralization(SERVER.name)}/:id`,
   view: `it/${pluralization(SERVER.name)}/Details`,
   icon: '', 
   title: `${SERVER.title}管理`,
   menus: [],
   parent: ROUTE_NAMES.SERVER
}),
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
   page.setSubs(appRoutes.filter(item => item.hasParent(page.name)))
   page.setOrder(index)
})

export default appRoutes