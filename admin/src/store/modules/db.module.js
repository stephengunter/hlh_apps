import DBService from '@/services/db.service';
import { resolveErrorData } from '@/utils';

import { GET_DB_NAME, DB_MIGRATE, 
DB_IMPORT, DB_BACKUP, DB_EXPORT
} from '@/store/actions.type';
import { SET_LOADING } from '@/store/mutations.type';



const initialState = {
   
};

export const state = { ...initialState };
 
const getters = {
   
};

const actions = {
   [GET_DB_NAME](context) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         DBService.dbName()
            .then(name => {
               resolve(name);
            })
            .catch(error => {
               reject(error);
            })
            .finally(() => { 
               context.commit(SET_LOADING, false);
            });
      });
   },
   [DB_IMPORT](context, { key, cmd, files }) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         let form = new FormData();
         form.append('key', key);
         form.append('cmd', cmd);
         for (let i = 0; i < files.length; i++) {
            form.append('files', files[i]); 
         }
         DBService.importing(form)
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
   [DB_BACKUP](context, { key }) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         DBService.backup({ key })
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
   [DB_EXPORT](context, { key }) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         DBService.exporting({ key })
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
   [DB_MIGRATE](context, { key }) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         DBService.migrate({ key })
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
 