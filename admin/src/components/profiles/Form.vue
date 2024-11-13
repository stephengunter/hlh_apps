<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { VALIDATE_MESSAGES } from '@/consts'
import { CLEAR_ERRORS } from '@/store/mutations.type' 
import { isEmptyObject, deepClone, getValue, setValues } from '@/utils'

const name = 'ProfilesForm'
const props = defineProps({
   model: {
      type: Object,
      default: null
   },
	labels: {
      type: Object,
      default: null
   },
	active: {
      type: Boolean,
      default: false
   },
	can_remove: {
      type: Boolean,
      default: false
   }
})
const emit = defineEmits(['submit', 'remove'])

const store = useStore()
const initialState = {
   form: {
      name: '',
      ps: ''
   }
}
const state = reactive(deepClone(initialState))

onBeforeMount(init)

function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}

const rules = computed(() => {
	return {
		name: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(getLabel('name')), required)
		}
	}
})

const v$ = useVuelidate(rules, state.form)

function init() {
	setValues(props.model, state.form)
}
function onSubmit() {
	v$.value.$validate().then(valid => {
      if(!valid) return
		emit('submit', state.form)
	})
}
function remove() {
	emit('remove')
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}
</script>

<template>
   <form v-if="props.model" @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row>
			<v-col cols="12">
				<v-text-field :label="getLabel('name')"                
				v-model="state.form.name"
				:error-messages="v$.name.$errors.map(e => e.$message)"                     
				@input="v$.name.$touch"
				@blur="v$.name.$touch"
				/>
				<v-text-field :label="getLabel('ps')"                   
				v-model="state.form.ps"
				/>
				<CommonErrorsList v-if="props.active" />
			</v-col>
			<v-col cols="12">
				<v-btn type="button" v-if="props.can_remove" color="error" 
				@click.prevent="remove"
				>
				刪除
				</v-btn>
				<v-btn type="submit" color="success" class="float-right">
				存檔
				</v-btn>
			</v-col>
		</v-row>
	</form>
</template>