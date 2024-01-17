import DataService from '@/services/data.service';
import { resolveErrorData } from '@/utils';

import { STORE_SUBJECT_QUESTIONS, STORE_YEAR_RECRUITS, 
   STORE_NOTE_CATEGORIES, STORE_TERM_NOTES
} from '@/store/actions.type';
import { SET_LOADING } from '@/store/mutations.type';



const initialState = {
   
};

export const state = { ...initialState };
 
const getters = {
   
};

const actions = {
   [STORE_SUBJECT_QUESTIONS](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         DataService.storeSubjectQuestions(model)
            .then(() => {
               resolve(true);
            })
            .catch(error => {
               reject(resolveErrorData(error));
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [STORE_YEAR_RECRUITS](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         DataService.storeYearRecruits(model)
         .then(() => {
            resolve(true);
         })
         .catch(error => {
            reject(resolveErrorData(error));
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [STORE_NOTE_CATEGORIES](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         DataService.storeNoteCategories(model)
         .then(() => {
            resolve(true);
         })
         .catch(error => {
            reject(resolveErrorData(error)); 
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [STORE_TERM_NOTES](context, model) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         DataService.storeTermNotes(model)
         .then(() => {
            resolve(true);
         })
         .catch(error => {
            reject(resolveErrorData(error)); 
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   }
   
};


const mutations = {

};

export default {
   state,
   actions,
   mutations,
   getters
};
 