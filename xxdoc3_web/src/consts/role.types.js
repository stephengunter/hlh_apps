export const ROLE_TYPES = {
   BOSS: 'Boss',
   DEV: 'Dev',
   CLERK: 'Clerk',
   IT: 'IT',
}

export const ROLES = {
   [ROLE_TYPES.BOSS]: {
      name: ROLE_TYPES.BOSS,
      title: '老闆'
   },
   [ROLE_TYPES.DEV]: {
      name: ROLE_TYPES.DEV,
      title: '開發者'
   },
   [ROLE_TYPES.IT]: {
      name: ROLE_TYPES.IT,
      title: '資訊人員'
   },
   [ROLE_TYPES.CLERK]: {
      name: ROLE_TYPES.CLERK,
      title: '書記官'
   }
}