<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { isEmptyObject, deepClone , onErrors, areObjectsEqual, reviewedOptions,
	setValues, badRequest, tryParseInt, copyFromQuery
} from '@/utils'
import { INIT_DOCS, FETCH_DOCS, STORE_DOC } from '@/store/actions.type'

import { WIDTH, ROUTE_NAMES, ACTION_TYPES, ENTITY_TYPES, POST_TYPES } from '@/consts'

const name = 'DocTable'

const emit = defineEmits(['check'])
defineExpose({
   setCheckIds, getCheckIds
})
const props = defineProps({
   allow_edit: {
		type: Boolean,
		default: true
	},
   can_check: {
		type: Boolean,
		default: true
	},
	list: {
		type: Array,
		default: () => []
	},
   keep_reasons: {
		type: Array,
		default: () => []
	},
   errors: {
		type: Object,
		default: null
	}
})

const initialState = {
   checked_ids: []
}
const state = reactive(deepClone(initialState))

onBeforeMount(() => {
   
})

function setCheckIds(ids) {
	state.checked_ids = ids
}
function getCheckIds() {
   return state.checked_ids 
}
function getKeepReason(key) {
   let item = props.keep_reasons.find(x => x.value === key)
   if(item) return item.title
   return ''
}
function onKeepChanged(model) {
   if(model.keep < 1) {
      model.error = '必須選擇保留原因'
   }else model.error = ''
}
function isKeepText(model) {
   if(model.keep > 0 && model.keep !== 2) {
      return '是'
   }else return '否'
}

</script>

<template>
   <v-table v-if="allow_edit" hover>
      <thead>
         <tr>
            <th v-if="can_check" class="font-weight-bold" style="width: 5%;">是否保留</th>
            <th v-if="can_check" class="font-weight-bold" style="width: 15%;">保留原因(狀態)</th>
            <th v-else class="font-weight-bold" style="width: 30%;">保留原因(狀態)</th>
            <th v-if="can_check" class="font-weight-bold" style="width: 10%;">新公文號</th>
            <th v-if="can_check" class="font-weight-bold" style="width: 10%;">舊公文號</th>
            <th v-if="can_check" class="font-weight-bold" style="width: 5%;">舊公文創案號</th>                  
            <th class="font-weight-bold" style="width: 5%;">承辦單位</th>

            <th class="font-weight-bold" style="width: 5%;">收創文日期</th>
            <th class="font-weight-bold" style="width: 5%;">承辦人</th>
            <th class="font-weight-bold" style="width: 20%;">主旨</th>
            <th class="font-weight-bold" style="width: 5%;">辦理結果</th>
            <th class="font-weight-bold" style="width: 5%;">PS</th>
         </tr>
      </thead>
      <tbody>
         <tr v-for="(model, index) in list" :key="index">
            <td v-if="can_check">
               <v-checkbox hide-details
               v-model="state.checked_ids"
               :value="model.id"
               />
            </td>
            <td v-if="can_check" v-text="getKeepReason(model.keep)">
            </td>
            <td v-else>
               <v-select class="mt-3" label="" density="compact" variant="outlined" 
               :error-messages="model.error" 
               :items="keep_reasons" v-model="model.keep"
               @update:modelValue="onKeepChanged(model)"
               />
            </td>
            <td v-if="can_check">
               {{ model.num }}
            </td>
            <td v-if="can_check">
               {{ model.old_Num }}
            </td>
            <td v-if="can_check">
               {{ model.old_CNum }}
            </td>
            <td>
               {{ model.unit }}
            </td>
            <td>
               {{ model.date }}
            </td>
            <td>
               {{ model.person }}
            </td>
            <td>
               {{ model.title }}
            </td>
            <td>
               {{ model.result }}
            </td>
            <td>
               {{ model.ps }}
            </td>
            <!-- <td>
               <a @click.prevent="onReport(model)" href="#" v-text="showReportLink(model)"></a>                     
            </td> -->
         </tr>
      </tbody>
   </v-table>
   <v-table v-else hover>
      <thead>
         <tr>
            <th class="font-weight-bold" style="width: 5%;">是否保留</th>
            <th class="font-weight-bold" style="width: 10%;">新公文號</th>
            <th class="font-weight-bold" style="width: 10%;">舊公文號</th>
            <th class="font-weight-bold" style="width: 5%;">舊公文創案號</th>                  
            <th class="font-weight-bold" style="width: 5%;">承辦單位</th>

            <th class="font-weight-bold" style="width: 10%;">收創文日期</th>
            <th class="font-weight-bold" style="width: 5%;">承辦人</th>
            <th class="font-weight-bold" style="width: 20%;">主旨</th>
            <th class="font-weight-bold" style="width: 5%;">辦理結果</th>
         </tr>
      </thead>
      <tbody>
         <tr v-for="(model, index) in list" :key="index">
            <td v-text="isKeepText(model)">
                
            </td>
            <td >
               {{ model.num }}
            </td>
            <td >
               {{ model.old_Num }}
            </td>
            <td >
               {{ model.old_CNum }}
            </td>
            <td>
               {{ model.unit }}
            </td>
            <td>
               {{ model.date }}
            </td>
            <td>
               {{ model.person }}
            </td>
            <td>
               {{ model.title }}
            </td>
            <td>
               {{ model.result }}
            </td>
         </tr>
      </tbody>
   </v-table>
</template>