import BaseService from '@/common/baseService'
import { API_URL } from '@/config'
const source =`${API_URL}/api/receives`

const init = () => BaseService.fetch(`${source}/init`)

const fetch = (query) => BaseService.fetch(source, query)

const details = (id) => BaseService.fetch(`${source}/${id}`)

export default { init, fetch, details }