<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import Errors from '@/common/errors'
import { getDatePickerModel, deepClone , isDirty, removeHtmlTags, replaceNewLineWithBR,
	setValues, badRequest, isValidDate, uuid
} from '@/utils'
import Reference from '@/models/reference'
import Item from '@/models/item'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { WIDTH, VALIDATE_MESSAGES, ROUTE_NAMES, ENTITY_TYPES, ACTION_TYPES, HEIGHT } from '@/consts'

const name = 'TaskForm'
const store = useStore()
const route = useRoute()
const router = useRouter()
const TASK = ENTITY_TYPES.TASK
const REFERENCE = ENTITY_TYPES.REFERENCE
const ITEM = ENTITY_TYPES.ITEM


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
	task: {
		id: 0,
		parentId: 0,
		title: '',
		content: '',
		deadLine: null,
		done: false
   },
	references: [],
	dirty_reference_ids: [],
	removed_reference_ids: [],

	items: [],
	dirty_item_ids: [],
	removed_item_ids: [],

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
		action: '',
		width: WIDTH.M
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
const v$ = useVuelidate(rules, state.task)


onBeforeMount(init)

function init() {
	setValues(props.model, state.task)

	let date = null 
	let deadLine = props.model.deadLine 
	if(deadLine && isValidDate(deadLine)) {
		if(deadLine instanceof Date) date = deadLine
		else date = new Date(deadLine)
	}
	let model = getDatePickerModel(date)
	onDateSelected({ date, model }, false)

	initReferences(props.model.references)
}
function initReferences(references) {
	if(references && references.length) {
		props.model.references.forEach(reference => {
			let model = new Reference(reference)
			if(reference.attachment) model.setAttachment(reference.attachment)
			state.references.push(model)
		})
	}
}
 
function onDateSelected({ date, model }, check) {
	state.date.date = date
	state.date.model = deepClone(model)
	state.date.value = model.text_cn

	state.task.deadLine = date

	if(!check) return
	const err_msg = checkDeadLine(state.task.deadLine)
	if(err_msg) {
		state.errors.set('deadLine', [err_msg])		
	}else {		
		state.errors.clear('deadLine')
	}

}
function checkDeadLine(date) {
	if(date) return ''
	return `必須填寫${props.labels['deadLine']}`
}
function onSubmit() {
	v$.value.$validate().then(valid => {
		if(!valid) return		
		if(state.errors.any()) return

		let model = deepClone(state.task)
		model.content = removeHtmlTags(model.content)

		model.references = []
		state.references.forEach(item => {
			if(item.id) {
				if(state.dirty_reference_ids.includes(item.id)) model.references.push(item)
			}else {
				model.references.push(item)
			}			
		})

		model.items = []
		state.items.forEach(item => {
			if(item.id) {
				if(state.dirty_item_ids.includes(item.id)) model.items.push(item)
			}else {
				model.items.push(item)
			}			
		})
		let removed = {
			reference_ids: state.removed_reference_ids.slice(),
			item_ids: state.removed_item_ids.slice()
		}
		emit('submit', { model, removed })
	})
}
function onRemove(id) {
	emit('remove', id)
}
function onInputChanged(){
   store.commit(CLEAR_ERRORS)
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
	if(model.url) {
		state.dialog.model.attachment = null
		state.dialog.model.attachmentId = 0
	}	

	if(state.dialog.action == ACTION_TYPES.CREATE.name) {
		setValues(model, state.dialog.model)
		let reference = new Reference(state.dialog.model)
		let file = state.dialog.model.file
		if(file) reference.setFile(file)
		state.references.push(reference)		
	}else {
		const uuid = state.dialog.model.uuid
		const index = state.references.findIndex(x => x.uuid === uuid)

		let dirty = false
		if(model.file) {
			state.dialog.model.attachment = null
			state.dialog.model.attachmentId = 0
			dirty = true
		}else dirty = isDirty(model, state.dialog.model)

		setValues(model, state.dialog.model)
		state.references.splice(index, 1, state.dialog.model)
		if(dirty) {
			const id = state.dialog.model.id
			if(id && !state.dirty_reference_ids.includes(id)) {
				state.dirty_reference_ids.push(id)
			}
		}
	}
	
	onCancelDialog()
}
function editReference(index) {	 
	state.dialog.key = REFERENCE.name
	state.dialog.action = ACTION_TYPES.EDIT.name
	state.dialog.title = `${ACTION_TYPES.EDIT.title}${REFERENCE.title}`
	
	let model = state.references[index]
	if(!model.uuid) model.uuid = uuid()

	state.dialog.model = deepClone(model)
	state.dialog.active = true
}
function removeReference(index) {
	const model = state.references[index]
	if(model.id && !state.removed_reference_ids.includes(model.id)) {
		state.removed_reference_ids.push(model.id)
	}
	state.references.splice(index, 1)
}

