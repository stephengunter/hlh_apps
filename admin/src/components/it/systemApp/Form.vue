<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, randomItem, statusText, deepClone, isEmptyObject } from '@/utils'

const name = 'ITSystemAppForm'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	labels: {
      type: Object,
      default: null
   }
})
const emit = defineEmits(['submit', 'cancel', 'remove'])
const store = useStore()

const initialState = {
   form: {
		id: 0,
		title: '',
		key: '',
      active: true
   },
	errors: {
		'title': false
	}
}
const state = reactive(deepClone(initialState))
const rules = computed(() => {
	return {
		
	}
})
const entity = ENTITY_TYPES.SYSTEM_APP
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
	console.log(props.labels)
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
		<v-row>
			<!-- <v-col cols="6">
				<v-text-field :label="labels['title']"           
				v-model="state.form.title"
				/>
			</v-col>
			
			<v-col cols="6">
				<v-text-field :label="labels['key']"           
				v-model="state.form.key"
				/>
			</v-col> -->
			<v-col cols="12">
				{{ labels }}
			</v-col>
		</v-row>
		<v-col cols="12">
			<CommonErrorsList />
		</v-col> 
		<v-row>
			<v-col cols="12">
				<v-btn v-if="canRemove"  class="float-left" color="error"
				@click.prevent="onRemove" 
				>
					{{ ACTION_TITLES.REMOVE }}
				</v-btn>
				<v-btn type="submit" color="success" class="float-right">
				{{ ACTION_TITLES.SAVE }}
				</v-btn>
			</v-col>
		</v-row>
	</form>
</template>