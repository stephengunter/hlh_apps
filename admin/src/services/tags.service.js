import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/tags`

const fetch = (query) => BaseService.fetch(`${API_URL}/api/tags`, query)

const create = () => BaseService.fetch(`${source}/create`)

const store = (model) => BaseService.post(source, model)

const details = (id) => BaseService.fetch(`${source}/${id}`)

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = (id, model) => BaseService.put(`${source}/${id}`, model)

const remove = (id) => BaseService.remove(`${source}/${id}`)

export default { fetch, create, store, details, edit, update, remove }
