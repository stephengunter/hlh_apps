import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/open/it/supports`

const init = () => BaseService.fetch(`${source}/init`)

const fetch = (params) => BaseService.fetch(source, params)

const reports = (model) => BaseService.post(`${source}/reports`, model)

const summary_report = (model) => BaseService.post(`${source}/summary_report`, model)

export default { init, fetch, reports, summary_report }