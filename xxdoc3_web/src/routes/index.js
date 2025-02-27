import { createRouter, createWebHistory } from 'vue-router'
import appRoutes from './app'
import store from '@/store'

import { ROUTE_TYPES, ROUTE_NAMES } from '@/consts'
import { APP_CLOSED } from '@/config'
import { CHECK_AUTH, REFRESH_TOKEN, GET_MENUS } from '@/store/actions.type'
import { SET_ROUTE, CLEAR_ERRORS, PURGE_AUTH } from '@/store/mutations.type'

const history = createWebHistory(process.env.BASE_URL)
const routes = appRoutes.map(item => {
	let parts = item.view.split('/')
	if (parts.length === 3) {
		return {
			...item,
			component: () => import(`@/views/${parts[0]}/${parts[1]}/${parts[2]}.vue`)
		}
	}
	else if (parts.length === 2) {
		return {
			...item,
			component: () => import(`@/views/${parts[0]}/${parts[1]}.vue`)
		}
	} else {
		const path = `@/views/${item.view}.vue`
		return {
			...item,
			component: () => import(`@/views/${item.view}.vue`)
		}
	}
})


const redirect = (next, route) => next(route)

const authDone = (next, to, auth = false) => {
	//const utmSource = sessionStorage.getItem("source") || "Unknown";

	store.dispatch(GET_MENUS, auth)
	return next()
}
// const refreshToken = (next, to) => {
// 	store.dispatch(REFRESH_TOKEN)
// 		.then(token => {
// 			if (token) return redirect(next, { path: to.path })
// 			else return redirect(next, { path: '/login' })
// 		})
// }

const router = createRouter({
	history, routes
})


router.beforeEach((to, from, next) => {
	if (APP_CLOSED && to.name !== ROUTE_NAMES.CLOSE) return redirect(next, { name: ROUTE_NAMES.CLOSE })
	// if(to.path === '/') {
	// 	const urlParams = new URLSearchParams(window.location.search)
  	// 	const source = urlParams.get('source')
	// 	if (source) {
	// 		sessionStorage.setItem('source', source);
	// 	}
	// }

	store.commit(SET_ROUTE, { to: appRoutes.find(page => page.name === to.name), from: appRoutes.find(page => page.name === from.name) })
	store.commit(CLEAR_ERRORS)
	console.log('beforeEach')
	store.dispatch(CHECK_AUTH).then(auth => {
		if (to.meta.type === ROUTE_TYPES.FOR_ALL) return authDone(next, to, auth)

		if (auth) {
			if (to.name === ROUTE_NAMES.LOGIN) return authDone(next, to, auth)
			if (to.meta.type === ROUTE_TYPES.GUEST_ONLY) return redirect(next, { path: '/' })
			return authDone(next, to, auth)
		} else {
			//無token
			if (to.meta.type === ROUTE_TYPES.GUEST_ONLY) return authDone(next, to, auth)
			else {
				let query = { ...to.query, returnUrl: to.path }
				return redirect(next, { name: ROUTE_NAMES.LOGIN, query })
			}
		}
	})
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
	if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
		if (!localStorage.getItem('vuetify:dynamic-reload')) {
			console.log('Reloading page to fix dynamic import error')
			localStorage.setItem('vuetify:dynamic-reload', 'true')
			location.assign(to.fullPath)
		} else {
			console.error('Dynamic import error, reloading page did not fix it', err)
		}
	} else {
		console.error(err)
	}
})

router.isReady().then(() => {
	localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
