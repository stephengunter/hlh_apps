<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , activeOptions, areObjectsEqual, reviewedOptions,
	setValues, badRequest, tryParseInt, isTrue, getValue
} from '@/utils'
import { WIDTH } from '@/consts'

const name = 'UserHead'
const emit = defineEmits(['submit', 'create', 'sync', 'updown'])
defineExpose({
   init, setQuery, getQuery, setPageOption
})

const store = useStore()
const route = useRoute()
const router = useRouter()

const props = defineProps({
	query: {
      type: Object,
      default: null
   },
	labels: {
      type: Object,
      default: null
   },
	roles: {
      type: Array,
      default: () => []
   },
	active_options: {
      type: Array,
      default: () => []
   },
	departments: {
      type: Array,
      default: () => []
   },
	root_hlh: {
      type: Object,
      default: null
   },
	show_down: {
      type: Boolean,
      default: false
   },
})
const initialState = {
	query: {
	},
	form: {
		title: '選擇部門',
		active: false
	},
	department_options: [{ value: 0, title: 'All' }]
}
const state = reactive(deepClone(initialState))

const tree = ref(null)

const active_options = activeOptions
const updown_title = computed(() => {
	if(state.query.active) return '下架'
	return '上架'
})
const department_options = computed(() => {
	let options = [{ value: 0, title: 'All' }]
	let id = state.query.department
	if(id) {
		let department = props.departments.find(x => x.id === id)
		options.splice(0, 0, {
			value: id,
			title: department.title
		})
	}
	return options
})
const role_options = computed(() => {
	let options = props.roles.map(role => ({ value: role.name, title: role.title }))
	options.splice(0, 0, {
	   value: '',
	   title: 'All'
	})
	return options
})
const query_match_route = computed(() => {
	if(route.query) {
		return areObjectsEqual(state.query, route.query, true)
	} return false
})
watch(route, init)

function init() {
   if(isEmptyObject(route.query)) {
		router.push({ path: route.path, query: { ...props.query } })
      return
	}
	state.query = { ...route.query }

	state.query.active = isTrue(state.query.active)
	state.query.department = tryParseInt(state.query.department)
	state.query.page = tryParseInt(state.query.page)
	state.query.pageSize = tryParseInt(state.query.pageSize)
   emit('submit', state.query)
}
function setQuery(model) {
   setValues(model, state.query)
}
function getQuery() {
   return state.query
}
function setPageOption(option) {
	if(option.hasOwnProperty('page')) state.query.page = option.page
	if(option.hasOwnProperty('size')) state.query.pageSize = option.size
	onSubmit()
}
function selectDepartment() {
	state.form.title = '選擇部門'
	state.form.active = true
}
function setDepartment(id) {
	if(id === props.root_hlh.id) state.query.department = 0
	else state.query.department = id
	
	onQueryChanged()
	onCancel()
}
function getLabel(key) {
	if(isEmptyObject(props.labels)) return ''
   return getValue(props.labels, key)
}
function onCancel() {
	state.form = deepClone(initialState.form)
}
function onRoleChanged() {	
	onSubmit()
}
function onQueryChanged() {
	state.query.page = 1
	onSubmit()
}

function onKeywordChanged(val) {
	state.query.keyword = val
	onSubmit()
}
function onSubmit() {
	if(query_match_route.value) emit('submit', state.query)
	else router.push({ path: route.path, query: { ...state.query } })	
}
function onCreate() {
	emit('create')
}
function onSync() {
	emit('sync')
}
function onDown() {
	emit('updown', state.query.active)
}

</script>


<template>
<div>
   <form v-show="!isEmptyObject(state.query)" @submit.prevent="onSubmit">
		<v-row dense>
			<v-col cols="2">
				<v-radio-group v-model="state.query.active" inline @update:modelValue="onQueryChanged">
					<v-radio v-for="(item, index) in active_options" :key="index"
					:label="item.title" :value="item.value"
					/>
				</v-radio-group>
			</v-col>
         <v-col cols="2">
				<v-select density="compact" :label="getLabel('department')" readonly
				:items="department_options" v-model="state.query.department"
				@click.prevent="selectDepartment"
				/>
			</v-col>
			<v-col cols="2">
				<v-select density="compact" :label="getLabel('roles')" 
				:items="role_options" v-model="state.query.role"
				@update:modelValue="onRoleChanged"
				/>
			</v-col>
			<v-col cols="3">
				<CommonInputSearch :keyword="state.query.keyword"
				@search="onKeywordChanged"
				/>
			</v-col>
			<v-col cols="3">
				<CommonButtonCreate class_name="float-right" 
				@create="onCreate"
				/>
				<CommonButtonDefault icon="mdi-sync" class_name="float-right mr-3" 
				tooltip="同步" color="warning"
				@click="onSync"
				/>
				<CommonButtonDefault key="down" v-if="props.show_down"
				icon="mdi-arrow-down-circle" class_name="float-right mr-3" 
				:tooltip="updown_title" color="purple"
				@click="onDown"
				/>
			</v-col>
		</v-row>
	</form>
	<v-dialog persistent v-model="state.form.active" :width="WIDTH.M + 50">
		<v-card :max-width="WIDTH.M">
			<CommonCardTitle :title="state.form.title" 
			@cancel="onCancel"
			/>
			<v-card-text>
				<DepartmentTree ref="tree"
				:root="root_hlh"
				@select="setDepartment"
				/>
			</v-card-text>
		</v-card>
	</v-dialog>
</div>		
</template>