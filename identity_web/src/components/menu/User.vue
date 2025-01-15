<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { LOGOUT } from '@/store/actions.type'
import { deepClone, shortName, pluralization, onErrors } from '@/utils'
import { ROUTE_NAMES, ENTITY_TYPES } from '@/consts'

const name = 'MenuUser'
const props = defineProps({
   user: {
      type: Object,
      default: null
   }
})
const router = useRouter()
const store = useStore()

const initialState = {
   items: [{
      title: '登出', name: LOGOUT, icon: 'mdi-logout-variant'
   }] 
}

const state = reactive(deepClone(initialState))

function onSelected(name) {
   if(name === LOGOUT) logout()
   else if(name === ENTITY_TYPES.PROFILES.name) profiles()
}
function logout() {
   store.dispatch(LOGOUT)
   .then(() => {
      router.push({ name: ROUTE_NAMES.LOGIN })
   })
   .catch(error => onErrors(error))  
}

</script>
<template>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn prepend-icon="mdi-account-circle"
          color="primary"
          v-bind="props"
        >
        {{ user.name }}
        </v-btn>
      </template>
      <v-list>
         <v-list-item v-for="(item, index) in state.items" :key="index" @click.prevent="onSelected(item.name)">
            <template v-slot:prepend>
               <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title v-text="item.title" />
         </v-list-item>
      </v-list>
    </v-menu>
</template>
