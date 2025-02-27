import axios from 'axios'
import { buildQuery } from '@/utils'

const setHeader = (token) => {
	if(token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
	else axios.defaults.headers.common['Authorization'] = null	
}

const fetch = (url, query) => new Promise((resolve, reject) => {
	axios.get(buildQuery(url, query))
	.then(response => resolve(response.data))
	.catch(error => reject(error.response))
})

// const submit = (requestType, url, data) => new Promise((resolve, reject) => {
// 	axios[requestType](url, data)
// 	.then(response => resolve(response.data))
// 	.catch(error => reject(error.response))
// })
const submit = (requestType, url, data, headers = {}) => 
	new Promise((resolve, reject) => {
	axios({
			method: requestType,
			url: url,
			data: data,
			headers: headers
	})
	.then(response => resolve(response.data))
	.catch(error => reject(error.response));
})

const blob = (requestType, url, data) => new Promise((resolve, reject) => {
	axios[requestType](url, data, { responseType: 'blob' })
	.then(response => resolve(response.data))
	.catch(error => reject(error.response))
})

const post = (url, data, headers = {}) => submit('post', url, data)

const put = (url, data, headers = {}) => submit('put', url, data)

const remove = (url, data, headers = {}) => submit('delete', url, data)

export default { setHeader, fetch, submit, post, put, remove, blob }