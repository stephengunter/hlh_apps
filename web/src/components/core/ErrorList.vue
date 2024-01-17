<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const name = 'ErrorList'
const store = useStore()
const errors = computed(() => store.getters.errors)
</script>

<template>
   <v-alert :model-value="errors.any()" color="error" variant="outlined">
      <ul>
         <li v-for="(v, k) in errors.errors" :key="k" v-text="v[0]">
         </li>
      </ul>
   </v-alert>
   
</template>

<style scoped>
ul {
  padding-left: 1.2em;
}
</style>
