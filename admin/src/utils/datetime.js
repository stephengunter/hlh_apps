import date from '@/plugins/date'
import moment from 'moment'

const adapter = new date.adapter({ locale: date.locale.zhTW })

export const textToDate = (val) => adapter.date(val)

export const dateToText = (date) => adapter.format(date, "fullDate")

export const isValidDate = (val) => adapter.isValid(val)

export const isSameOrAfter = (start, end) => moment(end).isSameOrAfter(start)