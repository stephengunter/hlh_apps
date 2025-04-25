<script setup>
import { ref, reactive, computed } from 'vue'

const name = 'DeviceGroupView'
const emit = defineEmits(['select'])

const props = defineProps({
	list: {
      type: Array,
      default: () => []
   },
   categories: {
      type: Array,
      default: () => []
   }
})

function getName(item) {
   if(item.categoryId) {
      const category = props.categories.find(x => x.id === item.categoryId)
      if(category) return `${category.title} : ${item.count}`
   }
   return `(categoryId: ${item.categoryId}) : ${item.count}`
}
function select(categoryId) {
   if(categoryId) {
      const category = props.categories.find(x => x.id === categoryId)
      emit('select', category)
   }else emit('select', null)
}
</script>


<template>
   <v-row dense>
      <v-col cols="12" >
         <v-chip v-for="item in list" variant="flat" class="ml-1 mb-1" :key="item.categoryId"
         @click="select(item.categoryId)"
         >
            {{ getName(item) }}
         </v-chip>
      </v-col>
   </v-row>
</template>