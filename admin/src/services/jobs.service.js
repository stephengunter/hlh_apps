import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/jobs`

const fetch = (params) => BaseService.fetch(source, params)

const create = () => BaseService.fetch(`${source}/create`)

const store = (model) => BaseService.post(source, model)

const details = (id) => BaseService.fetch(`${source}/${id}`)

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = (id, model) => BaseService.put(`${source}/${id}`, model)

const off = (model) => BaseService.post(`${source}/off`, model)

const remove = (id) => BaseService.remove(`${source}/${id}`)

export default { fetch, create, store, details, edit, update, off, remove }
