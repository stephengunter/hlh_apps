import { ROUTE_TYPES, ROUTE_NAMES, MENUS, ENTITY_TYPES } from '@/consts'
import { isNullOrEmpty, upperFirstLetter, pluralization } from '@/utils'
import Page from '@/models/page'

const APP = ENTITY_TYPES.APP
const POST = ENTITY_TYPES.POST
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

const userlinks = [
new Page({
   name: ROUTE_NAMES.POSTS,
   path: `/posts`,
   view: `posts/Index`,
   icon: 'mdi-send', 
   title: `寄件備份`,
   menus: [MENUS.MAIN],
   alias: '/'
}),
new Page({
   name: ROUTE_NAMES.RECEIVES,
   path: `/receives`,
   view: `receives/Index`,
   icon: 'mdi-email-arrow-left-outline', 
   title: `收件匣`,
   menus: [MENUS.MAIN]
}),

//Groups Posts
new Page({
   name: ROUTE_NAMES.POST_DETAILS,
   path: '/posts/:id',
   view: 'posts/Details',
   icon: '', 
   title: `檢視內容`,
   menus: [],
   parent: ROUTE_NAMES.POSTS
}),
//Groups Receives
new Page({
   name: ROUTE_NAMES.RECEIVE_DETAILS,
   path: '/receives/:id',
   view: 'receives/Details',
   icon: '', 
   title: `檢視內容`,
   menus: [],
   parent: ROUTE_NAMES.POSTS
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

userlinks.forEach(page => page.setType(ROUTE_TYPES.USER_ONLY))

guestLinks.forEach(page => page.setType(ROUTE_TYPES.GUEST_ONLY))

const appRoutes = applinks.concat(userlinks).concat(guestLinks)

appRoutes.forEach((page, index) => {
   page.loadSubItems(appRoutes)
   page.setOrder(index)
})
export default appRoutes