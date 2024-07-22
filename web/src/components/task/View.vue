
<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { deepClone, dateTextToRoc, replaceNewLineWithBR } from '@/utils'
import { ENTITY_TYPES, ACTION_TYPES, WIDTH } from '@/consts'

const name = 'TaskView'
const REFERENCE = ENTITY_TYPES.REFERENCE

const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	labels: {
		type: Object,
		default: () => {}
	},
	can_edit: {
		type: Boolean,
		default: true
	},
	hide_title: {
		type: Boolean,
		default: false
	}
})
const emit = defineEmits(['edit'])

const initialState = {
	
}
const state = reactive(deepClone(initialState))

function getContent(content) {
	return replaceNewLineWithBR(content)
}

function onEdit() {
	emit('edit', props.model.id)
}

</script>

<template>
	<v-card v-if="props.model">
		<v-card-title v-if="can_edit">
			<span v-if="!props.hide_title" class="text-h5 font-weight-black" v-text="model.title"></span>			
			
			<CommonButtonEdit  class_name="float-right" tooltip="編輯" size="x-small"
			@edit="onEdit"	
			/>
		</v-card-title>
		<v-card-text>
			<v-row>
				<v-col cols="9">
					<article v-html="getContent(model.content)"></article>
				</v-col>
				<v-col cols="3">
				<span class="text-subtitle-2" v-text="labels['deadLine']"></span>
				<div>
					<span v-text="dateTextToRoc(model.deadLineText, true)"></span>
				</div>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="9">
				<span class="text-subtitle-2" v-text="REFERENCE['title']"></span>
				<ReferenceTable :read_only="true"
				:list="model.references" 
				/>
			</v-col>
			<v-col cols="3">
				<span class="text-subtitle-2">執行進度</span>
				
			</v-col>
		</v-row>
		</v-card-text>
	</v-card>
</template>