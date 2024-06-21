<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import Errors from '@/common/errors'
import { getDatePickerModel, deepClone , areObjectsEqual, initByDate,
	setValues, badRequest, isValidDate, uuid
} from '@/utils'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { WIDTH, VALIDATE_MESSAGES, ROUTE_NAMES, ENTITY_TYPES, ACTION_TYPES, HEIGHT } from '@/consts'

const name = 'TaskRootForm'
const store = useStore()
const route = useRoute()
const router = useRouter()
const TASK = ENTITY_TYPES.TASK
const REFERENCE = ENTITY_TYPES.REFERENCE


const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	labels: {
		type: Object,
		default: () => {}
	}
})
const emit = defineEmits(['submit', 'remove'])

const initialState = {
	form: {
		id: 0,
		title: '',
		content: '',
		deadLine: null,
		done: false,
		references: []
   },
	date: {
		date: null,
		value: '',
		model: {
			text: '',
			text_cn: '',
			num: 0
		},
		error_message: ''
	},
	dialog: {
		key: '',
		action: '',
		title: '',
		active: false,		
		model: {},
		action: ''
	},
	errors: new Errors()
}
const state = reactive(deepClone(initialState))

const canRemove = computed(() => {
	if(!props.model.id) return false
	if(props.model.active) return false
	return true
})


const rules = computed(() => {
	return {
		title: { 
			required: helpers.withMessage(VALIDATE_MESSAGES.REQUIRED(props.labels['title']), required)
		}
	}
})
const v$ = useVuelidate(rules, state.form)


onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
	console.log(props.model.deadLine)
	console.log(state.form.deadLine)

	let date = props.model.deadLine
	let model = getDatePickerModel(date)
	 
	state.date.date = state.form.deadLine
	state.date.model = getDatePickerModel()

	onDateSelected({ date, model }, false)
}

function onDateSelected({ date, model }) {
	state.date.date = date
	state.date.model = deepClone(model)
	state.date.value = model.text_cn

	state.form.deadLine = date

	if(checkDeadLine(state.form.deadLine)) {
		state.date.error_message = ''
	}else {
		state.date.error_message = `${labels.value['deadLine']}不正確`
	}

}
function checkDeadLine(date) {
   console.log('checkDeadLine', date)
	return true
}
function onSubmit() {
	v$.value.$validate().then(valid => {
		if(!valid) return

		if(state.errors.any()) return
		emit('submit', state.form)
	})
}
function onRemove(id) {
	emit('remove', id)
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
}
function onAddSub() {

}
function onAddReference() {
	state.dialog.key = REFERENCE.name
	state.dialog.action = ACTION_TYPES.CREATE.name
	state.dialog.title = `新增${REFERENCE.title}`
	state.dialog.model = {
		id: 0,
		uuid: uuid(),
		title: '',
      url: '',
      file: null
	}
	state.dialog.active = true
}
function onCancelDialog() {
	state.dialog.active = false
	state.dialog = { ...initialState.dialog }
}
function onReferenceSubmit(model) {
	setValues(model, state.dialog.model)
	if(state.dialog.action == ACTION_TYPES.CREATE.name) {
		state.form.references.push(state.dialog.model)
	}else {
		const uuid = state.dialog.model.uuid
		const index = state.form.references.findIndex(x => x.uuid === uuid)		
		state.form.references.splice(index, 1, state.dialog.model)
	}
	
	onCancelDialog()
}
function editReference(index) {
	state.form.references[index]
	state.dialog.key = REFERENCE.name
	state.dialog.action = ACTION_TYPES.EDIT.name
	state.dialog.title = `${ACTION_TYPES.EDIT.title}${REFERENCE.title}`
	state.dialog.model = deepClone(state.form.references[index]) 
	state.dialog.model.uuid = uuid()
	state.dialog.active = true
}
function removeReference(index) {
	state.form.references.splice(index, 1)
}

</script>

<template>
<div>	
   <form @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row dense>
			<v-col cols="10">
				<v-text-field :label="labels['title']"           
				v-model="state.form.title"
				:error-messages="v$.title.$errors.map(e => e.$message)"                     
				@input="v$.title.$touch"
				@blur="v$.title.$touch"
				/>
			</v-col>
			<v-col cols="2">
				<CommonPickerRocDate :label="labels['deadLine']"
				:clearable="true"
				:error_message="state.date.error_message"
				:date="state.date.date" :value="state.date.value"
				@ready="(model) => onDateSelected(model)"
				@selected="(model) => onDateSelected(model)"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="4">
				<span class="text-h5 font-weight-black" v-text="REFERENCE.title"></span>
				<CommonButtonCreate :tooltip="`新增${REFERENCE.title}`" 
				class_name="float-right" size="x-small"
				@create="onAddReference"
				/>
			</v-col>
			<v-col cols="4">
			</v-col>
			<v-col cols="4">
				
			</v-col>
			<v-col cols="12">
				<v-card variant="outlined">
				<ReferenceTable :list="state.form.references" 
				@remove="removeReference" @edit="editReference"
				/>
			</v-card>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="4">
				<span class="text-h5 font-weight-black">子任務</span>
				<CommonButtonCreate tooltip="新增子任務" 
				class_name="float-right" size="x-small"
				@create="onAddSub"
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
					{{ ACTION_TYPES.REMOVE['title'] }}
				</v-btn>
				<v-btn type="submit" color="success" class="float-right">
				{{ ACTION_TYPES.SAVE['title'] }}
				</v-btn>
			</v-col>
		</v-row>
	</form>
	<v-dialog persistent v-model="state.dialog.active" :width="WIDTH.M + 50">
		<v-card v-if="state.dialog.active" :max-width="WIDTH.M">
			<CommonCardTitle :title="state.dialog.title" 
			@cancel="onCancelDialog"  
			/>
			<v-card-text>
				<ReferenceForm v-if="state.dialog.key === REFERENCE.name"
				:model="state.dialog.model"
				@submit="onReferenceSubmit"
				/>
				
			</v-card-text>
		</v-card>
	</v-dialog>
</div>
</template>