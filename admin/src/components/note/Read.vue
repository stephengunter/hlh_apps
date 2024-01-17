<template>
   <span v-html="html"></span>
</template>

<script>
import { highlightChunks } from '@/utils';
export default {
   name: 'NoteRead',
   props: {
      model: {
         type: Object,
         default: null
      }
   },
   data() {
      return {
         html: '',
         reference: {
            textList: []
         }
      }
   },
   beforeMount() {
      this.init();
   },
   methods: {
      init() {
         let text = this.model.text;

         if(!text) {
            this.html = '';
            return;
         }
         let queries = this.model.highlights;
         if(this.model.references.length) this.reference.textList = this.model.references.map(item => item.text);


         let caseSensitive = false;
         let diacriticsSensitive = false;

         let highlights = highlightChunks(text, queries, { caseSensitive, diacriticsSensitive });
         this.render(highlights);
      },
      isReference(text) {
         if(this.reference.textList.length) return  this.reference.textList.includes(text);
         return false;
      },
      referenceTag(text) {
         let reference = this.model.references.find(item => item.text === text);
         if(reference) {
            let type = reference.type.toLowerCase();
            let id = reference.id;
            if(type === 'note') {
               return `<a href="#" onclick="event.preventDefault(); showNote(${id});" >${text}</a>`;
            }else {
               return `<a href="#" onclick="event.preventDefault(); showTerm(${id});" >${text}</a>`;
            }
         }else return text;
      },
      render(highlights) {        
        
         let htmls = highlights.map(item => {
            if(item.isHighlighted) return `<mark class="text__highlight">${item.text}</mark>`;
            else return item.text;
         });
        
         this.html = htmls.join('');

         this.reference.textList.forEach(text => {
            this.html = this.html.replace(text, this.referenceTag(text))
         });
         
      }
   }
}
</script>