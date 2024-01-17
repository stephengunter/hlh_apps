import { isEmptyObject } from './objects'
import { tryParseInt, isTrue } from './helpers'

export const copyFromQuery = (params, query) => {
   for(const [key, value] of Object.entries(params)) {
      if(query.hasOwnProperty(key)) {
         if(typeof value === 'number') {
            params[key] = tryParseInt(query[key])
         }else if(typeof value === 'boolean') {
            params[key] = isTrue(query[key])
         }else params[key] = query[key]
		}
	}
}

export const buildQuery = (url, params) => {
   if(!params || isEmptyObject(params)) return url
   url += '?'
   for (let field in params) {
      let value = params[field]
      url += `${field}=${value}&`
   }
   return url.substr(0, url.length - 1)
}