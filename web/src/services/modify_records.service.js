import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/api/modifyRecords`

const fetch = (type, id) => BaseService.fetch(`${source}/${type}/${id}`)

export default { fetch }