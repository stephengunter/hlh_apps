import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/api/events`

const fetch = (params) => BaseService.fetch(`${source}/${params.calendar}/${params.start}/${params.end}`)

const get = (id) => BaseService.fetch(`${source}/${id}`)

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = (id, model) => BaseService.put(`${source}/${id}`, model)

const remove = (id) => BaseService.remove(`${source}/${id}`)

const fetch_categories = () => BaseService.fetch(`${source}/categories`)


export default { fetch, get, edit, update, remove, fetch_categories }