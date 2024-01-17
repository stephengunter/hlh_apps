import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/passwords`

const store = (model) => BaseService.post(source, model)

const update = (id, model) => BaseService.put(`${source}/${id}`, model)

export default { store, update }