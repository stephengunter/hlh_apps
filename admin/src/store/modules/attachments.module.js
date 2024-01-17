import AttachmentService from '@/services/attachments.service';
import { resolveErrorData } from '@/utils';

import { FETCH_ATTACHMENTS, STORE_ATTACHMENT, DELETE_ATTACHMENT } from '@/store/actions.type';
import { SET_ATTACHMENTS, SET_LOADING } from '@/store/mutations.type';



const initialState = {
   pagedList: null
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_ATTACHMENTS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         AttachmentService.fetch(params)
         .then(model => {
            context.commit(SET_ATTACHMENTS, model);
            resolve(model);
         })
         .catch(error => {
            reject(error); 
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [STORE_ATTACHMENT](context, { postType, postId, files }) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         let form = new FormData();
         form.append('postType', postType);
         form.append('postId', postId);
         for (let i = 0; i < files.length; i++) {
            form.append('files', files[i]); 
         }
         AttachmentService.store(form)
         .then(data => {
            resolve(data);
         })
         .catch(error => {
            reject(resolveErrorData(error)); 
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   },
   [DELETE_ATTACHMENT](context, id) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         AttachmentService.remove(id)
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
   [SET_ATTACHMENTS](state, model) {
      state.pagedList = model;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 