<script setup>
import { ref, reactive, computed, onBeforeMount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, alphaNum, url, helpers } from '@vuelidate/validators'
import { CLEAR_ERRORS } from '@/store/mutations.type'
import Errors from '@/common/errors'
import { VALIDATE_MESSAGES, WIDTH, HEIGHT, ACTION_TITLES, ENTITY_TYPES } from '@/consts'
import { setValues, getValue, textToDate, isAlphaNumeric, deepClone, isEmptyObject } from '@/utils'

const name = 'ItemTransactionForm'
const props = defineProps({
	id: {
		type: Number,
		default: 0
	},
   model: {
		type: Object,
		default: null
	},
	item: {
		type: Object,
		default: null
	},
	labels: {
		type: Object,
		default: null
	},
	item_options: {
		type: Array,
		default: () => []
	},
	users: {
		type: Array,
		default: () => []
	},
	departments: {
		type: Array,
		default: () => []
	}
})
const emit = defineEmits(['submit', 'cancel', 'remove'])
const store = useStore()
const initialState = {
	errors: new Errors(),
   form: {
		date: '',
		itemId: '',
		departmentId: null,
		ps: '',
		in: false,
		quantity: 0,
		userId: null
   },
	date: null,
	item: '',
	department: '',
	user: '',
	out: 1
}
const state = reactive(deepClone(initialState))

const canRemove = computed(() => {
	if(!props.id) return false
	if(props.model.hasOwnProperty('canRemove')) return props.model.canRemove
	return false
})

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)	

	state.out = props.model.in ? 0 : 1

	const date = textToDate(props.model.date)
	setDate({
		model: date,
		text: props.model.date
	})


	const item = props.item_options.find(x => x.value === props.model.itemId)
	setItem(item)

	const department = props.departments.find(x => x.id === props.model.departmentId)
	setDepartment(department)

	const user = props.users.find(x => x.id === props.model.userId)
	setUser(user)
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}

function setDate(date) {
	if(date) {
		state.date = date
		state.form.date = date.text
	}
	else {
		state.date = null
		state.form.date = ''
	}
	checkDate()
}
function checkDate() {
	const key = 'date'
	if(state.form[key]) {
		state.errors.clear(key)
	}else {
		state.errors.set(key, [`${VALIDATE_MESSAGES.REQUIRED(getLabel(key))}`])
	}
}
function onInOutChanged(val) {
	
	if(val) { //out
		
	}else {
		setDepartment(null)
		setUser(null)
	} 
	console.log('onInOutChanged', val)
	checkErrors()
}
function setQty(val) {
	state.form.quantity = val
}
function setItem(item) {
	if(item) {
		state.item = item.title
		state.form.itemId = item.value
	}
	else {
		state.item = ''
		state.form.itemId = null
	}
	checkItem()
}
function checkItem() {
	const key = 'itemId'
	if(state.form[key]) {
		state.errors.clear(key)
	}else {
		state.errors.set(key, [`${VALIDATE_MESSAGES.REQUIRED(getLabel('item'))}`])
	}
}
function setDepartment(depatment) {
	if(depatment) {
		state.department = depatment.title
		state.form.departmentId = depatment.id
	}
	else {
		state.department = ''
		state.form.departmentId = null
	}
	checkDepartment()
}
function setUser(user) {
	console.log('setUser', user)
	if(user) {
		state.user = user.profiles.name
		state.form.userId = user.id
		const depatmentId = user.profiles.departmentId
		if(depatmentId) {
			const department = props.departments.find(x => x.id == depatmentId)
			setDepartment(department)
		}
	}
	else {
		state.user = ''
		state.form.userId = null
	}
	checkUser()
}
function checkUser() {
	const key = 'userId'
	if(state.out) {
		if(state.form[key]) {
			state.errors.clear(key)
		}else {
			state.errors.set(key, [`${VALIDATE_MESSAGES.REQUIRED(getLabel(key))}`])
		}
	}else {
		state.errors.clear(key)
	}
	
}
function checkDepartment() {
	const key = 'departmentId'
	if(state.out) {
		if(state.form[key]) {
			state.errors.clear(key)
		}else {
			state.errors.set(key, [`${VALIDATE_MESSAGES.REQUIRED(getLabel(key))}`])
		}
	}else {
		state.errors.clear(key)
	}
	
}
function checkErrors() {
	checkDate()
	checkItem()
	checkDepartment()
	checkUser()
	return !state.errors.any()
}
function onSubmit() {
	state.form.in = (state.out === 0)
	if(checkErrors()) {
		emit('submit', state.form)
	}
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
			<v-col cols="3">
				<ItemSelector :label="getLabel('item')" density="compact" variant="outlined"
				:clearable="false"
				:error_message="state.errors.get('itemId')"
				:keyword="state.item"
				:list="item_options"
				@selected="setItem"
				/>
			</v-col>
			<v-col cols="3">
				<CommonPickerDate :label="getLabel('date')" :value="state.form.date"
				:clearable="false"
				:error_message="state.errors.get('date')"
				@selected="setDate"
				/>
			</v-col>
			<v-col cols="2">
				<v-btn-toggle density="compact" class="float-right" color="primary" v-model="state.out"
				@update:modelValue="onInOutChanged"
				>
					<v-btn :style="state.out ? 'font-weight: lighter; font-size: 0.75em;' : 'font-size: 1.2em;'">
						進貨
					</v-btn>
					<v-btn :style="!state.out ? 'font-weight: lighter; font-size: 0.75em;' : 'font-size: 1.2em;'">
						出貨
					</v-btn>
        		</v-btn-toggle>
			</v-col>
			<v-col cols="4">
				<CommonPickerQuantity density="compact" variant="outlined" 
				label="數量" :qty="state.form.quantity" :min="1"
				@changed="setQty"
				/>
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="3">{{ state.user }}
				<UserSelector density="compact" variant="outlined"
				:clearable="true"
				:error_message="state.errors.get('userId')"
				:keyword="state.user"
				:list="users"
				@selected="setUser"
				/>
			</v-col>
			<v-col cols="3"> {{ state.department }}
				<DepartmentSelector density="compact" variant="outlined"
				:clearable="true"
				:error_message="state.errors.get('departmentId')"
				:keyword="state.department"
				:list="departments"
				@selected="setDepartment"
				/>
			</v-col>
			<v-col cols="6">
				
			</v-col>
		</v-row>
		<v-row dense>
			<v-col cols="12">
				<v-textarea auto-grow :label="labels['ps']" 
				rows="2" density="compact" 
				v-model="state.form.ps"	
				/>
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

<style scoped>
</style>