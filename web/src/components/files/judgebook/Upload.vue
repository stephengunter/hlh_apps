<script setup>
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { isEmptyObject, deepClone, isNumeric, tryParseInt } from '@/utils'
import JudgebookFile from '@/models/files/judgebook'
import { VALIDATE_MESSAGES } from '@/consts'
import { SET_JUDGEBOOKFILE_UPLOAD_RESULTS } from '@/store/mutations.type'


const name = 'FilesJudgebookUpload'
const store = useStore()

const emit = defineEmits(['submit', 'find'])

const initialState = {
	models: []
}

const state = reactive(deepClone(initialState))

const file_upload = ref(null)

const labels = computed(() => store.state.files_judgebooks.labels)

const results = computed(() => store.state.files_judgebooks.upload_results)


const has_error = computed(() => {
   if(!state.models.length) return false
   return state.models.map(model => model.errors.any()).some(element => element === true)
})


onBeforeMount(() => {
   store.commit(SET_JUDGEBOOKFILE_UPLOAD_RESULTS, [])
})

function resolveModel(file) {
	if(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      let fileName = file.name.slice(0, -4)
		let year = ''
		let category = ''
		let num = ''
		let ps = ''
		let parts = fileName.split('_')
		if(parts.length >= 3) {
			category = parts[1]
         num = JudgebookFile.checkNum(parts[2])
			if(JudgebookFile.checkYear(parts[0])) year = parts[0]
			if(parts.length > 3) ps = parts[3]
		}
		return new JudgebookFile(year, category ,num, file, ps)
	}
	return null
}
function onFileAdded(files) {
   let id = -1
   state.models = []
   files.forEach(file => {
      let model = resolveModel(file)
      if(model) {
         check(model, 'year')
         check(model, 'category')
         check(model, 'num')
         model.id = id
         state.models.push(model)
         id -= 1
      } 
   })
}

function check(model, key) {
   let valid = false
   if(key === 'year') valid = JudgebookFile.checkYear(model[key])
   else if(key === 'category') valid = !isNumeric(model[key])
   else if(key === 'num') {
      valid = JudgebookFile.checkNum(model[key]) ? true : false
   }else valid = true
   
   
   if(valid) {
      model.errors.clear(key)
   }else {
      let msg = model[key] ? `${labels[key]}不正確` : VALIDATE_MESSAGES.REQUIRED(labels[key])
      model.errors.set(key, [msg])
   }
}
function onSubmit() {
   state.models.forEach(model => model.num = JudgebookFile.checkNum(model.num))
	emit('submit', state.models)
}

function getResult(model) {
   if(results.value.length) {
      return results.value.find(item => item.id === model.id)
   }
   return null
}
function onFind(id) {
   const model = state.models.find(item => item.id === id)
   emit('find', model)
}

</script>

<template>
   <v-row dense>
      <v-col cols="12">
         <CommonInputUpload ref="file_upload" :show_button="true" :multiple="true"
         :is_media="false" :allow_types="['.pdf']"
         @file-added="onFileAdded" @file-removed="onFileAdded"
         />
      </v-col>
      
   </v-row>
   <v-row dense>
      
      <v-col cols="12">
         <v-table>
            <thead>
               <tr>
                  <th v-show="results.length" class="text-center" style="width: 15%;">
                     
                  </th>
                  <th class="text-center" style="width: 15%;">
                     {{ labels['year'] }}
                  </th>
                  <th class="text-center" style="width: 15%;">
                     {{ labels['category'] }}
                  </th>
                  <th class="text-center" style="width: 15%;">
                     {{ labels['num'] }}
                  </th>
                  <th class="text-center" >
                     備註
                  </th>
               </tr>
            </thead>
            <tbody>
               <tr v-for="model in state.models" :key="model.name">
                  <td v-show="results.length">
                     <FilesJudgebookResult :result="getResult(model)"
                     @find="onFind"
				         />
                  </td>
                  <td>
                     <v-text-field variant="outlined" class="pt-3" density="compact"
                     v-model="model.year" :error-messages="model.errors.get('year')" 
                     @input="check(model, 'year')"
                     />
                  </td>
                  <td>
                     <v-text-field variant="outlined" class="pt-3" density="compact"
                     v-model="model.category" :error-messages="model.errors.get('category')" 
                     @input="check(model, 'category')"
                     />
                  </td>
                  <td>
                     <v-text-field variant="outlined" class="pt-3" density="compact"
                     v-model="model.num" :error-messages="model.errors.get('num')" 
                     @input="check(model, 'num')"
                     />
                  </td>
                  <td>
                     <v-text-field variant="outlined" class="pt-3" density="compact"
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
				確定
         </v-btn>
      </v-col>
   </v-row>   
</template>