import { ERRORS, WARNING, SUCCESS, BAD_REQUEST, DIALOG_TITLE, DIALOG_MESSAGE } from '@/consts'
import { SHOW_CONFIRM, HIDE_CONFIRM } from '@/store/actions.type'
export const resolveErrorData = (error) => {
   if(!error) return null
   if(!error.hasOwnProperty('status')) return null
   if(error.status !== 400) return null
   if(!error.hasOwnProperty('data')) return null
   return error.data
}
export const badRequest = (title = DIALOG_TITLE[BAD_REQUEST], text = DIALOG_MESSAGE[BAD_REQUEST]) => onErrors({
   status: 400, title, text
})

export const onErrors = (error) => {
   const errors = resolveErrorData(error)
   if(errors) Bus.emit(ERRORS, errors)
   else console.log(error)
}

export const onSuccess = (msg) => Bus.emit(SUCCESS, msg)

export const onWarning = (msg) => Bus.emit(WARNING, msg)

export const showConfirm = (confirm) => Bus.emit(SHOW_CONFIRM, confirm)

export const hideConfirm = () => Bus.emit(HIDE_CONFIRM)



export const uuid = (len = 8, radix = 16) => {
   let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
   let uuid = [], i
   radix = radix || chars.length

   if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix]
   }else {
      // rfc4122, version 4 form
      let r

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
         if (!uuid[i]) {
            r = 0 | Math.random()*16
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
         }
      }
   }

   return uuid.join('')

}



export * from './arrays'
export * from './categories'
export * from './cn'
export * from './emoji'
export * from './helpers'
export * from './html'
export * from './inputs'
export * from './objects'
export * from './pager'
export * from './query'
export * from './sorting'
export * from './ui'
export * from './users'
export * from './validators'
export * from './vuex'