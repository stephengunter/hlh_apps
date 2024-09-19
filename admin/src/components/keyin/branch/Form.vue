<script setup>
import { reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { UPLOAD_KEYINS_BRANCHES } from '@/store/actions.type'
import { deepClone, onErrors, setValues } from '@/utils'

const name = 'KeyinBranchForm'
const store = useStore()
const emit = defineEmits(['submit'])
const props = defineProps({
	model: {
		type: Object,
		default: null
	},
	year_options: {
      type: Array,
      default: () => []
   },
	month_options: {
      type: Array,
      default: () => []
   }
})

const initialState = {
	form: {
		year: 0,
		month: 0,
		file: null,
		records: []
   }
}
const state = reactive(deepClone(initialState))
const has_records = computed(() => {
	if(state.form.records && state.form.records.length) {
		return true
	}
	return false
})

onBeforeMount(init)

function init() {
	setValues(props.model, state.form)
}
function onSubmit() {
	emit('submit', state.form)
}

function onFileAdded(files) {
	if(!files.length) {
		state.form.records = []
		return
	} 
	store.dispatch(UPLOAD_KEYINS_BRANCHES, { file: files[0]})
	.then(records => {
		state.form.records = records.slice(0)
	})
	.catch(error => onErrors(error))
}
</script>

<template>
	<form @submit.prevent="onSubmit">
		<v-row dense>
			<v-col cols="3">
				<CommonInputUpload ref="file_upload" :multiple="false" :show_button="true"
				:is_media="false" :allow_types="['.xlsx', '.xls']"
				@file-added="onFileAdded" @file-removed="onFileAdded"
				/>
			</v-col>
			<v-col cols="3">
				<v-select density="compact" v-show="has_records"
				:items="year_options" v-model="state.form.year"
				/>
			</v-col>
			<v-col cols="3">
				<v-select density="compact" v-show="has_records"
				:items="month_options" v-model="state.form.month"
				/>
			</v-col>
			<v-col cols="3">
				<v-btn color="success" v-show="has_records"
				type="submit"
				>
				存檔
				</v-btn>
			</v-col>
		</v-row>
		<v-row dense v-show="has_records">
			<v-col cols="12">
				<KeyinBranchTable :list="state.form.records" />
			</v-col>
		</v-row>
	</form>
</template>