import AttachmentService from '@/services/attachments.service'
import { resolveErrorData, deepClone, now, isEmptyObject, getListFromObj } from '@/utils'
import { TEMP_ATTACHMENTS, STORE_ATTACHMENT, GET_ATTACHMENT } from '@/store/actions.type'  

import { SET_LOADING } from '@/store/mutations.type'
   



const initialState = {
   
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [TEMP_ATTACHMENTS](context, files) {
      context.commit(SET_LOADING, true)

      let form = new FormData()
      for (let i = 0; i < files.length; i++) {
         form.append('files', files[i])
      }
      return new Promise((resolve, reject) => {
         AttachmentService.temp(form)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_ATTACHMENT](context, model) {
      context.commit(SET_LOADING, true)
      let form = new FormData()
      Object.keys(model).forEach(key => {
         if (key === 'file' && model[key]) {
            form.append(key, model[key], model[key].name)
         }else {
            form.append(key, model[key])
         }
      })
      return new Promise((resolve, reject) => {
         AttachmentService.store(form)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [GET_ATTACHMENT](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         AttachmentService.get(id)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}


const mutations = {
   
}

export default {
   state,
   actions,
   mutations,
   getters
}
 