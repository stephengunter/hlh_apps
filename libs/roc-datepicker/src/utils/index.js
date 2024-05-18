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
"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
export const weekdays_list = [
   { en: 'Sun', cn: '日' },
   { en: 'Mon', cn: '一' },
   { en: 'Tue', cn: '二' },
   { en: 'Wed', cn: '三' },

   { en: 'Thu', cn: '四' },
   { en: 'Fri', cn: '五' },
   { en: 'Sat', cn: '六' }
] 
export const toYearTW = (val) => val - 1911
export const toMonthTW = (en) =>  {
   const month = month_list.find(item => item.en === en)
   return month.cn
}
export const toWeekdayTW = (en) =>  {
   const weekday = weekdays_list.find(item => item.en === en)
   return weekday.cn
}