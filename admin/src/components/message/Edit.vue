<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { UPDATE_MESSAGE } from '@/store/actions.type';
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type';
import { DIALOG_MAX_WIDTH } from '@/config';
import { addErrorMsg, getErrorMsg, clearErrors } from '@/utils';

const name = 'MessageEdit'
const store = useStore()
const props = defineProps({
   model: {
		type: Object,
		default: null
	}
})
const emit = defineEmits(['remove', 'cancel', 'saved'])

const { handleSubmit, handleReset } = useForm({
	validationSchema: toTypedSchema(
		yup.object({
			email: yup.string().email().required(),
			password: yup.string().min(6).required(),
		})
   )
})

const phone = useField('phone')
const email = useField('email')
const select = useField('select')
const checkbox = useField('checkbox')

const ready = ref(false)
const reply = ref(null)
const isValid = ref(false)
const action = ref('')
const preview = ref({
	active: false,
	maxWidth: DIALOG_MAX_WIDTH,
	content: ''
})
const references = ref({
	active: false,
	maxWidth: DIALOG_MAX_WIDTH,
	content: ''
})

const responsive = computed(() => store.getters.responsive)
const contentMaxWidth = computed(() => store.getters.contentMaxWidth)
const htmlEditor = computed(() => {
	// if(this.$refs.htmlEditor) return this.$refs.htmlEditor;
	// 		else if (this.references.htmlEditor) return this.references.htmlEditor;
	// 		return null;
})
onBeforeUnmount(() => {
	// let returnContent = props.model.returnContentView
	// text = returnContent.text;
	// reply = {
	// 	...returnContent
	// };

	// this.preview.content = returnContent.template;

	// if(!this.reply.subject) this.reply.subject = `Re: ${this.model.subject}`;
	
	// this.ready = true;
})
onMounted(() => {
	//this.references = { ...this.$refs };
})
function getErrMsg(key) {
	//if(this.validator) return getErrorMsg(this.validator.errors, key);
	return '';			
}
function remove() {
	emit('remove')
}
function cancel(){
	//this.validator.reset();
	emit('cancel');
}
function onPreview() {
	action.value = 'preview';
	showPreview(reply.value.text);
}
function cancelPreview() {
	action.value = ''
	preview.value.active = false
}
function onSubmit() {
	isValid.value = false
	action.value = 'submit'

	// this.validator.validate().then(valid => {
	// 	if(!valid) return;

	// 	let convert = false;
	// 	this.reply.text = this.htmlEditor.getContent(convert);

	// 	let content = this.reply.text;
	// 	if(content && content != `<p></p>`) {
	// 		if(this.reply.draft) {
	// 			//儲存草稿
	// 			this.reply.text = content;
	// 			this.submit();
	// 		}else {
	// 			//發送回覆, 先預覽
	// 			this.isValid = true,
	// 			this.showPreview(content);
	// 		}
	// 	}else {
	// 		this.isValid = false;
	// 		this.addContentError();
	// 	}
	// });         
}
function addContentError(msg = '必須填寫內容') {
	//addErrorMsg(this.validator, 'content', msg);
}
function clearContentError() {
	// let errors = clearErrors({ ...this.validator.errors }, ['content']);
	// this.validator.setErrors(errors);
}
function onHtmlContentChanged() {
	clearContentError();
}
function showPreview(content) {
	this.preview.value.title = reply.value.subject;
	this.preview.value.content = reply.value.template.replace('MAILCONTENT', content);
	this.preview.value.maxWidth = contentMaxWidth ? contentMaxWidth : DIALOG_MAX_WIDTH;
	this.preview.value.active = true;
}
// function submit() {
// 	let id = props.model.id;
// 	let model = reply.value;

// 	if(!model.draft) {
// 		model.content = preview.value.content;
// 	}

// 	store.commit(CLEAR_ERROR);
// 	store.dispatch(UPDATE_MESSAGE, {id, model})
// 	.then(() => {
// 		emit('saved');
// 	})
// 	.catch(error => {
// 		if(!error)  Bus.emit('errors');
// 		else store.commit(SET_ERROR, error);
// 	})
// }

const submit = handleSubmit(values => {
	alert(JSON.stringify(values, null, 2))
})
</script>
<template>
<validation-observer ref="validator">
	<v-card v-if="ready">
		<core-close-icon-button @close="cancel" />
		<v-card-text>
			<v-container>
				<v-row>
					<h2>原件</h2>
					<v-col cols="12">
						<p>
							<span class="headline">{{ model.subject }}</span>
							<span class="pl-3">{{ model.createdAtText }}</span>
						</p>
					</v-col>
					<v-col cols="12">
						<p>
							{{ model.content }}
						</p>
					</v-col>
				</v-row>
				<form @submit.prevent="onSubmit">
					<v-row>
						<h2>回覆</h2>
						<v-col cols="12">
								<v-text-field label="主旨" v-model="reply.subject" required
								:error-messages="errors"
								/>
						</v-col>
						<v-col cols="12">
							<CoreHtmlEditor ref="htmlEditor" :allow_image="false"
							:content="reply.text"
							@changed="onHtmlContentChanged"
							/>

							<validation-provider name="content">
								<core-error-text class="mt-3" :text="getErrMsg('content')" />
							</validation-provider>

							<v-btn class="mt-3" @click.prevent="onPreview" fab small>
								<v-icon>mdi-eye-outline</v-icon>
							</v-btn>
						</v-col>
					</v-row>
					<CoreErrorList />
					<v-row>
						<v-col cols="12">
							<v-checkbox v-model="reply.draft" label="草稿" 
							/>
						</v-col>
					</v-row>
				</form>
			</v-container>

			<v-dialog v-model="preview.active" :max-width="preview.maxWidth">
				<v-card>
					<v-card-title>
						<span class="headline">{{ preview.title }}</span>
						<v-spacer />
						<v-btn href="#" @click.prevent="cancelPreview" icon>
							<v-icon>mdi-window-close</v-icon>
						</v-btn>
					</v-card-title>
					<v-card-text>
						<v-container>
							<core-html-preview :content="preview.content" />
						</v-container>
					</v-card-text>
					<v-card-actions v-if="!reply.draft" v-show="isValid">
						<v-container>
							<v-btn type="submit" @click.prevent="submit" color="primary">
								發送回覆
							</v-btn>
						</v-container>
					</v-card-actions>
				</v-card>
			</v-dialog>

		</v-card-text>
		<v-card-actions>
			<v-container>
				<v-btn type="submit" @click.prevent="onSubmit" color="primary">
					存檔
				</v-btn>
			</v-container>
		</v-card-actions>
	</v-card>
</validation-observer>
</template>
