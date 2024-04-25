import { isNumeric,
	formatNumberWithLeadingZeros, tryParseInt
} from '@/utils'
import Errors from '@/common/errors'
import { el } from 'date-fns/locale'

class JudgebookFile {
   constructor(year, category ,num, file, ps = '') {
      this.year = year
      this.category = category
      this.num = num
      this.file = file
      this.ps = ps

      this.errors = new Errors()
   }

   static checkYear(input) {
      let val = input.toString()
      return (isNumeric(val) && val.length < 4 && val.length > 1)
   }
   static isValidNum(input) {
      let val = input.toString()
      return (isNumeric(val) && val.length <= 6)
   }
   static checkNum(input) {
      if(!input) return ''
      let val = input.toString()
      if(isNumeric(val) && val.length <= 6) return formatNumberWithLeadingZeros(tryParseInt(input), 6)
      else return ''
   }
}

export default JudgebookFile