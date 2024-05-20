<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { isEmptyObject, deepClone, isNumeric, setValues } from '@/utils'
import JudgebookFile from '@/models/files/judgebook'
import Errors from '@/common/errors'
import { VALIDATE_MESSAGES, ACTION_TYPES } from '@/consts'
import { SET_JUDGEBOOKFILE_UPLOAD_RESULTS } from '@/store/mutations.type'


const name = 'FilesJudgebookReview'
const props = defineProps({
   list: {
      type: Array,
      default: () => []
   }
})
const emit = defineEmits([ACTION_TYPES.SUBMIT.name])
const store = useStore()

const initialState = {
	models: []
}

const state = reactive(deepClone(initialState))

onBeforeMount(init)

function init() {
   props.list.forEach(item => {
      let model = {
         id: 0,
         typeId: 0,
         fileNumber: '',
         courtType: '',
         year: '',
         category: '',
         num: '',
         ps: '',
         fileName: '',
         errors: new Errors()
      }
      setValues(item, model)
      state.models.push(model)
   })
}

const labels = computed(() => store.state.files_judgebooks.labels)
const courtTypes = computed(() => store.state.files_judgebooks.courtTypes)
const results = computed(() => store.state.files_judgebooks.upload.results)

const types = computed(() => store.state.files_judgebooks.types)
const type_options = computed(() => {
	return types.value.map(item => ({
		value: item.id, title: item.title
	}))
})

const has_error = computed(() => {
   if(!state.models.length) return false
   return state.models.map(model => model.errors.any()).some(element => element === true)
})


function checkFileNumber(model) {
   const key = 'fileNumber'
   let valid = false
   if(model[key]) valid = JudgebookFile.checkFileNumber(model[key])
   else valid = false
   
   
   if(valid) {
      model.errors.clear(key)
   }else {
      let msg = model[key] ? `${labels.value[key]}不正確` : VALIDATE_MESSAGES.REQUIRED(labels.value[key])
      model.errors.set(key, [msg])
   }
}
function onSubmit() {
	emit(ACTION_TYPES.SUBMIT.name, state.models)
}

function getResult(model) {
   if(results.value.length) {
      return results.value.find(item => item.id === model.id)
   }
   return null
}

</script>

<template>
<div>
   <v-row dense>
      <v-col cols="12">
         <v-table>
            <thead>
               <tr>
                  <th class="text-center" style="width: 15%;">
                     {{ labels['typeId'] }}
                  </th>
                  <th class="text-center" style="width: 12%;">
                     {{ labels['courtType'] }}
                  </th>
                  <th class="text-center text-indigo-lighten-1" style="width: 18%;">
                     {{ labels['fileNumber'] }}
                  </th>
                  <th class="text-center" style="width: 10%;">
                     {{ labels['year'] }}
                  </th>
                  <th class="text-center" style="width: 12%;">
                     {{ labels['category'] }}
                  </th>
                  <th class="text-center" style="width: 12%;">
                     {{ labels['num'] }}
                  </th>
                  <th class="text-center text-indigo-lighten-1" >
                     備註
                  </th>
               </tr>
            </thead>
            <tbody>
               <tr v-for="model in state.models" :key="model.id">
                  <td>
                     <v-select readonly class="mt-3" :label="labels['typeId']" density="compact" variant="outlined"
                     :items="type_options" v-model="model.typeId"
                     />
                  </td>
                  <td>
                     <v-select readonly class="mt-3" :label="labels['courtType']" density="compact" variant="outlined"
                     :items="courtTypes" v-model="model.courtType"
                     />
                  </td>
                  <td>
                     <v-text-field variant="outlined" class="pt-3" density="compact"
                     v-model="model.fileNumber" :error-messages="model.errors.get('fileNumber')" 
                     @input="checkFileNumber(model)"
                     />
                  </td>
                  <td>
                     <v-text-field readonly variant="outlined" class="pt-3" density="compact"
                     v-model="model.year"
                     />
                  </td>
                  <td>
                     <v-text-field readonly variant="outlined" class="pt-3" density="compact"
                     v-model="model.category"
                     />
                  </td>
                  <td>
                     <v-text-field readonly variant="outlined" class="pt-3" density="compact"
                     v-model="model.num"
                     />
                  </td>
                  <td>
                     <v-text-field  variant="outlined" class="pt-3" density="compact"
                     v-model="model.ps"
                     />
                  </td>
               </tr>
            </tbody>
         </v-table>
      </v-col>
   </v-row>
   <v-row dense>
      <v-col cols="12">
         <v-btn color="success" class="float-right"
         :disabled="state.models.length === 0 || has_error"
         @click.prevent="onSubmit"
         >
				審核通過
         </v-btn>
      </v-col>
   </v-row>   
</div>
</template>