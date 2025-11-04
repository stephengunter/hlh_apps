import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/open/it/fixes`

const init = () => BaseService.fetch(`${source}/init`)

const fetch = (params) => BaseService.fetch(source, params)

const reports = (model) => BaseService.post(`${source}/reports`, model)

export default { init, fetch, reports }