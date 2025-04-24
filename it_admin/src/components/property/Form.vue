<script setup>
import { ref, reactive, computed, onBeforeMount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, alphaNum, url, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, getValue, statusText, isAlphaNumeric, deepClone, isEmptyObject } from '@/utils'

const name = 'PropertyForm'
const props = defineProps({
	id: {
		type: Number,
		default: 0
	},
   model: {
		type: Object,
		default: null
	},
   categories: {
      type: Array,
      default: () => []
   },
   locations: {
      type: Array,
      default: () => []
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
		isItDevice: false,
		ps: ''
   },
	active: true,
	categoryTitle: '',
	locationTitle: ''
}
const state = reactive(deepClone(initialState))
const rules = computed(() => {
	return {
		
	}
	
})
const v$ = useVuelidate(rules, state.form)

const canRemove = computed(() => {
	if(!props.id) return false
	if(props.model.hasOwnProperty('canRemove')) return props.model.canRemove
	return false
})

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
	state.categoryTitle = categoryTitle(props.model)
	state.locationTitle = locationTitle(props.model)
}
function categoryTitle(item) {
	console.log(item)
   const category = props.categories.find(x => x.id === item.categoryId)   
   if(category) return category.title
   return ''
}
function locationTitle(item) {
   const location = props.locations.find(x => x.id === item.locationId)   
   if(location) return location.title
   return item.locationName
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function onSubmit() {
	emit('submit', state.form)
}
function onRemove() {
	emit('remove')
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}
function getCategoryName() {
	return 'dan'
}
</script>

<template>
	<form @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row dense>
			<v-col cols="3">
				<v-text-field label="分類" readonly   
				density="compact" variant="outlined" 
				v-model="state.categoryTitle"
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field :label="getLabel('title')" readonly   
				density="compact" variant="outlined" 
				v-model="model.titleNameText"
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field :label="getLabel('brand')" readonly   
				density="compact" variant="outlined" 
				v-model="model.brandName"
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field :label="getLabel('type')" readonly   
				density="compact" variant="outlined" 
				v-model="model.type"
				/>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="3">
				<v-text-field :label="getLabel('number')" readonly   
				density="compact" variant="outlined" 
				v-model="model.numberStickText"
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field :label="getLabel('userName')" readonly   
				density="compact" variant="outlined" 
				v-model="model.userName"
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field :label="getLabel('location')" readonly   
				density="compact" variant="outlined" 
				v-model="state.locationTitle"
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field :label="getLabel('getDate')" readonly   
				density="compact" variant="outlined" 
				v-model="model.getDateText"
				/>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="3">
				<v-switch 
				v-model="state.form.isItDevice"
				color="success" label="資訊設備"
				/>
			</v-col>
			<v-col cols="3">
				<v-text-field :label="getLabel('deviceCode')" readonly   
				density="compact" variant="outlined" 
				v-model="model.deviceCode"
				/>
			</v-col>
			<v-col cols="6">
				
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
				<v-btn type="submit" color="success" class="float-right">
				{{ ACTION_TITLES.SAVE }}
				</v-btn>
			</v-col>
		</v-row>
	</form>
</template>