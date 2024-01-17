import { ROUTE_TYPES, ROUTE_NAMES } from '@/consts'

const applinks = [{
   name: 'home',
   path: '/',
   view: 'Home',
   parent: '',
   meta: {
      order: 0,
      icon: 'mdi-home',
      title: '首頁',
      menu: true
   } 
},{
   name: 'games',
   path: '/games',
   view: 'Games',
   parent: '',
   meta: {
      order: 0,
      icon: 'mdi-puzzle',
      title: '小遊戲',
      menu: true
   } 
},{
   name: 'tools',
   path: '/tools',
   view: 'Tools',
   parent: '',
   meta: {
      order: 0,
      icon: 'mdi-tools',
      title: '工具箱',
      menu: true
   } 
},{
   name: ROUTE_NAMES.ARTICLE_DETAILS,
   path: '/article/:id',
   view: 'Article',
   parent: '',
   meta: {
      order: 0,
      icon: '',
      title: '',
      menu: false
   } 
}]

const guestLinks = [{
   name: 'login',
   path: '/login',
   view: 'Login',
   parent: 'Dashboard',
   meta: {
      icon: 'mdi-login-variant',
      title: 'Login',
      menu: true
   } 
}]

const adminlinks = []

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

for(let i = 0; i < appRoutes.length; i++){
   appRoutes[i].meta.order = i
}

export default appRoutes