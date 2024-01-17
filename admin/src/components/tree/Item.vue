<script setup>
import { reactive, computed } from 'vue'

const name = 'TreeItem'
const props = defineProps({
   model: {
      type: Object,
      default: null
   },
   model: {
      type: Object,
      default: null
   },
   expand: {
      type: Boolean,
      default: false
   },
   active: {
      type: Boolean,
      default: false
   }
})

const emit = defineEmits(['select', 'fold', 'expand'])
const icon  = computed(() => {
   if(props.expand) return 'mdi-menu-down'
   else return 'mdi-menu-right'
})

function select() {
   emit('select', props.model)
}
</script>
<template>
   <div>
      <v-btn density="compact" class="mb-1" flat :icon="icon"></v-btn>
      <a href="#" class="text-decoration-none">{{ model.title }}</a>
   </div>

</template>