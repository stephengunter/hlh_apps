<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES } from '@/consts'
import { setValues, statusText, deepClone, isEmptyObject } from '@/utils'

const name = 'LocationForm'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	parent_options: {
		type: Array,
		default: () => []
	}
})
const emit = defineEmits(['submit', 'cancel', 'remove'])
const store = useStore()

const initialState = {
   form: {
		id: 0,
		title: '',
		parentId: null,
		key: '',
      active: true
   },
	parent: {
		id: 0,
		title: ''
	},
	errors: {
		'parent': false
	}
}
const state = reactive(deepClone(initialState))
const parentOptions = computed(() => props.parent_options.filter(x => x.value !== props.model.id ))
const labels = {
	'title': '名稱',
	'parent': '父位置',
	'active': '狀態'
}
const rules = computed(() => {
	return {
		title: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels['title']), required)
		}
	}
})

const v$ = useVuelidate(rules, state.form)


const canRemove = computed(() => {
	if(!props.model.id) return false
	if(props.model.active) return false
	return true
})
const status_text = computed(() => statusText(state.form.active))

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
	state.parent = isEmptyObject(props.model.parent) 
						? deepClone(initialState.parent) 
						: deepClone(props.model.parent)
}

function cancel() {
	emit('cancel')
}
function onSubmit() {
	v$.value.$validate().then(valid => {
		if(!valid) return
		emit('submit', state.form)
	})
}
function onRemove() {
	emit('remove')
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}
</script>

<template>
	<form @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row dense="">
			<v-col cols="12">
				<v-text-field :label="labels['title']"           
				v-model="state.form.title"
				:error-messages="v$.title.$errors.map(e => e.$message)"                     
				@input="v$.title.$touch"
				@blur="v$.title.$touch"
				/>
			</v-col>
			<v-col cols="12">
				<v-text-field label="Key"           
				v-model="state.form.key"
				/>
			</v-col>
			<v-col cols="12">
				<span v-if="state.errors.parent" class="text-red ml-2">{{ `*${VALIDATE_MESSAGES.MUST_SELECT(labels['parent'])}`  }}</span>
				<v-autocomplete :label="labels['parent']"
				v-model="state.form.parentId"
				:items="props.parent_options.filter(x => x.value !== props.model.id )" item-title="text"
				/>
			</v-col>
			<v-col cols="6">
				<v-switch
				v-model="state.form.active"
				color="success" :label="status_text"
				/>
			</v-col>
			<v-col cols="6">
				
			</v-col>
		</v-row>
		<v-col cols="12">
			<CommonErrorsList />
		</v-col> 
		<v-row>
			<v-col cols="6">
				<v-btn v-if="canRemove" @click.prevent="onRemove" color="error">
					{{ ACTION_TITLES.REMOVE }}
				</v-btn>
			</v-col>
			<v-col cols="6">
				<v-btn type="submit" color="success"  class="float-right">
				{{ ACTION_TITLES.SAVE }}
				</v-btn>
			</v-col>
		</v-row>
	</form>
</template>