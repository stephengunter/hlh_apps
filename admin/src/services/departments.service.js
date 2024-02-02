import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/departments`

const fetch = (params) => BaseService.fetch(source, params)

const create = (parentId) => BaseService.fetch(`${source}/create/${parentId}`)

const store = (model) => BaseService.post(source, model)

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = (id, model) => BaseService.put(`${source}/${id}`, model)

const off = (model) => BaseService.post(`${source}/off`, model)

const remove = (id) => BaseService.remove(`${source}/${id}`)

const orders = (model) => BaseService.put(`${source}`, model)

export default { fetch, create, store, edit, update, off, remove, orders }
