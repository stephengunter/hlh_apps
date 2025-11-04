<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { TOGGLE_DRAWER } from '@/store/mutations.type';

const name = 'LayoutToolBar'
const route = useRoute()
const store = useStore()

const currentUser = computed(() => store.getters.currentUser)
const isAuthenticated = computed(() => store.getters.isAuthenticated)


function toggleDrawer() {
   store.commit(TOGGLE_DRAWER)
}
function getTitle(page) {
   if(page && page.meta && page.meta.title) {
      let parts = page.meta.title.split(',')
      if(parts.length === 1) return page.meta.title
      return parts[1]
   }
   return ''
}
</script>
<template>
   <v-app-bar id="app-bar" app absolute>
      <v-app-bar-nav-icon @click.stop="toggleDrawer" />
      <v-toolbar-title class="font-weight-light" 
      v-text="getTitle(route)"
      />
      <v-spacer />
      <MenuUser v-if="isAuthenticated" :user="currentUser" />
   </v-app-bar>
</template>
