
<script setup>
import { reactive, onBeforeMount } from 'vue'
import { deepClone } from '@/utils'
const name = 'PickerQuantity'
const props = defineProps({
   label: {
      type: String,
      default: ''
   },
   qty: {
      type: Number,
      default: 1
   },
   min: {
      type: Number,
      default: 1
   },
   max: {
      type: Number,
      default: 99
   },
   step: {
      type: Number,
      default: 1
   }
})
const emit = defineEmits(['changed'])
const initialState = {
   val: ''
}
const state = reactive(deepClone(initialState))

onBeforeMount(init)

function init() {
   state.val = props.qty
}
function decreaseQuantity() {
   state.val = (state.val - props.step)
   search()
}
function increaseQuantity() {
   state.val = (state.val + props.step)
   search()
}
function search() {
   emit('search', state.val)
}
</script>

<template>
   <v-row dense >
      <v-col cols="3" class="pt-3 pl-3 ">
         <span v-text="label" class="float-right"></span>
      </v-col>
      <v-col cols="3">
         <v-btn style="margin-top: 6px;" class="float-right" icon size="xx-small"
         variant="outlined" @click="decreaseQuantity" :disabled="state.val <= min"
         >
            <v-icon>mdi-minus</v-icon>
         </v-btn>
      </v-col>
      <v-col cols="3">
         <v-text-field
         v-model="state.val"
         type="number"
         density="compact"
         hide-details
         variant="outlined"
         class="text-center"
         />
      </v-col>
      <v-col cols="3">
         <v-btn icon style="margin-top: 6px;" size="xx-small" variant="outlined" 
         :disabled="state.val >= max" @click="increaseQuantity"
         >
            <v-icon>mdi-plus</v-icon>
         </v-btn>
      </v-col>
   </v-row>
</template>