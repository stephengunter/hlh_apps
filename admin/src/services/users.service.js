import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/users`

const fetch = (params) => BaseService.fetch(source, params)

const details = (id) => BaseService.fetch(`${source}/${id}`)

const addPassword = (model) => BaseService.post(`${source}/password`, model)

export default { fetch, details, addPassword }