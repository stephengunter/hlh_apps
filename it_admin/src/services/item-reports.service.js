import BaseService from '@/common/baseService'
import { API_URL } from '@/config'
const source =`${API_URL}/admin/itemReports`

const init = () => BaseService.fetch(`${source}/init`)

const fetch = (query) => BaseService.fetch(source, query)

const create = () => BaseService.fetch(`${source}/create`)

const store = (model) => BaseService.post(source, model)

const details = (id) => BaseService.fetch(`${source}/${id}`)

const update = ({ id, model }) => BaseService.put(`${source}/${id}`, model)

const remove = (id) => BaseService.remove(`${source}/${id}`)

export default { init, fetch, create, store, details, update, remove }