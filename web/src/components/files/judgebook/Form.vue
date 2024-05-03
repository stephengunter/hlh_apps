<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, showConfirm, hideConfirm, deepClone, isEmptyObject } from '@/utils'
import JudgebookFile from '@/models/files/judgebook'


const name = 'FilesJudgebookForm'
const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	court_types: {
      type: Array,
      default: () => []
   }
})
const emit = defineEmits(['submit', 'cancel', 'remove'])
const store = useStore()

const entity = ENTITY_TYPES.JUDGEBOOKFILE
const initialState = {
   form: {
		id: 0,
		typeId: 0,
		courtType: '',
		year: '',
		category: '',
		num: '',
		ps: ''
   },
	errors: {
		'title': false
	}
}
const type_options = computed(() => {
	return store.state.files_judgebooks.types.map(item => ({
		value: item.id, title: item.title
	}))
})

const state = reactive(deepClone(initialState))
const title = computed(() => props.model.id ? `${ACTION_TITLES.EDIT}${entity.title}` : `${ACTION_TITLES.CREATE}${entity.title}`)
const rules = computed(() => {
	return {
		year: {
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels.value['year']), required),
			isValid: helpers.withMessage(`${labels.value['year']}不正確`, checkYear)
		},
      category: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels.value['category']), required),
			isValid: helpers.withMessage(`${labels.value['category']}不正確`, checkCategory)
		},
      num: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(labels.value['num']), required),
			isValid: helpers.withMessage(`${labels.value['num']}不正確`, checkNum)
		}
	}
})

const labels = computed(() => store.state.files_judgebooks.labels)
const v$ = useVuelidate(rules, state.form)


const canRemove = computed(() => {
	if(!props.model.id) return false
	if(props.model.active) return false
	return true
})

onBeforeMount(init)

function init() {
	console.log(props.court_types)
	setValues(props.model, state.form)
}
function onSubmit() {
	v$.value.$validate().then(valid => {
		if(!valid) return
		state.form.num = JudgebookFile.checkNum(state.form.num)
		emit('submit', state.form)
	})
}
function onRemove() {
	showConfirm({
		type: 'warning',
		title: '確定要刪除嗎?',
		text: '',
		on_ok: remove,
		cancel: '取消'
	})
}
function remove() {
	hideConfirm()
	emit('remove')
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}

function checkYear(val) {
   if(val) return  JudgebookFile.checkYear(val)
   return false
}
function checkCategory(val) {
   if(val) return true
	return false
}
function checkNum(val) {
   if(val) return JudgebookFile.isValidNum(val)
   return false
}
</script>

<template>
	<form @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row>
			<v-col cols="12">
				<v-select :label="labels['typeId']" density="compact" variant="outlined"
				:items="type_options" v-model="state.form.typeId"
				/>
			</v-col>
			<v-col cols="6">
				
				<v-select :label="labels['courtType']" density="compact" variant="outlined"
				:items="court_types" v-model="state.form.courtType"
				/>
				<v-text-field :label="labels['category']"  density="compact"        
				v-model="state.form.category"
            :error-messages="v$.category.$errors.map(e => e.$message)"                     
				@input="v$.category.$touch"
				@blur="v$.category.$touch"
				/>
			</v-col>
			<v-col cols="6">
				<v-text-field :label="labels['year']"  density="compact"
				v-model="state.form.year"
            :error-messages="v$.year.$errors.map(e => e.$message)"                     
				@input="v$.year.$touch"
				@blur="v$.year.$touch"
				/>
				<v-text-field :label="labels['num']"  density="compact"    
				v-model="state.form.num"
            :error-messages="v$.num.$errors.map(e => e.$message)"                     
				@input="v$.num.$touch"
				@blur="v$.num.$touch"
				/>
				
			</v-col>
			<v-col cols="12">
				<v-textarea auto-grow :label="labels['ps']"  
				v-model="state.form.ps"	
				/>
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