import DocService from '@/services/docs.service'
import { resolveErrorData, deepClone, isEmptyObject, getListFromObj } from '@/utils'
import Doc from '@/models/doc'
import { INIT_DOCS, FETCH_DOCS, CREATE_DOC, STORE_DOC, DOC_DETAILS, EDIT_DOC, UPDATE_DOC } from '@/store/actions.type'  

import { SET_DOCS, SET_DOC_PERSONS, SET_LOADING } from '@/store/mutations.type'
   



const initialState = {
   query: {
      person: '',
      flag: 1
	},
   keep_reasons: [
      { value: 0, title: ''},
      { value: 1, title: '(一)「紙本原卷將送交檔案管理單位辦理歸檔作業」'},
      { value: 3, title: '(三)「案件尚在承辦中，辦畢後將送檔案管理辦理歸檔作業」'},      
      { value: 4, title: '(四)「資料截止後已送歸」'}
   ],
   list: [],
   persons: []
}

const state = deepClone(initialState)
 
const getters = {
   
}


const actions = {
   [INIT_DOCS](context, query) {
      let state = context.state
      state.query = { ...initialState.query }      
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DocService.init(query)
            .then(list => {
               context.commit(SET_DOC_PERSONS, list)
               resolve()
            })
            .catch(error => reject(error))
            .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [FETCH_DOCS](context, query) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DocService.fetch(query)
         .then(list => {
            context.commit(SET_DOCS, list)
            resolve(list)
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [CREATE_DOC](context, params) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DocService.create(params)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [STORE_DOC](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DocService.store(model)
         .then(list => {
            context.commit(SET_DOC_PERSONS, list)
            resolve()
         })
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [DOC_DETAILS](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DocService.details(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [EDIT_DOC](context, id) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DocService.edit(id)
         .then(model => resolve(model))
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   },
   [UPDATE_DOC](context, model) {
      context.commit(SET_LOADING, true)
      return new Promise((resolve, reject) => {
         DocService.update(model)
         .then(() => resolve())
         .catch(error => reject(error))
         .finally(() => context.commit(SET_LOADING, false))
      })
   }
}


const mutations = {
   [SET_DOCS](state, list) {
      state.list = list
   },
   [SET_DOC_PERSONS](state, unitPersons) {
      // if(unitPersons.length) {
      //    let persons = []
      //    unitPersons.forEach(unitPerson => {
      //       if(units.findIndex(x => x.name === unitPerson.unit) < 0) {
      //          units.push({ name: unitPerson.unit  })
      //       }
      //       persons.push({
      //          unit: unitPerson.unit,
      //          name: unitPerson.person,
      //          saves: unitPerson.saves,
      //          id: unitPerson.id
      //       })
      //    })
      //    state.units = units
      //    state.persons = unitPersons
      // }
      state.persons = unitPersons
   }
}

export default {
   state,
   actions,
   mutations,
   getters
}
 