import { ROLE_TYPES } from '@/consts'

export const resolveUserFromClaims = (claims) => {
   return {
      id: claims.id,
      email: claims.sub,
      picture: claims.picture,
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
const hasRole = (user, roleName) => {
   if(user.roles && user.roles.length) return user.roles.includes(roleName)
   return false
}
export const isBoss = (user) => hasRole(user, ROLE_TYPES.BOSS)

export const isDev = (user) => hasRole(user, ROLE_TYPES.DEV)

export const isCarManager = (user) => hasRole(user, ROLE_TYPES.CAR_MANAGER)

export const isAdmin = (user) => {
   if(isDev(user)) return true
   if(isBoss(user)) return true
   if(isCarManager(user)) return true
   return false
}

export const getRoleColor = (role) => {
   if(role.name === ROLE_TYPES.BOSS || role.name === ROLE_TYPES.DEV) return 'red'
   else if(role.name === ROLE_TYPES.CAR_MANAGER) return 'red'
   else if(role.name === ROLE_TYPES.CLERK) return 'green'
   else return ''
}