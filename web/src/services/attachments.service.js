import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/api/attachments`

const temp = (form) => BaseService.post(`${source}/temp`, form)


export default { temp }