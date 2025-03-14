import { ROUTE_TYPES, ROUTE_NAMES, MENUS, ENTITY_TYPES } from '@/consts'
import { isNullOrEmpty, upperFirstLetter, pluralization } from '@/utils'
import Page from '@/models/page'

const PROP = ENTITY_TYPES.PROP
const ITEM = ENTITY_TYPES.ITEM
const ITEM_REPORT = ENTITY_TYPES.ITEM_REPORT
const ITEM_TRANSACTION = ENTITY_TYPES.ITEM_TRANSACTION

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
   name: ROUTE_NAMES.PROPS,
   path: `/${ROUTE_NAMES.PROPS}`,
   view: `${ROUTE_NAMES.PROPS}/Index`,
   icon: 'mdi-server', 
   title: `${PROP.title}管理`,
   menus: [MENUS.MAIN]
}),
new Page({
   name: ROUTE_NAMES.ITEMS,
   path: `/${ROUTE_NAMES.ITEMS}`,
   view: `${ROUTE_NAMES.ITEMS}/Index`,
   icon: 'mdi-printer',
   title: `${ITEM.title}管理`,
   menus: [MENUS.MAIN],
   parent: ''
}),

//Groups ITEMS
new Page({
   name: ROUTE_NAMES.PROP_DETAILS,
   path: `/${ROUTE_NAMES.PROPS}/:id`,
   view: `${ROUTE_NAMES.PROPS}/Details`,
   icon: '', 
   title: `${PROP.title}管理`,
   menus: [],
   parent: ROUTE_NAMES.PROPS
}),
//Groups ITEMS
new Page({
   name: ROUTE_NAMES.ITEM_REPORTS,
   path: `/${ROUTE_NAMES.ITEMS}/reports`,
   view: `${ROUTE_NAMES.ITEMS}/Reports`,
   icon: 'mdi-google-spreadsheet', 
   title: `${ITEM_REPORT.title}`,
   menus: [MENUS.MAIN],
   parent: ROUTE_NAMES.ITEMS
}),
new Page({
   name: ROUTE_NAMES.ITEM_TRANSACTIONS,
   path: `/${ROUTE_NAMES.ITEMS}/transactions`,
   view: `${ROUTE_NAMES.ITEMS}/Transactions`,
   icon: 'mdi-text-box-check', 
   title: `${ITEM_TRANSACTION.title}`,
   menus: [MENUS.MAIN],
   parent: ROUTE_NAMES.ITEMS
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
   page.loadSubItems(appRoutes)
   page.setOrder(index)
})
export default appRoutes