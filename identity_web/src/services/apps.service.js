import BaseService from '@/common/baseService'
import { API_URL } from '@/config'
const source =`${API_URL}/api/users`

const fetch = (query) => BaseService.fetch(source, query)

export default { fetch }