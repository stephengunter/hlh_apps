import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/api/articles`

const fetch = (params) => BaseService.fetch(source, params)

const get = (id) => BaseService.fetch(`${source}/${id}`)

export default { fetch, get }