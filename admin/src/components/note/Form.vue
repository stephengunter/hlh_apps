<template>
   <v-card>
      <v-card-title>
         <h3>{{ title }}</h3>
         <span v-if="model.id" class="headline ml-3">Id : {{ model.id }}</span>
         <v-spacer />
         <v-btn @click.prevent="cancel" icon>
            <v-icon>mdi-window-close</v-icon>
         </v-btn>
      </v-card-title>
      <v-card-text>
         <validation-observer ref="validator">
            <v-container>
               <v-row>
                  <v-col cols="6">
                     <validation-provider v-slot="{ errors }" name="TermId" rules="required|numeric">
                        <v-text-field label="TermId" v-model="model.termId" required
                        :error-messages="errors"
                        />
                     </validation-provider>
                  </v-col>
                  <v-col cols="6">
                     <v-switch label="重要" v-model="model.important" />
                  </v-col>
                  <v-col cols="6">
							<v-switch v-model="model.active" label="上架中" @change="onActiveChanged" />
						</v-col>
						<v-col cols="6">
							<validation-provider v-slot="{ errors }" name="排序" rules="required|integer">
                        <v-text-field label="排序" v-model="model.order" required
                        :error-messages="errors"
								@change="onOrderChanged"
                        />
                     </validation-provider>
						</v-col>
                  <v-col cols="12">
                     <v-text-field label="標題" v-model="model.title" />
                  </v-col>
                  <v-col cols="12">
                     <validation-provider v-slot="{ errors }" name="內容">
                        <v-textarea v-model="model.text" label="內容" outlined auto-grow
                        rows="5" row-height="15"
                        :error-messages="errors"
                        />
                     </validation-provider>
                  </v-col>
                  
                  <v-col cols="12">
                     <v-textarea v-model="model.highlight" label="重點標記" outlined auto-grow
                     rows="5" row-height="15"
                     />
                  </v-col>
                  <v-col cols="12">
                     <validation-provider v-slot="{ errors }" name="參考">
                        <v-textarea v-model="model.reference" label="參考(text, id, type)" outlined auto-grow
                        :error-messages="errors"
                        rows="5" row-height="15"
                        />
                     </validation-provider>
                  </v-col>
                  
               </v-row>
               <v-row>
                  <v-col cols="12">
                     <core-upload-button :multiple="true"
                     @file-added="onFileAdded"
                     >
                        附圖<v-icon right dark>mdi-image</v-icon>
                     </core-upload-button>
                  </v-col>
                  <v-row style="padding: 12px;">
                     <div v-for="(item, index) in attachments" :key="index">
                        <v-img :src="getPhotoPath(item)"  max-width="100" aspect-ratio="1">
                           <core-close-icon-button color="success"
                           @close="removeAttachment(index)"
                           />
                        </v-img>
                        <v-text-field class="mr-3" v-model="item.title" />
                     </div>
                  </v-row>
               </v-row>  
					<core-error-list />
					
               <v-row>
                  <v-col cols="12" class="text-right">
                     <v-btn @click.prevent="onSubmit" color="success">確定</v-btn>
                  </v-col>
               </v-row>
            </v-container>
         </validation-observer>
      </v-card-text>
   </v-card>
   
</template>


<script>
import { mapState, mapGetters } from 'vuex';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { STORE_SUBJECT, UPDATE_SUBJECT, DELETE_SUBJECT,
   ADD_MEDIA, REMOVE_MEDIA
} from '@/store/actions.type';
import { photoNameUrl, isValidReference, findSubject, onError,
	addErrorMsg, getErrorMsg, clearErrors,
	resolveHighlights, resolveReferences
} from '@/utils';
import { DIALOG_MAX_WIDTH } from '@/config';

export default {
	name: 'NoteForm',
	props: {
		model: {
         type: Object,
         default: null
      },
      title: {
         type: String,
         default: ''
      }
	},
	data () {
		return {
         references: {}
		}
   },
   computed: {
      ...mapGetters(['contentMaxWidth']),
      ...mapState({
			medias: state => state.medias.medias,
			attachments: state => state.medias.attachments,
		}),
      validator() {
			if(this.$refs.validator) return this.$refs.validator;
			else if (this.references.validator) return this.references.validator;
			return null;
		},
   },
   mounted() {
		this.references = { ...this.$refs };
	},
	methods: {
      onFileAdded({ files, thumbs }) {
         this.clearContentError();
         this.$store.dispatch(ADD_MEDIA, { files, thumbs });
      },
      removeAttachment(index) {
         this.$store.dispatch(REMOVE_MEDIA, index);
      },
      getPhotoPath(attachment) {
         let width = 100;
         if(attachment.previewPath) return photoNameUrl(attachment.previewPath, width);
         else {
            let media = this.medias.find(item => item.file.name === attachment.name);
            return media.thumb.data;
         }
      },
		onActiveChanged(val) {
			if(this.model.active) {
				if(this.model.order < 0) this.model.order = 0;
			}else {
				if(this.model.order > -1) this.model.order = -1;
			}
		},
		onOrderChanged(val) {
         if(isNaN(val)) return;
         this.model.order = parseInt(val);
			this.model.active = this.model.order >= 0;
      },
      checkReference() {
			let referencesErrorIndex = this.model.references.findIndex(item => !isValidReference(item));
			return referencesErrorIndex < 0;
		},
		addReferenceError(msg = '參考格式錯誤') {
			addErrorMsg(this.validator, '參考', msg);
		},
		clearReferenceError() {
			let errors = clearErrors(this.validator.errors, ['參考']);
			this.validator.setErrors(errors);
      },
      checkContent() {
         if(this.model.text) return true;
         if(this.model.attachments.length) return true;
         return false;
		},
		addContentError(msg = '必須填寫內容') {
			addErrorMsg(this.validator, '內容', msg);
		},
		clearContentError() {
			let errors = clearErrors(this.validator.errors, ['內容']);
			this.validator.setErrors(errors);
		},
		cancel(){
			this.$emit('cancel');
		},
		onSubmit() {
         this.model.medias = this.medias.slice(0);
         this.model.attachments = this.attachments.slice(0);

			this.model.highlights = resolveHighlights(this.model.highlight);
			this.model.references = resolveReferences(this.model.reference);

			this.submit();
		},
		submit() {
         this.clearContentError();
			this.$store.commit(CLEAR_ERROR);
			this.validator.validate().then(valid => {
            if(!valid) return;
            
            let contentValid = this.checkContent();
				if(!contentValid) this.addContentError();
				
            let referencesValid = this.checkReference();
            if(!referencesValid) this.addReferenceError();
            
            if(contentValid && referencesValid) {
               this.$emit('submit');
            }
			});
		}
	}
}
</script>
