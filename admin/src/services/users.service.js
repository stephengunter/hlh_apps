import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/users`

const init = () => BaseService.fetch(`${source}/init`)

const fetch = (query) => BaseService.fetch(source, query)

const create = () => BaseService.fetch(`${source}/create`)

const store = (model) => BaseService.post(`${source}`, model)

const roles = () => BaseService.fetch(`${source}/roles`)

const sync  = (model) => BaseService.post(`${source}/sync`, model)

const details = (id) => BaseService.fetch(`${source}/${id}`)

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = (model) => BaseService.put(`${source}/${model.id}`, model)

const addPassword = (model) => BaseService.post(`${source}/password`, model)

export default { init, fetch, create, store, roles, sync, details, edit, update, addPassword }