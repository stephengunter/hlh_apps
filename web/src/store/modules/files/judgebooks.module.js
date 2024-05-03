import JudgebooksService from '@/services/files/judgebooks.service'
import { resolveErrorData, deepClone, isEmptyObject, getListFromObj } from '@/utils'
import { COURT_TYPES  } from '@/consts'
import {
   FETCH_JUDGEBOOKFILES, UPLOAD_JUDGEBOOKFILES, DOWNLOAD_JUDGEBOOKFILE,
   EDIT_JUDGEBOOKFILE, UPDATE_JUDGEBOOKFILE, REMOVE_JUDGEBOOKFILE, FETCH_JUDGEBOOK_TYPES
} from '@/store/actions.type'

import { SET_JUDGEBOOKFILES, SET_JUDGEBOOKFILE_UPLOAD_RESULTS, SET_JUDGEBOOK_TYPES,
   SET_LOADING 
} from '@/store/mutations.type'


const initialState = {
   types: [],
   courtTypes: getListFromObj(COURT_TYPES),
   labels: {
      typeId: '書類',
      courtType: '庭別',
      year: '年度',
      category: '字號',
      num: '案號',
      ps: '備註',
      createdAtText: '建檔日期'
   },
   pagedList: null,
   upload: {
      results: [],
      has_error: false
   }
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [FETCH_JUDGEBOOKFILES](context, params) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JudgebooksService.fetch(params)
            .then(model => {
               context.commit(SET_JUDGEBOOKFILES, model.pagedList)
               resolve(model)
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_JUDGEBOOK_TYPES](context) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JudgebooksService.fetch_types()
            .then(types => {
               context.commit(SET_JUDGEBOOK_TYPES, types)
               resolve(types)
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPLOAD_JUDGEBOOKFILES](context, models) {
      const formData = new FormData();
      models.forEach((item, index) => {
         for (const key in item) {
            if (key === 'File') {
               formData.append(`models[${index}].${key}`, item[key], item[key].name);
            } else {
               formData.append(`models[${index}].${key}`, item[key]);
            }
         }
     })
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JudgebooksService.upload(formData)
         .then(results => {
            context.commit(SET_JUDGEBOOKFILE_UPLOAD_RESULTS, results)
            resolve(results)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [DOWNLOAD_JUDGEBOOKFILE](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JudgebooksService.download(id)
         .then(data => resolve(data))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_JUDGEBOOKFILE](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JudgebooksService.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_JUDGEBOOKFILE](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JudgebooksService.update(model.id, model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [REMOVE_JUDGEBOOKFILE](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         JudgebooksService.remove(id)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }   
}


const mutations = {
   [SET_JUDGEBOOKFILES](state, pagedList) {
      state.pagedList = pagedList
   },
   [SET_JUDGEBOOKFILE_UPLOAD_RESULTS](state, results) {
      state.upload.results = results
      state.upload.has_error = results.some(item => !isEmptyObject(item.errors))
   },
   [SET_JUDGEBOOK_TYPES](state, types) {
      state.types = types
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 