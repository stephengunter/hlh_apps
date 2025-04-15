import BaseService from '@/common/baseService'
import { API_URL } from '@/config'
const source =`${API_URL}/admin/properties`

const init = () => BaseService.fetch(`${source}/init`)

const fetch = (query) => BaseService.fetch(source, query)

const upload = (model) => BaseService.post(`${source}/upload`, model)

const imports = (model) => BaseService.post(`${source}/imports`, model)

const reports = (model) => BaseService.blob('post', `${source}/reports`, model)

const remove = (id) => BaseService.remove(`${source}/${id}`)

const editCategory = (id) => BaseService.fetch(`${source}/editCategory/${id}`)

const removeCategory = (id) => BaseService.remove(`${source}/removeCategory/${id}`)

export default { init, fetch, upload, imports, reports, remove, editCategory, removeCategory }