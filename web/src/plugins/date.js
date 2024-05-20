import DateFnsAdapter from '@date-io/date-fns'
import zhTW from 'date-fns/locale/zh-TW'
console.log(zhTW.localize.era)
export default {
   adapter: DateFnsAdapter,
   locale: {
      zhTW
   }
}