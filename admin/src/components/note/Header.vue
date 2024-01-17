<template>
	<v-row>
		<v-col cols="8">
			<core-bread  @selected="onBreadSelected" />
		</v-col>
		<v-col cols="4" class="text-right">
			<v-btn @click.prevent="refresh" class="mx-2" fab small>
				<v-icon>mdi-refresh</v-icon>
			</v-btn>
		</v-col>
		<v-dialog v-model="category.active" :max-width="category.maxWidth" :persistent="true">
			<note-category
			:allow_cancel="version > 0 || paramsValid" :version="category.version"
			:params="category.params" :subject_options="subjectOptions"
			:tree_items="tree.items"
			@cancel="category.active = false;"
			@root-changed="onRootSubjectChanged"
			@submit="onParamsChanged"
			/>
		</v-dialog>
	</v-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { DIALOG_MAX_WIDTH } from '@/config';
import { FETCH_NOTE_CATEGORIES , NOTE_CATEGORY } from '@/store/actions.type';
import { SET_BREAD_ITEMS } from '@/store/mutations.type';
import { onError } from '@/utils';

export default {
   name: 'NoteHeader',
   props: {
		can_create: {
			type: Boolean,
			default: false
		},
      version: {
         type: Number,
         default: 0
      }
	},
   data () {
		return {
			params: {
				rootSubject: 0,
				subject: 0,
            term: 0,
            keyword: '',
         },
         subjectOptions: [],
			subjects : [],
			terms: [],

			category: {
				params: {},
				version: 0,
				active: false,
				maxWidth: DIALOG_MAX_WIDTH
			},
			
			tree: {
            items: []
			}
			
		}
   },
   computed: {
		...mapGetters(['responsive','contentMaxWidth']),
		...mapState({
			categories: state => state.notes.categories
		}),
		rootSubject() {
			if(this.params.rootSubject) return this.categories.find(item => item.id === this.params.rootSubject);
			return null;
		},
		subject() {
			if(this.params.subject) {
				return this.subjects.find(item => item.id === this.params.subject);
			}else if(this.term){
				return this.subjects.find(item => item.id === this.term.parentId);
			}
			return null;
		},
		term() {
			if(this.params.term) {
				return this.terms.find(item => item.id === this.params.term);
			}
			return null;
		},
		paramsValid() {
         return this.params.subject > 0 || this.params.term > 0
      }
	},
	beforeMount() {
		this.$store.dispatch(FETCH_NOTE_CATEGORIES)
      .then(() => {
         this.$nextTick(() => {
            this.init();
         });
      })
      .catch(error => {
         Bus.$emit('errors', resolveErrorData(error));
      })
	},
   methods: {
		init() {
			let subjectOptions = this.categories.map(item => ({ value: item.id, text: item.text }));
         this.params.rootSubject = subjectOptions[0].value;
         this.setTreeItems(this.params.rootSubject);

         this.subjectOptions = subjectOptions;
			this.showCategory();

			let subjects = this.categories.flatMap(item => item.subItems);
			let terms = subjects.flatMap(item => item.subItems);
			this.subjects = subjects;
			this.terms = terms;
		},
		setTreeItems(rootSubjectId) {
         let category = this.categories.find(item => item.id === rootSubjectId);
			this.tree.items = category.subItems;
		},
		onRootSubjectChanged(val) {
			this.setTreeItems(val);
		},
		onParamsChanged(params) {
			this.params = { ...params };
			this.$emit('params-changed', params);
			
			this.$nextTick(() => {
				this.setTitle();
				this.category.active = false;
			});
		},
		setTitle() {
			let items = [{
				action: NOTE_CATEGORY, text: this.rootSubject.text
			}];
			
			if(this.params.keyword) {
				if(this.subject) items.push({ action: NOTE_CATEGORY, text: this.subject.text });
				items.push({ action: NOTE_CATEGORY, text: `搜尋：${this.params.keyword}` });
			}else {
				items.push({ action: NOTE_CATEGORY, text: this.subject.text });
				if(this.term) items.push({ action: NOTE_CATEGORY, text: this.term.text });
			}

			this.$store.commit(SET_BREAD_ITEMS, items);			
      },
		onBreadSelected(item) {
			this.showCategory();
		},
		showCategory() {
			this.category.params = { ...this.params };
			this.category.version += 1;
			this.category.maxWidth = this.contentMaxWidth ? this.contentMaxWidth : DIALOG_MAX_WIDTH;
			this.category.active = true;
		},
		refresh() {
			this.$emit('refresh');
		}
   }
}
</script>

<style>

</style>