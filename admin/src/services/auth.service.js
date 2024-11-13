import BaseService from '@/common/baseService'
import { API_URL } from '@/config'

const source =`${API_URL}/auth`

const login = () => {
   const url = 'https://localhost:44318/connect/token';
   const data = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: 'cars',
      client_secret: '388D45FA-B36B-4988-BA59-B187D329C207'
   })
   const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
   }
   return BaseService.post(url, data, headers)
}

const refreshToken = (id, credentials) => BaseService.put(`${source}/${id}`, credentials)

export default { login, refreshToken }