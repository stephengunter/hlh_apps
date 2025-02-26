import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/keyins/passes`

const fetch = (query) => BaseService.fetch(source, query)

const store = (model) => BaseService.post(source, model)

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = ({ id, model }) => BaseService.put(`${source}/${id}`, model)

const reports = (model) => BaseService.post(`${source}/reports`, model)

const remove = (id) => BaseService.remove(`${source}/${id}`)

export default { fetch, store, edit, update, reports, remove }