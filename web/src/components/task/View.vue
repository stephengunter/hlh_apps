<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { deepClone, dateTextToRoc, isSameDay, getTimeString
} from '@/utils'
import { ENTITY_TYPES, ACTION_TYPES } from '@/consts'
import { el, tr } from 'date-fns/locale'

const name = 'EventView'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.EVENT

const props = defineProps({
   model: {
		type: Object,
		default: null
	},
	labels: {
		type: Object,
		default: () => {}
	},
	calendars: {
		type: Array,
		default: () => []
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

</script>

<template>
	<div>
		<v-row>
			<v-col cols="9">
				<p class="text-h5">
					{{ model.title }}
				</p>
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
				<!-- <ReferenceTable :list="state.form.references" 
				@remove="removeReference" @edit="editReference"
				/> -->
			</v-col>
		</v-row>
	</div>	
</template>