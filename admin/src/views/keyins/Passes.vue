<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ACTION_TYPES, ENTITY_TYPES, WIDTH } from '@/consts'
import { FETCH_KEYINS_PASSES, UPLOAD_KEYINS_PASSES, STORE_KEYINS_PASSES, EXPORT_KEYINS_PASSES_REPORT } from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , downloadFile, showConfirm, hideConfirm,
	onErrors, onSuccess, setValues, is400, bytesToBinary, getMimeType,
	resolveErrorData
} from '@/utils'

const name = 'KeyinsPassesView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.KEYIN
const initialState = {
	list: [],
	form: {
		title: '',
		active: false,
		model: {
			file: null,
			records: []
		},
		action: '',
		width: WIDTH.L
	}
}
const state = reactive(deepClone(initialState))

onBeforeMount(fetchData)

function fetchData() {
	state.can_report = false
	store.commit(CLEAR_ERRORS)
	store.dispatch(FETCH_KEYINS_PASSES)
	.then(list => {
		state.list = list
	})
	.catch(error => onErrors(error))
}
function onUpload(query) {
	state.form.title = `上傳免測人員`,
	state.form.model = {
		file: null,
		records: []
	}

	state.form.action = UPLOAD_KEYINS_PASSES
	state.form.width = WIDTH.L
	state.form.active = true
}

function onFileAdded(files) {
	if(!files.length) {
		state.form.model.records = []
		return
	} 
	store.dispatch(state.form.action, { file: files[0]})
	.then(records => {
		state.form.model.records = records.slice(0)
	})
	.catch(error => onErrors(error))
}
function onSubmit() {
	let model = {
		persons: state.form.model.records
	}
	store.dispatch(STORE_KEYINS_PASSES, model)
	.then(() => {
		fetchData()
		onCancel()
	})
	.catch(error => onErrors(error))
}
function onCancel() {
	state.form = deepClone(initialState.form)
}

function onReport() {
	store.dispatch(EXPORT_KEYINS_PASSES_REPORT, {})
	.then(model => {
		const ext = '.pdf'
		const fileName = model.fileName
		const fileBytes = bytesToBinary(model.fileBytes)
		const blob = new Blob([fileBytes], { type: getMimeType(ext) })
		downloadFile(blob, fileName)
	})
	.catch(error => onErrors(error))
}
</script>

<template>
<div>
	<v-row dense>
		<v-col cols="9">
			<h2>免測人員</h2>
		</v-col>
		<v-col cols="3">
			<v-tooltip text="上傳">
				<template v-slot:activator="{ props }">
					<v-btn class="float-right ml-1"
					icon="mdi-upload" v-bind="props" size="small" color="info"
					@click.prevent="onUpload"
					/>
				</template>
			</v-tooltip>
			<v-tooltip text="報表" v-if="state.list.length">
				<template v-slot:activator="{ props }">
					<v-btn class="float-right" 
					icon="mdi-file-document" v-bind="props" size="small" color="warning"
					@click.prevent="onReport"
					/>
				</template>
			</v-tooltip>
			
		</v-col>
	</v-row>
	<v-row dense>
		<v-col cols="12">
			<KeyinPassesTable 
			:list="state.list"
			/>
		</v-col>
	</v-row>
	<v-dialog persistent v-model="state.form.active" :width="state.form.width + 50">
		<v-card v-if="state.form.active" :max-width="state.form.width">
			<CommonCardTitle :title="state.form.title"
			@cancel="onCancel"  
			/>
			<v-card-text>
				<form @submit.prevent="onSubmit">
					<v-row dense>
						<v-col cols="3">
							<CommonInputUpload ref="file_upload" :multiple="false" :show_button="true"
							:is_media="false" :allow_types="['.txt']"
							@file-added="onFileAdded" @file-removed="onFileAdded"
							/>
						</v-col>
						<v-col cols="3">
						</v-col>
						<v-col cols="3">
						</v-col>
						<v-col cols="3">
							<v-btn color="success" v-show="state.form.model.records.length"
							type="submit"
							>
							存檔
							</v-btn>
						</v-col>
					</v-row>
					<v-row dense v-show="state.form.model.records.length">
						<v-col cols="12">
							<KeyinPassesTable :list="state.form.model.records" />
						</v-col>
					</v-row>
				</form>
			</v-card-text>
		</v-card>
	</v-dialog>
</div>
</template>
