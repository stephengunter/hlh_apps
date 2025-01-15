import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/cryptoes`

const get = ({ type, id }) => BaseService.fetch(`${source}/${type}/${id}`)

export default { get }
