import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/api/files/judgebooks`

const fetch = (params) => BaseService.fetch(source, params)

const get = (id) => BaseService.fetch(`${source}/${id}`)

const upload = (form) => BaseService.post(`${source}/upload`, form)

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = (id, model) => BaseService.put(`${source}/${id}`, model)

const download = (id) => BaseService.fetch(`${source}/download/${id}`)

const review = (ids) => BaseService.fetch(`${source}/review/${ids}`)

const submit_review = (models) => BaseService.post(`${source}/review`, models)

const remove = (id) => BaseService.remove(`${source}/${id}`)

const fetch_types = () => BaseService.fetch(`${source}/types`)


export default { fetch, get, upload, edit, update, download, review, submit_review, remove, fetch_types }