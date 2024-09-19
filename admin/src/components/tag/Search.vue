
<script setup>
import { reactive, onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'
import { deepClone } from '@/utils'

const store = useStore()
const name = 'TagSearch'
const props = defineProps({
   label: {
      type: String,
      default: ''
   },
   keyword: {
      type: String,
      default: ''
   }
})
const emit = defineEmits(['search'])
const initialState = {
   val: ''
}
const state = reactive(deepClone(initialState))

const list = computed(() => store.getters.tags)
const items = computed(() => {
   return store.getters.tags
   // if(state.val) return store.getters.tags
   // return []
})

onBeforeMount(init)

function init() {
   state.val = props.keyword
}
function clear() {
   state.val = ''
   search()
}
function search() {
   emit('search', state.val)
}
</script>

<template>
   <form @submit.prevent="search">
      <!-- <v-text-field :label="label"
      prepend-inner-icon="mdi-magnify"
      density="compact" :clearable="true"
      variant="solo" 
      v-model="state.val" 
      @click:clear="clear"
      /> -->
      <!-- <v-autocomplete style="max-width: 320px;" hide-no-data 
      :label="label" v-model="state.val"
      :items="items"
      /> -->
      <v-menu full-width max-width="290"
      :close-on-content-click="false"
      >
         <template v-slot:activator="{ on }">
            <v-text-field :label="label"
            v-model="state.val" v-on="on"
            />
         </template>
      </v-menu>
   </form>
</template>