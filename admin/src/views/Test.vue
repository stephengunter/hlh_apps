<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { DIALOG_MAX_WIDTH } from '@/config'
import { FETCH_ROLES, LOGIN
} from '@/store/actions.type'
import { deepClone, onErrors, setValues, formatTime } from '@/utils'
import { useClipboard } from '@vueuse/core'

const { text, isSupported, copy } = useClipboard()
const store = useStore()
const input = ref('')

const initialState = {
	form: {
		roles: []
	},
	text: '',
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
	time: ''
}

const state = reactive(deepClone(initialState))

const roles = computed(() => store.state.roles.list)
onBeforeMount(init)

function init() {
	state.time = formatTime(930)
}
function onSubmit() {
	
	store.dispatch(LOGIN)
}	
function onCopy() {
	copy(state.text)
}	
function onDateSelected({ date, model }, check) {
	state.date.date = date
	state.date.model = deepClone(model)
	state.date.value = model.text_cn

	return
	state.task.deadLine = date

	if(!check) return
	const err_msg = checkDeadLine(state.task.deadLine)
	if(err_msg) {
		state.errors.set('deadLine', [err_msg])		
	}else {		
		state.errors.clear('deadLine')
	}

}
</script>

<template>
	<div>
		<CommonPickerTime label="deadLine" :value="state.time"
		/>
	</div>
</template>