import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/fetches/records`

const init = () => BaseService.fetch(`${source}/init`)

const fetch = (params) => BaseService.fetch(source, params)

const store = (model) => BaseService.post(source, model)

const upload = (model) => BaseService.post(`${source}/upload`, model)

const download = (model) => BaseService.blob('post', `${source}/download`, model)

const reports = (model) => BaseService.post(`${source}/reports`, model)

const template = (key) => BaseService.blob('post', `${source}/template/${key}`)

export default { init, fetch, store, upload, download, reports, template }
