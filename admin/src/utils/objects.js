import { cloneDeep } from 'lodash'

export const deepClone = (obj) => cloneDeep(obj)

export const getListFromObj = (obj) => {
   const list = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            list.push({ title :key, value })
        }
    }
    return list
}

export const setValues = (source, dest) => {
   for(const [key, value] of Object.entries(source)) {
		if(dest.hasOwnProperty(key)) {
			dest[key] = value
		}
	}
}

export const isEmptyObject = (obj) => {
   if (obj == null) return true;

   // Assume if it has a length property with a non-zero value
   // that that property is correct.
   if (obj.length > 0)    return false;
   if (obj.length === 0)  return true;

   // If it isn't an object at this point
   // it is empty, but it can't be anything *but* empty
   // Is it empty?  Depends on your application.
   if (typeof obj !== 'object') return true;

   // Otherwise, does it have any properties of its own?
   // Note that this doesn't handle
   // toString and valueOf enumeration bugs in IE < 9
   for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
   }

   return true;
}