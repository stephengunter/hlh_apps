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
}),
new Page({
   name: 'doc',
   path: '/doc',
   view: 'Doc',      
   icon: 'mdi-file-document',
   title: '舊公文資料確認-說明',
   menus: [MENUS.MAIN],
   alias: '/'
})
,
new Page({
   name: 'doc-a',
   path: '/doc_a',
   view: 'DocA',      
   icon: 'mdi-file-document',
   title: '舊公文資料確認-A類',
   menus: [MENUS.MAIN],
   alias: '/'
}),
new Page({
   name: 'doc-b',
   path: '/doc_b',
   view: 'DocB',      
   icon: 'mdi-file-document',
   title: '舊公文資料確認-B類',
   menus: [MENUS.MAIN]
}),
new Page({
   name: 'doc-c',
   path: '/doc_c',
   view: 'DocC',      
   icon: 'mdi-file-document',
   title: '舊公文資料確認-C類',
   menus: [MENUS.MAIN]
})
,
new Page({
   name: 'doc-d',
   path: '/doc_d',
   view: 'DocD',      
   icon: 'mdi-file-gavel',
   title: '審判公文，隨卷歸檔',
   menus: [MENUS.MAIN]
})
]

const userlinks = [
// groups
// CALENDARS
new Page({
   name: ROUTE_NAMES.CALENDARS,
   path: `/${ROUTE_NAMES.CALENDARS}/:calendar?/:year?/:month?`,
   view: `${ROUTE_NAMES.CALENDARS}/Index`,
   icon: 'mdi-calendar', 
   title: CALENDAR.title,
   menus: [MENUS.MAIN],
   alias: '/'
}),


// TASKS
new Page({
   name: ROUTE_NAMES.TASKS_INDEX,
   path: `/${ROUTE_NAMES.TASKS_INDEX}`,
   view: `${ROUTE_NAMES.TASKS_INDEX}/Index`,
   icon: 'mdi-note-check-outline', 
   title: TASK.title,
   menus: [MENUS.MAIN]
}),
new Page({
   name: ROUTE_NAMES.TASK_DETAILS,
   path: `/${ROUTE_NAMES.TASKS_INDEX}/:id`,
   view: `${ROUTE_NAMES.TASKS_INDEX}/Details`,
   icon: '', 
   title: TASK.title,
   parent: ROUTE_NAMES.TASKS_INDEX,
   menus: []
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