function onAddItem() {
	state.dialog.key = ITEM.name
	state.dialog.action = ACTION_TYPES.CREATE.name
	state.dialog.title = `新增應辦事項`
	state.dialog.width = WIDTH.L
	state.dialog.model = {
		id: 0,
		uuid: uuid(),
		title: '',
		done: false,
      files: []
	}
	state.dialog.active = true
}
function editItem(index) {	 
	state.dialog.key = ITEM.name
	state.dialog.action = ACTION_TYPES.EDIT.name
	state.dialog.title = `${ACTION_TYPES.EDIT.title}應辦事項`
	
	let model = state.items[index]
	console.log(model)
	if(!model.uuid) model.uuid = uuid()

	state.dialog.model = deepClone(model)
	state.dialog.active = true
}
function removeItem(index) {
	const model = state.items[index]
	if(model.id && !state.removed_item_ids.includes(model.id)) {
		state.removed_item_ids.push(model.id)
	}
	state.items.splice(index, 1)
}
function onItemSubmit({ model, files }) {
	if(state.dialog.action == ACTION_TYPES.CREATE.name) {
		setValues(model, state.dialog.model)
		let item = new Item(state.dialog.model)
		if(files) item.setFiles(files)
		state.items.push(item)		
	}else {
		const uuid = state.dialog.model.uuid
		const index = state.items.findIndex(x => x.uuid === uuid)
		
		setValues(model, state.dialog.model)
		state.items.splice(index, 1, state.dialog.model)

		// let dirty = false
		// if(model.file) {
		// 	state.dialog.model.attachment = null
		// 	state.dialog.model.attachmentId = 0
		// 	dirty = true
		// }else dirty = isDirty(model, state.dialog.model)

		// setValues(model, state.dialog.model)
		// state.references.splice(index, 1, state.dialog.model)
		// if(dirty) {
		// 	const id = state.dialog.model.id
		// 	if(id && !state.dirty_reference_ids.includes(id)) {
		// 		state.dirty_reference_ids.push(id)
		// 	}
		// }
	}	

	onCancelDialog()
}

</script>

<template>
<div>	
   <form  @submit.prevent="onSubmit" @input="onInputChanged">
		<v-row dense>
			<v-col cols="10">
				<v-text-field :label="labels['title']"           
				v-model="state.task.title"
				:error-messages="v$.title.$errors.map(e => e.$message)"                     
				@input="v$.title.$touch"
				@blur="v$.title.$touch"
				/>
			</v-col>
			<v-col cols="2">
				<CommonPickerRocDate :label="labels['deadLine']"
				:clearable="true"
				:error_message="state.errors.has('deadLine') ? state.errors.get('deadLine') : ''"
				:date="state.date.date" :value="state.date.value"
				@ready="(model) => onDateSelected(model, false)"
				@selected="(model) => onDateSelected(model, true)"
				/>
			</v-col>
			<v-col cols="12">
				<v-textarea :label="labels['content']" variant="outlined"
				row-height="15" rows="3" auto-grow
				v-model="state.task.content"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<v-card variant="outlined">
					<v-card-title>
						<span class="text-h5" v-text="REFERENCE['title']"></span>
						<CommonButtonCreate :tooltip="`新增${REFERENCE.title}`" 
						class_name="float-right" size="x-small"
						@create="onAddReference"
						/>
					</v-card-title>
					<v-card-text v-if="state.references.length">
						<ReferenceTable :read_only="false"
						:list="state.references" 
						@remove="removeReference" @edit="editReference"
						/>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<v-card variant="outlined">
					<v-card-title>
						<span class="text-h5">應辦事項</span>
						<CommonButtonCreate tooltip="新增應辦事項" 
						class_name="float-right" size="x-small"
						@create="onAddItem"
						/>
					</v-card-title>
					<v-card-text v-if="state.references.length">
						<ItemTable :read_only="false"
						:list="state.items" 
						@remove="removeItem" @edit="editItem"
						/>
					</v-card-text>
				</v-card>
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
	<v-dialog persistent v-model="state.dialog.active" :width="state.dialog.width + 50">
		<v-card v-if="state.dialog.active" :max-width="state.dialog.width">
			<CommonCardTitle :title="state.dialog.title" 
			@cancel="onCancelDialog"  
			/>
			<v-card-text>
				<ReferenceForm v-if="state.dialog.key === REFERENCE.name"
				:model="state.dialog.model"
				@submit="onReferenceSubmit"
				/>
				<ItemForm v-if="state.dialog.key === ITEM.name"
				:model="state.dialog.model"
				@submit="onItemSubmit"
				/>
			</v-card-text>
		</v-card>
	</v-dialog>
</div>
</template>