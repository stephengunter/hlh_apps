import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/users`

const fetch = (params) => BaseService.fetch(source, params)

const create = () => BaseService.fetch(`${source}/create`)

const store = (model) => BaseService.post(`${source}`, model)

const roles = () => BaseService.fetch(`${source}/roles`)

const importing  = (model) => BaseService.post(`${source}/import`, model)

const details = (id) => BaseService.fetch(`${source}/${id}`)

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = (model) => BaseService.put(`${source}/${model.id}`, model)

const addPassword = (model) => BaseService.post(`${source}/password`, model)

export default { fetch, create, store, roles, importing, details, edit, update, addPassword }