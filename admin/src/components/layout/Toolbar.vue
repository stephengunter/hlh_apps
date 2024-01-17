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
</script>
<template>
   <v-app-bar id="app-bar" app absolute>
      <v-app-bar-nav-icon @click.stop="toggleDrawer" />
      <v-toolbar-title class="font-weight-light" 
      v-text="route.meta.title"
      />
      <v-spacer />
      <MenuUser v-if="isAuthenticated" :user="currentUser" />
   </v-app-bar>
</template>
