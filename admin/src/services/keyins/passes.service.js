import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/keyins/passes`

const fetch = () => BaseService.fetch(source)

const upload = (model) => BaseService.post(`${source}/upload`, model)

const store = (model) => BaseService.post(source, model)

const reports = (model) => BaseService.post(`${source}/reports`, model)

export default { fetch, upload, store, reports }