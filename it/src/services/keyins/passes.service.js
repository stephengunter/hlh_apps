import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/open/keyins/passes`

const fetch = (query) => BaseService.fetch(source, query)

const create = () => BaseService.fetch(`${source}/create`)

const store = (model) => BaseService.post(source, model)

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = ({ id, model }) => BaseService.put(`${source}/${id}`, model)

const reports = (model) => BaseService.post(`${source}/reports`, model)

const remove = (id) => BaseService.remove(`${source}/${id}`)

export default { fetch, create, store, edit, update, reports, remove }