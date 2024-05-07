import { isNumeric,
	formatNumberWithLeadingZeros, tryParseInt
} from '@/utils'
import Errors from '@/common/errors'

class JudgebookFile {
   constructor(typeId, fileNumber, courtType, year, category ,num, file, ps = '') {
      this.typeId = typeId
      this.fileNumber = fileNumber
      this.courtType = courtType
      this.year = year
      this.category = category
      this.num = num
      this.file = file
      this.ps = ps

      this.errors = new Errors()
   }
   static checkFileNumber(input) {
      let val = input.toString()
      return true
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