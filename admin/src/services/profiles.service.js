import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/profiles`

const get = (id) => BaseService.fetch(`${source}/${id}`)

const update = (id, model) => BaseService.put(`${source}/${id}`, model)

export default { get, update }