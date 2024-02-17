import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/profiles`

const get = (id) => BaseService.fetch(`${source}/${id}`)

const create = (id) => BaseService.fetch(`${source}/create/${id}`)

const update = (id, model) => BaseService.put(`${source}/${id}`, model)

export default { get, create, update }