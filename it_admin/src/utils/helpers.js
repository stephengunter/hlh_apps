export const tryParseInt = (val) => val ? parseInt(val) : 0
export const tryParseIntOrNull = (val) => {
   const num = parseInt(val, 10)
   return isNaN(num) ? null : num
}
 
export const isTrue = (val) => {
   if (typeof val === 'boolean') return val
   if (typeof val === 'number') return val > 0
   if (typeof val === 'string') {
      if (val.toLowerCase() === 'true') return true
      if (val === '1') return true
      return false
   }
   return false
}
