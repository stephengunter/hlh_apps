<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, reactive, computed, watch, onBeforeMount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FETCH_USERS, CREATE_USER, STORE_USER, IMPORT_USERS
} from '@/store/actions.type'
import { SET_ERRORS, CLEAR_ERRORS } from '@/store/mutations.type'
import { isEmptyObject, deepClone , activeOptions, copyFromQuery,
	resolveErrorData, onErrors, onSuccess, setValues, badRequest, is400, isNumeric,
	formatNumberWithLeadingZeros, tryParseInt
} from '@/utils'
import Judgebook from '@/models/judgebook'
import Errors from '@/common/errors'
import { WIDTH, ROUTE_NAMES, VALIDATE_MESSAGES } from '@/consts'

const name = 'JudgebookUpload'
const store = useStore()

const emit = defineEmits(['submit'])

const initialState = {
	models: []
}
const file_upload = ref(null)
const labels = {
   year: '年度',
   category: '字號',
   num: '案號'
}

const state = reactive(deepClone(initialState))


const has_error = computed(() => {
   if(!state.models.length) return false
   return state.models.map(model => model.errors.any()).some(element => element === true)
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
         num = Judgebook.checkNum(parts[2])
			if(Judgebook.checkYear(parts[0])) year = parts[0]
			if(parts.length > 3) ps = parts[3]
		}
		return new Judgebook(year, category ,num, file, ps)
	}
	return null
}
function onFileAdded(files) {
   state.models = []
   files.forEach(file => {
      let model = resolveModel(file)
      if(model) {
         check(model, 'year')
         check(model, 'category')
         check(model, 'num')
         state.models.push(model)
      } 
   })
}

function check(model, key) {
   let valid = false
   if(key === 'year') valid = Judgebook.checkYear(model[key])
   else if(key === 'category') valid = !isNumeric(model[key])
   else if(key === 'num') {
      valid = Judgebook.checkNum(model[key]) ? true : false
   }else valid = true
   
   
   if(valid) {
      model.errors.clear(key)
   }else {
      let msg = model[key] ? `${labels[key]}不正確` : VALIDATE_MESSAGES.REQUIRED(labels[key])
      model.errors.set(key, [msg])
   }
}
function onSubmit() {
   state.models.forEach(model => model.num = Judgebook.checkNum(model.num))
	emit('submit', state.models)
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