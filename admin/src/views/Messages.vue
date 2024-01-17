<script setup>
import { ref, reactive, computed, onBeforeMount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { CLEAR_ERROR, SET_ERROR } from '@/store/mutations.type'
import { FETCH_MESSAGES, EDIT_MESSAGE } from '@/store/actions.type'
import { onError, scrollToTop } from '@/utils'
import { DIALOG_MAX_WIDTH } from '@/config'
const name = 'MessagesView'
const store = useStore()

const params = reactive({
	status: 0,
	start: '',
	end: '',
	page: 1,
	pageSize: 10
})
const dateSelector = reactive({
	status: 0,
	start: '',
	end: ''
})
         
const statusOptions = ref([{
		value: 0,
		text: '未回覆'
	},{
		value: 1,
		text: '已回覆'
	}])
			
const editor = reactive({
	active: false,
	maxWidth: DIALOG_MAX_WIDTH,
	model: null,
})
const responsive = computed(() => store.getters.responsive)
const contentMaxWidth = computed(() => store.getters.contentMaxWidth)
const pagedList = computed(() => store.state.messages.pagedList)
const dataList = computed(() => pagedList.value ? pagedList.value.viewList : [])
 
onBeforeMount(fetchData)

function onParamsChanged() {
	nextTick(fetchData)
}
function fetchData() {
	store.dispatch(FETCH_MESSAGES, params)
	.then(() => {
		if(params.page < 1) params.page = 1
	})
	.catch(error => {
		onError(error)
	})

	//scrollToTop()
}
function selectDate() {
	dateSelector.start = params.start
	dateSelector.end = params.end
	dateSelector.maxWidth = contentMaxWidth ? contentMaxWidth : DIALOG_MAX_WIDTH
	dateSelector.version += 1
	dateSelector.active = true
}
function	onDateSelected({ start, end }) {
	params.start = start
	params.end = end

	dateSelector.active = false
	dateSelector.text = ''
	if(start) dateSelector.text = `${start} 起`
	if(end) dateSelector.text += ` ${end} 止`

	fetchData()
}
function clearDate() {
	onDateSelected({ start: '', end: '' })
}
function setEditModel(model) {
	if(model) {
		editor.model = model
		editor.maxWidth = contentMaxWidth ? contentMaxWidth : DIALOG_MAX_WIDTH
		editor.active = true
	}else {
		editor.model = null
		editor.active = false
	}
}
function onEdit(id) {
	store.commit(CLEAR_ERROR)
	store.dispatch(EDIT_MESSAGE, id)
	.then(model => {
		setEditModel(model)
	})
	.catch(error => {
		onError(error)
	})
}
function cancelEdit() {
	setEditModel(null)
}
function onSaved() {
	Bus.emit('success')
	fetchData()
	setEditModel(null)
}
</script>
<template>
   <core-container>
      <v-row>
         <v-col cols="12" sm="6">
            <v-radio-group v-model="params.status" @change="onParamsChanged" inline>
               <v-radio v-for="(item, index) in statusOptions" :key="index"
               :label="item.text" :value="item.value"					
               />
            </v-radio-group>
         </v-col>
         <!-- <v-col cols="12" sm="6">
            <v-text-field v-model="dateSelector.text" label="日期" clearable readonly
				@click.prevent="selectDate" @click:clear="clearDate"
            />
         </v-col> -->
      </v-row>
      <v-row v-if="pagedList">
         <v-col cols="12">
            <message-table :list="dataList"
				@edit="onEdit"
				/>
         </v-col>
      </v-row>
		<CoreTablePager v-if="pagedList" v-show="dataList.length > 0"
		:model="pagedList" :responsive="responsive"
		@page_changed="(val) => {
			params.keyword = val
			onParamsChanged()
		}" 
		@size_changed="(val) => {
			params.pageSize = val
			onParamsChanged()
		}" 
		/>
		<!-- <v-dialog v-model="dateSelector.active" :max-width="dateSelector.maxWidth" persistent>
			<CorePeriodSelector
			:version="dateSelector.version"
			:start="dateSelector.start" :end="dateSelector.end"
			@submit="onDateSelected" @cancel="dateSelector.active = false"
			/>
		</v-dialog> -->

		<!-- <v-dialog v-model="editor.active" persistent :max-width="editor.maxWidth">
			<div v-if="editor.model">
				<MessageDetails v-if="editor.model.returned" :model="editor.model"
				@cancel="cancelEdit"
				/>
				<MessageEdit v-else :model="editor.model"
				@saved="onSaved" @cancel="cancelEdit"
				/>
			</div>
		</v-dialog> -->
   </core-container>
</template>
