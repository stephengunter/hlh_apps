<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { isEmptyObject, deepClone , onErrors, areObjectsEqual, reviewedOptions,
	setValues, badRequest, tryParseInt
} from '@/utils'
import { INIT_DOCS } from '@/store/actions.type'

const name = 'DocView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
	query: {
		tel: ''
	},
   users: []
}
const state = reactive(deepClone(initialState))

const departments = computed(() => store.state.docs.departments)
const tels = computed(() => store.state.docs.tels)
const labels = computed(() => store.state.docs.labels)

onBeforeMount(() => {
	if(departments.value && departments.value.length) init()
	else {
		store.dispatch(INIT_DOCS)
		.then(() => {
			nextTick(init)
		})
		.catch(error => onErrors(error))
	}
})
watch(route, init)


function init() {
	let users = searchUsers(state.query.tel)
   state.users = users
}
function searchUsers(val) {
   if(departments.value && departments.value.length) {
      if(val) {
         return departments.value.filter(entry => 
            entry.tels.some(tel => tel.startsWith(val))
         )
      }
      return departments.value
   }
   return []
}

function onQueryChanged() {
   let users = searchUsers(state.query.tel)
   state.users = users
}

function showRoles(model) {
   return model.roles.join(' / ')
}
function showReportLink(model) {
   return `回報異常`
}
function onReport(model) {

}

</script>

<template>
<div>
   <v-row dense>
      <v-col cols="12">
         <v-text-field :label="labels['tel']"  density="compact" :clearable="true"
         v-model="state.query.tel"                   
         @input="onQueryChanged" @click:clear="onQueryChanged"
         />
      </v-col>
   </v-row>
   <v-row dense>
		<v-col cols="12">
			<v-table hover>
            <thead>
               <tr>
                  <th class="font-weight-bold" style="width: 15%;">單位</th>
                  <th class="font-weight-bold" style="width: 15%;">角色</th>
                  <th class="font-weight-bold" style="width: 10%;">姓名</th>
                  <th class="font-weight-bold" style="width: 10%;">AD</th>
                  <th class="font-weight-bold" style="width: 10%;">舊公文</th>
                  <th class="font-weight-bold" style="width: 10%;"></th>
               </tr>
            </thead>
            <tbody>
               <tr v-for="(model, index) in state.users" :key="index">
                  <td >
                     {{ model.department }}
                  </td>
                  <td>
                     {{ showRoles(model) }}
                  </td>
                  <td>
                     {{ model.name }}
                  </td>
                  <td>
                     {{ model.ad }}
                  </td>
                  <td>
                     {{ model.tel }}
                  </td>
                  <td>
                     <a @click.prevent="onReport(model)" href="#" v-text="showReportLink(model)"></a>                     
                  </td>
               </tr>
            </tbody>
         </v-table>
		</v-col>
	</v-row>
</div>
</template>