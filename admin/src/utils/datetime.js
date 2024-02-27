import date from '@/plugins/date'

const adapter = new date.adapter({ locale: date.locale.zhTW })

export const textToDate = (val) => adapter.date(val)

export const dateToText = (date) => adapter.format(date, "fullDate")

export const isValidDate = (val) => adapter.isValid(val)