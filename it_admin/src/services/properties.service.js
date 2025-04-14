import BaseService from '@/common/baseService'
import { API_URL } from '@/config'
const source =`${API_URL}/admin/properties`

const init = () => BaseService.fetch(`${source}/init`)

const fetch = (query) => BaseService.fetch(source, query)

const upload = (model) => BaseService.post(`${source}/upload`, model)

const imports = (model) => BaseService.post(`${source}/imports`, model)

const reports = (model) => BaseService.blob('post', `${source}/reports`, model)

export default { init, fetch, upload, imports, reports }