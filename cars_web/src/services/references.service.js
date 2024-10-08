import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/api/references`

const store = (model) => BaseService.post(`${source}`, model)

const get = (id) => BaseService.fetch(`${source}/${id}`)

const update = (id, model) => BaseService.put(`${source}/${id}`, model)

const remove = (id) => BaseService.remove(`${source}/${id}`)


export default { store, get, update, remove }