import { deepClone } from '@/utils'
class FullEvent {
   constructor(model) {
      this.model = deepClone(model)
      
      this.title = model.title
      this.start = model.startDate
      this.end = model.endDate
   }
}

export default FullEvent