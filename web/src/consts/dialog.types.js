export const ERRORS = 'errors'
export const WARNING = 'warning'
export const SUCCESS = 'success'
export const INFO = 'info'
export const SERVER_ERROR = 'server-error'
export const ICONS = {
   [ERRORS]: 'mdi-alert-circle',
   [WARNING]: 'mdi-alert',
   [SUCCESS]: 'mdi-check-circle',
   [INFO]: 'mdi-information'
}
export const DIALOG_TITLE = {
   [ERRORS]: '發生錯誤'
}
export const DIALOG_MESSAGE = {
   [ERRORS]: '處理您的要求時發生錯誤，請稍候再試.',
   [SERVER_ERROR]: '伺服器暫時無回應，請稍候再試.'
}