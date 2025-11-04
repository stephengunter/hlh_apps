export const ROLE_TYPES = {
   BOSS: 'Boss',
   DEV: 'Dev',
   IT: 'IT',
   CLERK: 'Clerk'
}

export const ROLES = {
   [ROLE_TYPES.BOSS]: {
      name: 'Boss',
      title: '老闆'
   },
   [ROLE_TYPES.DEV]: {
      name: 'Dev',
      title: '開發者'
   },
   [ROLE_TYPES.IT]: {
      name: 'IT',
      title: '資訊人員'
   },
   [ROLE_TYPES.CLERK]: {
      name: 'Clerk',
      title: '書記官'
   }
}