<script setup>
import { ref, reactive, computed, onBeforeMount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, alphaNum, url, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, getValue, statusText, isAlphaNumeric, deepClone, isEmptyObject } from '@/utils'

const name = 'CategoryForm'
const props = defineProps({
	id: {
		type: Number,
		default: 0
	},
   model: {
		type: Object,
		default: null
	},
	can_edit: {
		type: Boolean,
		default: false
	},
	can_remove: {
		type: Boolean,
		default: false
	},
	labels: {
		type: Object,
		default: null
	}
})
const emit = defineEmits(['submit', 'remove'])
const store = useStore()
const initialState = {
   form: {
		title: '',
		key: '',
		active: false
   }
}
const state = reactive(deepClone(initialState))
const status_text = computed(() => statusText(state.form.active))
const rules = computed(() => {
	return {
		title: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('title')), required)
		}
	}
	
})
const v$ = useVuelidate(rules, state.form)

const canRemove = computed(() => {
	if(!props.id) return false
	return props.can_remove
})

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
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
		<v-row dense>
			<v-col cols="4">
				<v-text-field :label="labels['title']"    
				density="compact" variant="outlined" 
				v-model="state.form.title"
				:error-messages="v$.title.$errors.map(e => e.$message)"
            @input="v$.title.$touch"
            @blur="v$.title.$touch"
				/>
			</v-col>
			<v-col cols="4">
				
			</v-col>
			<v-col cols="4">
				
				
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<CommonErrorsList />
			</v-col> 
		</v-row>
		<v-row>
			<v-col cols="12">
				<v-btn v-if="canRemove"  class="float-left" color="error"
				@click.prevent="onRemove" 
				>
					{{ ACTION_TITLES.REMOVE }}
				</v-btn>
				<v-btn v-if="can_edit" type="submit" color="success" class="float-right">
				{{ ACTION_TITLES.SAVE }}
				</v-btn>
			</v-col>
		</v-row>
	</form>
</template>