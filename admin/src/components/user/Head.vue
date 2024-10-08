<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Errors from '@/common/errors'
import { isEmptyObject, deepClone , activeOptions, areObjectsEqual, reviewedOptions,
	setValues, badRequest, tryParseInt, isTrue
} from '@/utils'
import { WIDTH } from '@/consts'

const name = 'UserHead'
const emit = defineEmits(['submit', 'create', 'sync'])
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
const roles = computed(() => store.state.users.roles)
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
	let options = roles.value.map(role => ({ value: role.name, title: role.title }))
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
	state.query.department = id
	onSubmit()
	onCancel()
}
function onCancel() {
	state.form = deepClone(initialState.form)
}
function onRoleChanged() {	
	onSubmit()
}
function onQueryChanged() {
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
	emit('down')
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
				<v-select density="compact" label="部門" readonly
				:items="department_options" v-model="state.query.department"
				@click.prevent="selectDepartment"
				/>
			</v-col>
			<v-col cols="2">
				<v-select density="compact" label="角色"
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
				tooltip="下架" color="purple"
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