import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/jobUserProfiles`

const fetchByUser = (id) => BaseService.fetch(`${source}/user/${id}`)

const fetchByJob = (id) => BaseService.fetch(`${source}/job/${id}`)

const create = (jobId) => BaseService.fetch(`${source}/create/${jobId}`)

const store = (model) => BaseService.post(source, model)

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = (id, model) => BaseService.put(`${source}/${id}`, model)

const off = (model) => BaseService.post(`${source}/off`, model)

const remove = (id) => BaseService.remove(`${source}/${id}`)

export default { fetchByUser, fetchByJob, create, store, edit, update, off, remove }
