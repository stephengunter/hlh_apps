import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/api/references`

const store = (model) => BaseService.post(`${source}`, model)

const get = (id) => BaseService.fetch(`${source}/${id}`)


export default { store, get }