<script setup>
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import _ from 'lodash'

const name = 'TablePager'
const props = defineProps({
   model: {
      type: Object,
      default: null
   },
   list_key: {
      type: String,
      default: 'viewList'
   },
   can_page: {
      type: Boolean,
      default: true
   },
   row_options: {
      type: Array,
      default: () => [10,25,50]
   },
   responsive: {
      type: Boolean,
      default: false
   }
})
const emit = defineEmits(['page_changed', 'size_changed'])

const data = reactive({
   page: 1,
   size: 10
})

watch(() => _.cloneDeep(props.model), (currentValue, oldValue) => init)

onBeforeMount(init)

const isEmpty = computed(() => {
   if(props.model) return props.model.totalItems < 1
   return true
})
const first = computed(() => {
   return isEmpty.value ? 0 : (props.model.pageSize * (props.model.pageNumber - 1) + 1)
})
const last = computed(() => {
   return isEmpty.value ? 0 : (first.value + props.model[props.list_key].length - 1)
})
const summary = computed(() => `${first.value} - ${last.value} of ${props.model.totalItems}`)

function init() {
   data.page = props.model.pageNumber
   data.size = props.model.pageSize
}
function onPageChanged(page) {
   emit('page_changed', page)
}     
function onPageSizeChanged(size) {
   emit('size_changed', size)
}
</script>

<template>
   <v-row dense v-if="can_page">
      <v-col cols="5">
         <v-select class="float-right mt-1" style="width: 100px;"  density="compact"
         label="Rows"
         :items="row_options"
         v-model="data.size"   
         @update:modelValue="onPageSizeChanged"
         />
      </v-col>
      <v-col cols="2"> 
         <p v-text="summary" class="mt-4 text-center"></p>
      </v-col>
      <v-col cols="5">
         <v-pagination  class="float-left"
         v-model="data.page"
         :length="model.totalPages"
         @update:modelValue="onPageChanged"
         />
      </v-col>
   </v-row>
   <v-row v-else>
      <v-col cols="12">
         <p v-text="summary" class="mt-4 text-center"></p>
      </v-col>
   </v-row>
</template>
