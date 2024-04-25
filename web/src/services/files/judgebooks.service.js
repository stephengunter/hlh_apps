import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/api/files/judgebooks`

const fetch = (params) => BaseService.fetch(source, params)

const get = (id) => BaseService.fetch(`${source}/${id}`)

const upload = (form) => BaseService.post(`${source}/upload`, form)

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = (id, model) => BaseService.put(`${source}/${id}`, model)

const download = (id) => BaseService.blob('get', `${source}/download/${id}`)

const remove = (id) => BaseService.remove(`${source}/${id}`)

export default { fetch, get, upload, edit, update, download, remove }