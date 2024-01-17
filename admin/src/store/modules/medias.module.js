import { INIT_MEDIAS, ADD_MEDIA, REMOVE_MEDIA } from '@/store/actions.type';


const initialState = {
   medias: [],
   attachments: []
};

export const state = { ...initialState };
 
const getters = {
   
};


const actions = {
   [INIT_MEDIAS](context, attachments) {
      context.state.medias = [];
      if(attachments && attachments.length) context.state.attachments = attachments.slice(0);
      else context.state.attachments = [];
      
   },
   [ADD_MEDIA](context, { files, thumbs }) {
      let fileNames = context.state.medias.map(item => item.file.name);

      for(let i = 0; i < files.length; i++) {
         let file = files[i]; 
         if(fileNames.includes(file.name)) {
            Bus.$emit('warning', '圖片重複');
         }else {
            context.state.attachments.push({
               name: file.name,
               title: ''
            });

            let thumb = thumbs[i];
            context.state.medias.push({
               file, thumb
            });
         } 
      }
   },
   [REMOVE_MEDIA](context, idx) {
      let name = context.state.attachments[idx].name;
      let index = context.state.medias.findIndex(item => item.file.name === name);
      if(index > -1) context.state.medias.splice(index, 1);

      context.state.attachments.splice(idx, 1);
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
 