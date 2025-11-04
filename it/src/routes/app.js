import { ROUTE_TYPES, ROUTE_NAMES, MENUS, ENTITY_TYPES } from '@/consts'
import { isNullOrEmpty, upperFirstLetter, pluralization } from '@/utils'
import Page from '@/models/page'

const USER = ENTITY_TYPES.USER
const KEYIN = ENTITY_TYPES.KEYIN

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
   menus: [],
   alias: '/'
}),
new Page({
   name: pluralization(KEYIN.name),
   path: `/${pluralization(KEYIN.name)}`,
   view: `${pluralization(KEYIN.name)}/Index`,
   icon: 'mdi-keyboard-outline', 
   title: `${KEYIN.title},${KEYIN.title} - 個人成績`,
   menus: [MENUS.MAIN]
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
   name: 'keyins-persons',
   path: `/${pluralization(KEYIN.name)}/persons`,
   view: `${pluralization(KEYIN.name)}/Persons`,
   icon: 'mdi-check-circle',
   title: `聽打人員`,
   menus: [MENUS.MAIN],
   parent: pluralization(KEYIN.name),
}),
new Page({
   name: 'keyins-notes',
   path: `/${pluralization(KEYIN.name)}/notes`,
   view: `${pluralization(KEYIN.name)}/Notes`,
   icon: 'mdi-help',
   title: `聽打成績使用說明`,
   menus: [MENUS.MAIN],
   parent: pluralization(KEYIN.name),
}),


new Page({
   name: ROUTE_NAMES.FIXES,
   path: `/${ROUTE_NAMES.FIXES}`,
   view: `${upperFirstLetter(ROUTE_NAMES.FIXES)}`,
   icon: 'mdi-wrench',
   title: '設備換修',
   menus: [MENUS.MAIN]
}),
new Page({
   name: ROUTE_NAMES.SUPPORTS,
   path: `/${ROUTE_NAMES.SUPPORTS}`,
   view: `${upperFirstLetter(ROUTE_NAMES.SUPPORTS)}`,
   icon: 'mdi-handshake',
   title: '服務紀錄',
   menus: [MENUS.MAIN]
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
export default appRoutes