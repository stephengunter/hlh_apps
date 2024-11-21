import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/admin/it/credentialPassword`

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`)

const update = (model) => BaseService.put(`${source}/${model.id}`, model)

export default { edit, update }
