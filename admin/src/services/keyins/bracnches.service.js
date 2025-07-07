import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/keyins/branches`

const init = () => BaseService.fetch(`${source}/init`)

const fetch = (params) => BaseService.fetch(source, params)

const download = () => BaseService.blob('post', `${source}/download`)

const upload = (model) => BaseService.post(`${source}/upload`, model)

const store = (model) => BaseService.post(source, model)

const reports = (model) => BaseService.post(`${source}/reports`, model)

export default { init, fetch, download, upload, store, reports }
