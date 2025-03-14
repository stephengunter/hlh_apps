import BaseService from '@/common/baseService'
import { API_URL } from '@/config'
const source =`${API_URL}/admin/users`

const fetch = () => BaseService.fetch(source)

export default { fetch }