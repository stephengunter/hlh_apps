<script setup>
import { ref, reactive, computed, watch, onBeforeMount, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import date from '@/plugins/date'
import { deepClone, getRocDatePickerModel, 
   onSuccess, onErrors, dateToText, getMimeType, downloadFile, bytesToBinary } from '@/utils'
import { VALIDATE_MESSAGES, WIDTH, ROUTE_NAMES, ENTITY_TYPES } from '@/consts'
import { REPORT_JUDGEBOOKFILES, SUBMIT_REPORT_JUDGEBOOKFILES } from '@/store/actions.type'
import { CLEAR_ERRORS } from '@/store/mutations.type'


const name = 'FilesJudgebooksReportsView'
const store = useStore()
const route = useRoute()
const router = useRouter()

const dateAdapter = new date.adapter({ locale: date.locale.zhTW })

const  period_picker = ref(null)

const JUDGEBOOKFILE = ENTITY_TYPES.JUDGEBOOKFILE

const initialState = {
   active: false,
	params: {
      createdAt: '',
      judgeDate: ''
	},
   createdDates:[],
   judgeDates:[],
   datePicker: {
      roc: false,
      values: [],
      labels: [],
      required_start: false,
      required_end: false,
      allow_same: true,

      key: '',
      title: '',
      lower_limit: null,
      upper_limit: null,
      active: false
   },
   list: [],
   comments: ''
   
}

const state = reactive(deepClone(initialState))


const labels = computed(() => store.state.files_judgebooks.labels)

onBeforeMount(init)

function init() {
   const today = dateAdapter.date()
   const start = dateAdapter.startOfMonth(today)
   const end = dateAdapter.endOfMonth(today)
   state.createdDates.push({
      text: dateToText(start),
      date: start
   })
   state.createdDates.push({
      text: dateToText(end),
      date: end
   })

   state.judgeDates.push({
      text: '',
      date: null,
      model: getRocDatePickerModel()
   })
   state.judgeDates.push({
      text: '',
      date: null,
      model: getRocDatePickerModel()
   })

  
   setParams('createdAt')
}
function setParams(key) {
   let start = ''
   let end = ''
   if(key === 'createdAt') {
      start = state.createdDates[0].text
      end = state.createdDates[1].text     
   }else if(key === 'judgeDate') {
      start = state.judgeDates[0].model.text_cn
      end = state.judgeDates[1].model.text_cn
   }

   if(start && end) state.params[key] = `${start} ~ ${end}`
   else if(start) state.params[key] = `${start} ~ `
   else if(end) state.params[key] = ` ~ ${end}`
   else state.params[key] = ''

   nextTick(fetchData)
}

function selectDate(key) {
   if(!key) {
      state.datePicker = deepClone(initialState.datePicker)
      return
   }
   if(key === 'createdAt') {
      state.datePicker.roc = false
      state.datePicker.values = state.createdDates.map(item => item.text)
      state.datePicker.labels = ['起始日期', '截止日期']

      state.datePicker.key = key
		state.datePicker.title = `選擇${labels.value['createdAtText']}區間`
		state.datePicker.active = true
      
   }else if(key === 'judgeDate') {
      state.datePicker.roc = true
      state.datePicker.values = state.judgeDates.map(item => item.text)
      state.datePicker.labels = ['起始日期', '截止日期']

      state.datePicker.key = key
		state.datePicker.title = `選擇${labels.value['judgeDate']}區間`
		state.datePicker.active = true
      console.log(state.datePicker)
   }
}
function onRangeSelected() {
   const dates = period_picker.value.getDates()
  
   const key = state.datePicker.key
   if(key === 'createdAt') {
      //{ date, text }
      state.createdDates = dates.slice(0)
   }else if(key === 'judgeDate') {
       //{ date, text, text_cn, num }
      state.judgeDates = dates.map(item => ({
         date: item.date,
         text: item.text,
         model: {
            text: item.text,
            text_cn: item.text_cn,
            num: item.num
         }
      }))
   }
  
   setParams(key)
   selectDate()
}

function fetchData() {
   state.comments = ''
	store.dispatch(REPORT_JUDGEBOOKFILES, state.params)
	.then(list => {
      state.list = list
      state.comments = `合計： ${list.length} 件`
	})
	.catch(error => onErrors(error))
}

function onReports() {
	const ids = state.list.map(item => item.id)
   const reviewedAt = state.params.createdAt
   const judgeDate = state.params.judgeDate
	store.dispatch(SUBMIT_REPORT_JUDGEBOOKFILES, { ids, reviewedAt, judgeDate })
	.then(model => {
		const ext = '.pdf'
		const fileName = model.fileName
		const fileBytes = bytesToBinary(model.fileBytes)
		const blob = new Blob([fileBytes], { type: getMimeType(ext) })
		downloadFile(blob, fileName)
	})
	.catch(error => onErrors(error))
}
</script>

<template>
<div>
   <v-row dense>
      <v-col cols="2">
         <v-text-field :label="`${labels['createdAtText']}區間`"  variant="outlined" readonly density="compact"
         v-model="state.params.createdAt"
         @click:control="selectDate('createdAt')"
         />
      </v-col>
      <v-col cols="2">
         <v-text-field :label="`${labels['judgeDate']}區間`"  variant="outlined" readonly density="compact"
         v-model="state.params.judgeDate"
         @click:control="selectDate('judgeDate')"
         />
      </v-col>
      <v-col cols="2">
			<v-tooltip  text="下載報表">
            <template v-slot:activator="{ props }">
               <v-btn class="ml-3 float-right"  :disabled="state.list.length < 1" icon="mdi-file-export" 
               v-bind="props" size="small" color="purple-darken-3"
               @click.prevent="onReports"
               />
            </template>
         </v-tooltip>
      </v-col>
      <v-col cols="6">
			
      </v-col>
   </v-row>
   <v-row dense>
      <v-col cols="12">
         <v-table>
            <thead>
               <tr>
                  <th style="width: 10%;">
                     {{ labels['courtType'] }}
                  </th>
                  <th style="width: 10%;">
                     {{ labels['typeId'] }}
                  </th>
                  <th style="width: 15%;">
                     {{ labels['num'] }}
                  </th>
                  <th style="width: 10%;">
                     {{ labels['judgeDate'] }}
                  </th>
                  <th style="width: 25%;">
                     {{ labels['fileNumber'] }}
                  </th>
               </tr>
            </thead>
            <tbody>
               <tr v-for="(item, index) in state.list" :key="index">
                  <td class="font-weight-bold">
                     {{ item.courtTypeTitle }}
                  </td>
                  <td class="font-weight-bold">
                     {{ item.typeTitle }}
                  </td>
                  <td class="font-weight-bold">
                     {{ item.caseInfo }}
                  </td>
                  <td class="font-weight-bold">
                     {{ item.judgeDateText }}
                  </td>
                  <td class="font-weight-bold">
                     {{ item.fileNumber }}
                  </td>
               </tr>
            </tbody>
         </v-table>
      </v-col>
      <v-col cols="12">
			<span class="ml-3" v-text="state.comments"></span>
      </v-col>
   </v-row>
   <v-dialog persistent v-model="state.datePicker.active" :width="WIDTH.S + 50" >
		<v-card v-if="state.datePicker.active" :max-width="WIDTH.S">
			<CommonCardTitle :title="state.datePicker.title" 
			@cancel="selectDate"
			/>
			<v-card-text>
            <v-row>
               <v-col cols="12">
                  <CommonPickerPeriod ref="period_picker" :roc="state.datePicker.roc" 
                  :values="state.datePicker.values" :labels="state.datePicker.labels" 
                  />
               </v-col>
            </v-row>
            <v-row dense>
               <v-col cols="12">
                  <v-btn @click.prevent="onRangeSelected" color="success" class="float-right">
                  確定
                  </v-btn>
               </v-col>
            </v-row>
			</v-card-text>
		</v-card>
	</v-dialog>
         
</div>
</template>