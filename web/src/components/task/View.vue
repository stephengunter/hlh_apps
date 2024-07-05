<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { deepClone, dateTextToRoc, isSameDay, getTimeString
} from '@/utils'
import { ENTITY_TYPES, ACTION_TYPES, WIDTH } from '@/consts'

const name = 'EventView'
const store = useStore()
const route = useRoute()
const router = useRouter()
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
const emit = defineEmits(['edit'])

const initialState = {
	
}

onBeforeMount(init)

function init() {
   console.log(props.model)
}


const state = reactive(deepClone(initialState))

function edit() {
	emit('edit', props.model.id)
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
		<v-row>
			<v-col cols="9">
				<span class="text-h5 font-weight-black" v-text="model.title"></span>
				
			</v-col>
			<v-col cols="3">
				<span class="text-subtitle-2" v-text="labels['deadLine']"></span>
				<div>
					<span v-text="dateTextToRoc(model.deadLineText, true)"></span>
				</div>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<article v-html="model.content">
				</article>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<v-card :max-width="WIDTH.M">
					<v-card-title>
						<span class="text-h5" v-text="REFERENCE['title']"></span>
					</v-card-title>
					<v-card-text>
						<ReferenceTable :read_only="true"
						:list="model.references" 
						@remove="removeReference" @edit="editReference"
						/>
						
					</v-card-text>
				</v-card>
				
			</v-col>
		</v-row>
	</div>	
</template>