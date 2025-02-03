import BaseService from '@/common/baseService'
import { API_URL } from '@/config'
const source =`${API_URL}/admin/apps`

const init = () => BaseService.fetch(`${source}/init`)

const fetch = (query) => BaseService.fetch(source, query)

const create = () => BaseService.fetch(`${source}/create`)

const store = (model) => BaseService.post(source, model)

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = ({ id, model }) => BaseService.put(`${source}/${id}`, model)

export default { init, fetch, create, store, edit, update }