<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { SITE_TITLE } from '@/config'

const name = 'LayoutToolBar'
const route = useRoute()
const store = useStore()

const currentUser = computed(() => store.getters.currentUser)
const isAuthenticated = computed(() => store.getters.isAuthenticated)


function getTitle() {
   return SITE_TITLE
}
</script>
<template>
   <v-app-bar id="app-bar" app absolute>
      <v-toolbar-title class="font-weight-bold text-center" style="font-size: 48px;"
      v-text="getTitle()"
      />
      <MenuUser v-if="isAuthenticated" :user="currentUser" />
   </v-app-bar>
</template>
