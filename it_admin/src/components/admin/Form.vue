<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES } from '@/consts'
import { setValues, statusText, deepClone, isEmptyObject } from '@/utils'

const name = 'AdminForm'
const emit = defineEmits(['submit'])
const store = useStore()

const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	file_request: {
		type: Boolean,
		default: false
	},
	file_label: {
		type: String,
		default: '上傳檔案'
	},
	file_accept: {
		type: Array,
		default: () => []
	},
	file_is_media: {
		type: Boolean,
		default: false
	},
	file_multiple: {
		type: Boolean,
		default: false
	},
})
const initialState = {
   form: {
		key: '',
		files: []
   }

}
const file_upload = ref(null)
const state = reactive(deepClone(initialState))
const rules = computed(() => {
	return {
		key: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED('Key'), required)
		}
	}
})

const v$ = useVuelidate(rules, state.form)

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
	state.parent = isEmptyObject(props.model.parent) 
						? deepClone(initialState.parent) 
						: deepClone(props.model.parent)
}
function onSubmit() {
	v$.value.$validate().then(valid => {
		if(!valid) return
		if(props.file_request) {
			state.form.files = file_upload.value.getFiles().slice()
			if(!state.form.files.length) {
				store.commit(SET_ERRORS, Object.values({files: ['必須上傳檔案']}))
				return
			}
		}
		emit('submit', state.form)
	})
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}
function onFileAdded(model) {
	store.commit(CLEAR_ERRORS)
}
</script>

<template>
	<form @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row dense>
			<v-col cols="12">
				<v-text-field label="Key"           
				v-model="state.form.key"
				:error-messages="v$.key.$errors.map(e => e.$message)"                     
				@input="v$.key.$touch"
				@blur="v$.key.$touch"
				/>
				<CommonInputUpload ref="file_upload" :show_button="file_request"
				:multiple="file_multiple" :is_media="file_is_media" :allow_types="file_accept"
				@file-added="onFileAdded"
				/>
			</v-col>
			<CommonErrorsList />
		</v-row> 
		<v-row dense>
			<v-col cols="12">
				<v-btn type="submit" color="success" class="float-right">
				{{ ACTION_TITLES.SAVE }}
				</v-btn>
			</v-col>
		</v-row>
	</form>
</template>