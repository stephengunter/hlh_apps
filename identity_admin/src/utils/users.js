import { ROLE_TYPES } from '@/consts'

export const resolveUserFromClaims = (claims) => {
   return {
      id: claims.sub,
      email: claims.email,
      name: claims.name,
      roles: claims.roles ? claims.roles.split(',') : []
   }
}


export const shortName = (user) => {
   let name = user.name ? user.name : user.email
   if(!name) return ''
   let words = name.split(' ')
   if(words.length === 1) return words[0].substr(0, 2).toUpperCase()
   else return `${words[0].substr(0, 1).toUpperCase()}${words[1].substr(0, 1).toUpperCase()}`   
}

export const isBoss = (user) => {
   if(user.roles && user.roles.length) return user.roles.includes(ROLE_TYPES.BOSS)
   return false
}

export const isDev = (user) => {
   if(user.roles && user.roles.length) return user.roles.includes(ROLE_TYPES.DEV)
   return false
}


export const isAdmin = (user) => {
   if(isDev(user)) return true
   return isBoss(user)
}

export const getRoleColor = (role, key = 'name') => {
   if(role[key] === ROLE_TYPES.BOSS || role[key] === ROLE_TYPES.DEV) return 'red'
   else if(role[key] === ROLE_TYPES.IT) return 'info'
   else return ''
}