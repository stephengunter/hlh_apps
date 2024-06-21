import { ROUTE_TYPES, ROUTE_NAMES, MENUS, ENTITY_TYPES } from '@/consts'
import { isNullOrEmpty, upperFirstLetter, pluralization } from '@/utils'
import Page from '@/models/page'

const TASK = ENTITY_TYPES.TASK
const CALENDAR = ENTITY_TYPES.CALENDAR
const EVENT = ENTITY_TYPES.EVENT

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

const userlinks = [
// groups

new Page({
   name: ROUTE_NAMES.CALENDARS,
   path: `/${ROUTE_NAMES.CALENDARS}/:calendar?/:year?/:month?`,
   view: `${ROUTE_NAMES.CALENDARS}/Index`,
   icon: 'mdi-calendar', 
   title: CALENDAR.title,
   menus: [MENUS.MAIN],
   alias: '/'
}),
new Page({
   name: ROUTE_NAMES.TASKS_INDEX,
   path: `/${ROUTE_NAMES.TASKS_INDEX}`,
   view: `${ROUTE_NAMES.TASKS_INDEX}/Index`,
   icon: 'mdi-note-check-outline', 
   title: TASK.title,
   menus: [MENUS.MAIN],
   alias: '/'
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
}),
new Page({
   name: ROUTE_NAMES.AUTHTOKEN,
   path: `/${ROUTE_NAMES.AUTHTOKEN}/:username/:token/:provider`,
   view: `${upperFirstLetter(ROUTE_NAMES.AUTHTOKEN)}`,
   icon: '',
   title: '系統登入',
   menus: []
})
]

applinks.forEach(page => page.setType(ROUTE_TYPES.FOR_ALL))

userlinks.forEach(page => page.setType(ROUTE_TYPES.ADMIN_ONLY))

guestLinks.forEach(page => page.setType(ROUTE_TYPES.GUEST_ONLY))

const appRoutes = applinks.concat(userlinks).concat(guestLinks)

appRoutes.forEach((page, index) => {
   page.setSubs(appRoutes.filter(item => item.hasParent(page.name)))
   page.setOrder(index)
})

export default appRoutes