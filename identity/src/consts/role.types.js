export const ROLE_TYPES = {
   BOSS: 'Boss',
   DEV: 'Dev',
   CLERK: 'Clerk',
   CAR_MANAGER: 'CarManager'
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
   [ROLE_TYPES.CLERK]: {
      name: ROLE_TYPES.CLERK,
      title: '書記官'
   },
   
   [ROLE_TYPES.CAR_MANAGER]: {
      name: ROLE_TYPES.CAR_MANAGER,
      title: '書記官'
   }
}