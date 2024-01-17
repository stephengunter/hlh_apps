import { MENUS } from '@/consts'

export const isSmallScreen = () => window.innerWidth < 991

export const scrollToTop = () => {
   let element = document.getElementById('app')
   if(!element) return

   element.scrollIntoView()
}

export const activeOptions = [{
   value: true,
   text: '上架中'
},{
   value: false,
   text: '已下架'
}]

export const statusText = (active) => active ? '上架中' : '已下架'


export const isMainMenuItem = (item) => item.meta.hasOwnProperty('menus') && item.meta.menus.includes(MENUS.MAIN)

export const hasParent = (item) => item.meta.hasOwnProperty('parent') 

export const getSubitems = (item) => item.meta.hasOwnProperty('subs') ? item.meta.subs : []

