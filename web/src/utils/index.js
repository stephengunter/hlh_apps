import { ERRORS, WARNING, SUCCESS } from '@/consts'

export const resolveErrorData = (error) => {
   if(error) {
      if(error.status && error.status === 400) return error.data
   }
   return null
}

export const onErrors = (error) => Bus.emit(ERRORS, error)

export const onSuccess = (msg) => Bus.emit(SUCCESS, msg)

export const onWarning = (msg) => Bus.emit(WARNING, msg)


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
export * from './cn'
export * from './emoji'
export * from './helpers'
export * from './html'
export * from './inputs'
export * from './objects'
export * from './query'
export * from './ui'
export * from './users'
export * from './validators'
export * from './vuex'