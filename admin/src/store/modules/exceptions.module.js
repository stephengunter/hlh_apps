import ExceptionsService from '@/services/exceptions.service';

import { FETCH_EXCEPTIONS } from '@/store/actions.type';

import { SET_LOADING, SET_EXCEPTIONS,
   SET_EXCEPTION_TYPES, SET_EXCEPTION_PERIOD
} from '@/store/mutations.type';


const initialState = {
   pagedList: null,
   typeOptions: [],
   period: []
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [FETCH_EXCEPTIONS](context, params) {
      context.commit(SET_LOADING, true);
      return new Promise((resolve, reject) => {
         ExceptionsService.fetch(params)
         .then(model => {
            context.commit(SET_EXCEPTIONS, model.pagedList);
            context.commit(SET_EXCEPTION_TYPES, model.types);

            if(model.period.length) context.commit(SET_EXCEPTION_PERIOD, model.period);
            resolve(model);
         })
         .catch(error => {
            reject(error);
         })
         .finally(() => { 
            context.commit(SET_LOADING, false);
         });
      });
   }
   
};


const mutations = {
   [SET_EXCEPTIONS](state, model) {
      state.pagedList = model;
   },
   [SET_EXCEPTION_TYPES](state, types) {
      let options = [{ value: '', text: '----------' }];
      types.forEach(type => {
         options.push({ value: type, text: type });
      });
      state.typeOptions = options;
   },
   [SET_EXCEPTION_PERIOD](state, period) {
      state.period = period;
   }
};

export default {
   state,
   actions,
   mutations,
   getters
};
 