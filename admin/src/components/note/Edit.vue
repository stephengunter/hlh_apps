<template>
   <v-row>
      <v-col cols="12">
         <v-btn small fab dark color="info" class="mr-3" :disabled="!canCreate"
			@click.prevent="add"		
			>
				<v-icon dark>mdi-plus</v-icon>
			</v-btn>
         <term-read style="font-size:16px" :term="term" />
      </v-col>
      <v-col cols="12" v-show="activeNotes.length">
         <note-table ref="tableNotes" 
         :notes="notes"
         @edit="edit" @remove="onRemove"
         />
      </v-col>
      <v-col cols="12">
         <span class="titleText">相關試題</span>
         <v-btn small fab dark color="warning" class="ml-3 mb-2" :disabled="!canCreate"
			@click.prevent="addQuestion"		
			>
				<v-icon dark>mdi-plus</v-icon>
			</v-btn>
         <div v-if="hasQuestions">
            <question-table :list="term.questions" :show_recruits="false" :show_resolves="false"
            :can_remove="true" :can_edit="false"
            @remove="removeQuestion"
            />
         </div>
      </v-col>
      <v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<note-form v-if="editor.active" :model="editor.model"
         :title="editor.title"
			@submit="onSubmit" @cancel="cancelEdit"
			/>
		</v-dialog>
   </v-row>
   
</template>


<script>
import { mapGetters } from 'vuex';
import Sortable from 'sortablejs';
import { STORE_NOTE, EDIT_NOTE, UPDATE_NOTE, DELETE_NOTE, ORDER_NOTES,
   CREATE_NOTE, STORE_ATTACHMENT, INIT_MEDIAS
} from '@/store/actions.type';

import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { onError, deepClone, isValidURL, initHighlight, initReference } from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
	name: 'NoteEdit',
	props: {
      term: {
         type: Object,
         default: null
      }
	},
	data () {
		return {
         title: '筆記',
         editModel: null,
         postType: 'Note',

         sortable: null,

         editor: {
            title: '',
				active: false,
				maxWidth: DIALOG_MAX_WIDTH,
				model: null
         },
         
         delete: {
            id: 0
			},

         references: {}
		}
   },
   computed: {
      ...mapGetters(['contentMaxWidth']),
		canCreate(){
         return !this.editor.active;
      },
      notes() {
         return this.activeNotes.concat(this.unactiveNotes);
      },
      activeNotes() {
         if(this.term && this.term.notes) {
            return this.term.notes.filter(item => item.active);
         }else  return [];
      },
      unactiveNotes() {
         if(this.term && this.term.notes) {
            return this.term.notes.filter(item => !item.active);
         }else  return [];
      },
      hasQuestions() {
         if(!this.term) return false;
         return this.term.questions && this.term.questions.length;
      },
      tableNotes() {
			if(this.$refs.tableNotes) return this.$refs.tableNotes;
			else if (this.references.tableNotes) return this.references.tableNotes;
			return null;
		}
   },
   mounted() {
      this.references = { ...this.$refs };
      this.bindSortable();
   },
	methods: {
      bindSortable() {
         const el = this.tableNotes.$el.getElementsByTagName('tbody')[0];
         this.sortable = Sortable.create(
            el,
            {
               draggable: '.row-note',
               onEnd: this.onDragEnd
            }
         );
      },
      onDragEnd ({ oldIndex, newIndex }) {
			if(oldIndex === newIndex) return;

			let up = oldIndex > newIndex;

			let targetId = this.term.notes[oldIndex].id;
         let replaceId = this.term.notes[newIndex].id;

			this.$store.dispatch(ORDER_NOTES, { targetId, replaceId, up })
			.then(() => {
            this.$emit('order-updated');
				Bus.$emit('success');
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})       		
      },
      add() {
         this.$store.commit(CLEAR_ERROR);
         let term = this.term.id;
         this.$store.dispatch(CREATE_NOTE, { term })
			.then(model => {
            this.$store.dispatch(INIT_MEDIAS, model.attachments);
            this.setEditModel(model);
			})
			.catch(error => {
				Bus.$emit('errors');
			}) 
         
      },
      edit(id) {
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(EDIT_NOTE, id)
			.then(model => {
            initHighlight(model);
            initReference(model);

            this.$store.dispatch(INIT_MEDIAS, model.attachments);
            this.setEditModel(model);
			})
			.catch(error => {
				Bus.$emit('errors');
			}) 
      },
      setEditModel(model) {
			if(model) {
            this.editor.title = model.id ? `新增${this.title}` : `編輯${this.title}`;
				this.editor.model = model;
				this.editor.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
				this.editor.active = true;
			}else {
				this.editor.model = null;
				this.editor.active = false;
			}
      },
      cancelEdit() {
         this.setEditModel(null);
      },
      onSubmit() {
         let model = this.editor.model;

         if(model.id) this.update(model);
			else this.store(model);
      },
      update(model){
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(UPDATE_NOTE, model)
			.then(() => {
            if(model.medias.length) {
               let uploadForm = {
                  postId : model.id,
                  postType: this.postType,
                  files: model.medias.map(item => item.file)
               }
               this.uploadAttachments(uploadForm);
            }else {
               this.onSaved();
            }
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
      },
      store(model) {
         this.$store.commit(CLEAR_ERROR);
         this.$store.dispatch(STORE_NOTE, model)
			.then(data => {
            if(data.attachments.length) {
               let uploadForm = {
                  postId : data.id,
                  postType: data.attachments[0].postType,
                  files: model.medias.map(item => item.file)
               }
               this.uploadAttachments(uploadForm);
               
            }else {
               this.onSaved();
            }
				
			})
			.catch(error => {
				if(!error)  Bus.$emit('errors');
				else this.$store.commit(SET_ERROR, error);
			})
      },
      uploadAttachments(uploadForm) {
			let vm = this;
			vm.$store.dispatch(STORE_ATTACHMENT, uploadForm)
			.then(() => {
				vm.onSaved();
			})
			.catch(error => {
				Bus.$emit('errors');
			})
      },
      onRemove(id) {
         this.delete.id = id;
			Bus.$emit('show-confirm', {
				type: 'error',
				title: '確定要刪除嗎?',
				onOk: this.submitDelete,
				onCancel: () => {}
			});
      },
      submitDelete(){
         let id = this.delete.id;
			this.$store.commit(CLEAR_ERROR);
			
			this.$store.dispatch(DELETE_NOTE, id)
			.then(() => {
				this.onSaved();
			})
			.catch(error => {
				Bus.$emit('errors');
			})
		},
      onSaved() {
         this.$emit('saved');
      },
      addQuestion() {
         this.$emit('add-question', this.term.id);
      },
      removeQuestion(id) {
         this.$emit('remove-question', { termId: this.term.id, questionId: id });
      }
	}
}
</script>
