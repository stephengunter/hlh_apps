import date from '@/plugins/date'
import { el } from 'date-fns/locale'
import moment from 'moment'

const adapter = new date.adapter({ locale: date.locale.zhTW })

export const now = () => adapter.date()

export const addHours = (date, hours) => moment(date).add(hours, 'hours').toDate()

export const initByDate = (date, h = 0, m = 0) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m)

export const textToDate = (val) => adapter.date(val)

export const dateToText = (date, opt = 'fullDate') => adapter.format(date, opt)

export const datetimeText = (date) => moment(date).format('YYYY-MM-DD HH:MM:SS')

export const getTimeString = (date) => {
   let hour = '00'
   let minutes = '00'
   let h = date.getHours()
   let m = date.getMinutes()
   if(h) {
      if(h < 10) hour = `0${h}`
      else hour = h.toString()
   }
   if(m) {
      if(m < 10) minutes = `0${m}`
      else minutes = m.toString()
   }
   return `${hour}:${minutes}`
}

export const isValidDate = (val) => adapter.isValid(val)

export const isSameDate = (date, other) => moment(other).isSame(date)

export const isSameDay = (start, end) => moment(end).isSame(start, 'day')

export const isSameOrAfter = (start, end) => moment(end).isSameOrAfter(start)

export const month_list = [
   { en: 'Jan', cn: '1月' },
   { en: 'Feb', cn: '2月' },
   { en: 'Mar', cn: '3月' },
   { en: 'Apr', cn: '4月' },

   { en: 'May', cn: '5月' },
   { en: 'Jun', cn: '6月' },
   { en: 'Jul', cn: '7月' },
   { en: 'Aug', cn: '8月' },

   { en: 'Sep', cn: '9月' },
   { en: 'Oct', cn: '10月' },
   { en: 'Nov', cn: '11月' },
   { en: 'Dec', cn: '12月' }
]

export const weekdays_list = [
   { en: 'Sun', cn: '日' },
   { en: 'Mon', cn: '一' },
   { en: 'Tue', cn: '二' },
   { en: 'Wed', cn: '三' },

   { en: 'Thu', cn: '四' },
   { en: 'Fri', cn: '五' },
   { en: 'Sat', cn: '六' }
] 


export const rocNumToDate = (num) => {
   let text = rocNumToDateText(num)
   if(text) return textToDate(text)
   return null 
}

export const rocNumToDateText = (input, rocDate = false) => {
   if(!input) return '' 
   let dateString = input.toString()
   let parts = []
   if(dateString.length === 6) {
      parts = [dateString.slice(0, 2), dateString.slice(2, 4), dateString.slice(4, 6)]
   }else if (dateString.length === 7) {
      parts = [dateString.slice(0, 3), dateString.slice(3, 5), dateString.slice(5, 7)]
   }
   if(parts.length) {
      if(rocDate)  return `${parts[0]}-${parts[1]}-${parts[2]}`

      const year = parseInt(parts[0]) + 1911
      return `${year}-${parts[1]}-${parts[2]}`
   } 
   return '' 
}

export const dateTextToRoc = (text, cn = false) => {
   if(text) {
      let parts = text.split('-')
      parts[0] = parseInt(parts[0]) - 1911
      if(cn) return `${parts[0]}年${parseInt(parts[1])}月${parseInt(parts[2])}日`
      return `${parts[0]}-${parts[1]}-${parts[2]}`
   }
   return ''
}
export const dateToRocFormat = (date, time = false) => {
   const year = toYearTW(date.getFullYear())
   const month = date.getMonth() + 1
   const day = date.getDate()
   const dStr = `${year}年${month}月${day}日`
   if(!time) return dStr
   return `${dStr} ${getTimeString(date)}`
}

export const getDatePickerModel = (date, roc = false) => {
   if(date) {
      if(date instanceof Date) {
         let text = dateToText(date)
         let text_cn =  dateTextToRoc(text)
         let num = dateToNumber(date, roc)
         return {
            text,
            text_cn,
            num
         }
      }else {
         if(isValidDate(date)) return getDatePickerModel(new Date(date), roc)
         else return getDatePickerModel(null)
      }
      
   }
   return {
         text: '',
         text_cn: '',
         num: 0
      }
   
}

export const dateToNumber = (date, roc = false) => {
   let year = date.getFullYear()
   let month = date.getMonth() + 1
   let day = date.getDate()

   if(roc) year = year - 1911
   const str_y = year.toString()
   const str_m = month < 10 ? `0${month}` : month.toString()
   const str_d = day < 10 ? `0${day}` : day.toString()
   
   return parseInt(`${str_y}${str_m}${str_d}`)
}

export const toYearTW = (val) => val - 1911
export const toMonthTW = (en) =>  {
   const month = month_list.find(item => item.en === en)
   return month.cn
}
export const toWeekdayTW = (en) =>  {
   const weekday = weekdays_list.find(item => item.en === en)
   return weekday.cn
}

export const initRangeHoursMinutes = () => {
   return {
      hours_allow: [...Array(24).keys()].filter(num => num >= 6 && num <= 22),
      minutes_allow: [...Array(60).keys()].filter(num => num % 5 === 0)
   }
}