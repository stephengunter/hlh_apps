import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/it/databases`

const fetch = (query) => BaseService.fetch(source, query)

const create = () => BaseService.fetch(`${source}/create`)

const store = (model) => BaseService.post(source, model)

const details = (id) => BaseService.fetch(`${source}/${id}`)

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = (model) => BaseService.put(`${source}/${model.id}`, model)

const remove = (id) => BaseService.remove(`${source}/${id}`)

export default { fetch, create, store, details, edit, update, remove }