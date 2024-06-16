import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/api/events`

const fetch = ({ calendar, start, end }) => BaseService.fetch(`${source}/${calendar}/${start}/${end}`)

const create = (params) => BaseService.fetch(`${source}/create`, params)

const store = (model) => BaseService.post(`${source}`, model)

const details = (id) => BaseService.fetch(`${source}/${id}`)

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = (id, model) => BaseService.put(`${source}/${id}`, model)

const remove = (id) => BaseService.remove(`${source}/${id}`)

const fetch_categories = () => BaseService.fetch(`${source}/categories`)


export default { fetch, create, store, details, edit, update, remove, fetch_categories }