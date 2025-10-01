import { isNumeric, deepClone, rocNumToDateText, rocNumToDate, dateTextToRoc,
	formatNumberWithLeadingZeros, tryParseInt
} from '@/utils'
import Errors from '@/common/errors'
class JudgeCase {
   constructor(courtType, year, category ,num) {
      this.courtType = courtType
      this.year = year
      this.category = category
      this.num = num

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

export default JudgeCase