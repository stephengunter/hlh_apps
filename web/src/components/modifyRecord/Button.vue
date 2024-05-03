<script setup>
import { computed, reactive, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { deepClone, findItemFromObj, showModifyRecords } from '@/utils'
import { FETCH_MODIFY_RECORDS } from '@/store/actions.type'
import { ENTITY_TYPES } from '@/consts'

const name = 'ModifyRecordButton'
const props = defineProps({
   text: {
      type: String,
      default: ''
   },
   type: {
      type: Object,
      default: null
   },
   id: {
      type: String,
      default: ''
   }
})
const store = useStore()

const initialState = {
   entity_type: null
}
const state = reactive(deepClone(initialState))

onBeforeMount(init)
function init() { 
   console.log(props.type)
	//fetchData(props.type, props.id)
}

function fetchData() {
   showModifyRecords({
      type: props.type, id: props.id
   })
	//store.dispatch(FETCH_MODIFY_RECORDS, { type, id })
}
</script>
<template>
   <v-tooltip :text="`查看${ENTITY_TYPES.MODIFY_RECORD.title}`">
      <template v-slot:activator="{ props }">
         <a href="#" v-bind="props" @click.prevent="fetchData">{{ text }}</a>
      </template>
   </v-tooltip>
</template>
