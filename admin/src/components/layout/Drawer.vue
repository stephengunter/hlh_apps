<script setup>
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { APP_UI } from '@/consts'
import { SET_DRAWER } from '@/store/mutations.type'

const name = 'LayoutDrawer'
const store = useStore()
const location = useRoute()

const initialState = {
   open: []
}
const state = reactive({
   ...initialState
})


const menus = computed(() => store.state.app.menus)

const drawer = computed({
	get() {
		return store.getters.drawer
	},
	set(val) {
		store.commit(SET_DRAWER, val)
	}
})

function isActive(item) {
   if(location) {
      if(location.name === item.name) return true
      if(item.meta.hasOwnProperty('subs') && item.meta.subs.includes(location.name)) return true
   }
   return false
}

</script>

<template>
   <v-navigation-drawer id="app-drawer" v-model="drawer" 
   app theme="dark" 
   v-bind="$attrs"
   >
      <v-list dense nav>
         <v-list-item>
            <template v-slot:prepend>
               <v-avatar size="36px">
                  <v-img src="@/assets/logo.png"></v-img>
               </v-avatar>
            </template>
            <v-list-item-title class="text-h6" style="line-height: 1.5rem;"  v-text="APP_UI.TITLE"></v-list-item-title>
         </v-list-item>
      </v-list>

      <v-divider class="mb-2" />

      <v-list v-model:opened="state.open">
         <MenuDrawer  v-for="item in menus" :key="item.name" 
         :item="item" :active="isActive(item)"
         />
      </v-list>   
      

   </v-navigation-drawer>
</template>
