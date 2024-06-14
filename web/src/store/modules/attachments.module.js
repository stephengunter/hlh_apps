import AttachmentService from '@/services/attachments.service'
import { resolveErrorData, deepClone, now, isEmptyObject, getListFromObj } from '@/utils'
import { TEMP_ATTACHMENTS } from '@/store/actions.type'  

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
 