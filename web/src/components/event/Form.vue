<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, helpers } from '@vuelidate/validators'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , areObjectsEqual, initByDate,
	setValues, badRequest, isValidDate, datetimeText
} from '@/utils'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { CALENDAR_TYPES, ROUTE_NAMES, ENTITY_TYPES, ACTION_TYPES, HEIGHT } from '@/consts'

const name = 'EventForm'
const store = useStore()
const route = useRoute()
const router = useRouter()
const ENTITY_TYPE = ENTITY_TYPES.EVENT

const props = defineProps({
	type: {
		type: String,
		default: ''
	},
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
const emit = defineEmits(['submit', 'remove'])


const calendar_key = computed(() => props.type ? props.type.toUpperCase() : '')

function onSubmit(form) {
	emit('submit', form)
}
function onRemove(id) {
	emit('remove', id)
}

</script>

<template>
   <div>
		<EventAllForm v-if="calendar_key === CALENDAR_TYPES.HLH" 
		:labels="props.labels"
		:model="props.model" :calendars="props.calendars"
		@submit="onSubmit"  @remove="onRemove"
		/>
		<EventEcForm v-if="calendar_key === CALENDAR_TYPES.EC" 
		:labels="props.labels"
		:model="props.model" :calendars="props.calendars"
		@submit="onSubmit"  @remove="onRemove"
		/>
	</div>
</template>