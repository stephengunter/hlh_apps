import { isNumeric, deepClone,
	formatNumberWithLeadingZeros, tryParseInt
} from '@/utils'
import Errors from '@/common/errors'

class JudgebookFile {
   constructor(type, judgeDate, fileNumber, originType, courtType, year, category ,num, file, ps = '') {
      if(type) {
         this.type = deepClone(type)
         this.typeId = type.id
      }else {
         this.type = null
         this.typeId = 0
      }
      this.judgeDate = judgeDate
      this.originType = originType
      this.courtType = courtType
      this.fileNumber = fileNumber
      this.courtType = courtType
      this.year = year
      this.category = category
      this.num = num
      this.file = file
      this.ps = ps

      this.errors = new Errors()
   }
   static checkJudgeDate(input) {
      // let val = input.toString()
      // if(val.length < 6 || val.length > 7)  return false
      return true
   }
   static checkType(type) {
      if(type.id && type.key)  return true
      return false
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