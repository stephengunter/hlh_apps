<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { deepClone, dateToRocFormat, isSameDay, getTimeString
} from '@/utils'
import { ENTITY_TYPES, ACTION_TYPES } from '@/consts'
import { el } from 'date-fns/locale'

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

const dateString = computed(() => {
	const allDay = props.model.allDay
	const start = new Date(props.model.startDate)
	const end = new Date(props.model.endDate)
	console.log(allDay, start, end)
	const sameDay = isSameDay(start, end)
	if(sameDay) {
		if(allDay) return dateToRocFormat(start)
		return `${dateToRocFormat(start, true)} ~ ${getTimeString(end)}`
	}else {
		return `${dateToRocFormat(start)} ~ ${dateToRocFormat(end)}`
	}
})


const state = reactive(deepClone(initialState))

function edit() {
	emit('edit', props.model.id)
}

</script>

<template>
		<v-row>
			<v-col cols="12">
				<p class="text-h5">
					{{ model.title }}
				</p>
			</v-col>
		</v-row>	
		<v-row>
			<v-col cols="4" v-if="model.allday">
				<v-checkbox
				v-model="model.allday" readonly color="primary"
				:label="labels['allDay']" hide-details
				/>
			</v-col>
			<v-col cols="4" v-else>
				<span class="text-subtitle-2">日期：</span>
				<div>
					<span v-text="dateString"></span>
				</div>
			</v-col>
			<v-col cols="4">
				<span class="text-subtitle-2">地點：</span>
				<div >
					<span>簡報室</span>
				</div>
			</v-col>
			<v-col cols="4">
				<div >
					<v-chip class="ma-1" color="primary" variant="flat">Chip</v-chip>
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
				<v-tooltip v-if="model.canEdit" :text="ACTION_TYPES.EDIT['title']">
					<template v-slot:activator="{ props }">
						<v-btn  class="float-right"
						v-bind="props" icon="mdi-pencil"  size="small" color="info"
						@click.prevent="edit"
						/>
					</template>
				</v-tooltip>
			</v-col>
		</v-row>
</template>