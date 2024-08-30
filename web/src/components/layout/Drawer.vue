<script setup>
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { SET_DRAWER } from '@/store/mutations.type'
import { SITE_TITLE } from '@/config'
import { deepClone, isEmptyObject } from '@/utils'

const name = 'LayoutDrawer'
const store = useStore()
const route = useRoute()
const router = useRouter()

const initialState = {
   open: []
}
const state = reactive(deepClone(initialState))

const menus = computed(() => store.state.app.menus)

const drawer = computed({
	get() {
		return store.getters.drawer
	},
	set(val) {
		store.commit(SET_DRAWER, val)
	}
})

const current = computed(() => store.state.app.route.to)

function onSelected(item) {
   router.push({ name: item.name })
}  
function isActive(flag) {
   if(flag === 1) return route.name === 'doc-a'
   else if(flag === 0) return route.name === 'doc-b'
   else if(flag === -1) return route.name === 'doc-c'
   else if(flag === 2) return route.name === 'doc-d'
   else if(flag === -5) return route.name === 'doc'
   else return false
}  

</script>

<template>
   <v-navigation-drawer id="app-drawer" v-model="drawer" 
   app theme="dark" class="bg-teal-darken-3"

   v-bind="$attrs"
   >
      <v-list dense nav>
         <v-list-item>
            <template v-slot:prepend>
               <v-avatar size="36px">
                  <v-img src="@/assets/logo.png"></v-img>
               </v-avatar>
            </template>
            <v-list-item-title class="text-h6" style="line-height: 1.5rem;"  
            v-text="SITE_TITLE" />
         </v-list-item>
      </v-list>

      <v-divider class="mb-2" />
      {{ current.query }}
      <v-list density="compact">
         <v-list-item prepend-icon="mdi-help"
         color="warning"
         title="說明" to="/doc"
         :active="isActive(-5)"
         />
         <v-list-item prepend-icon="mdi-file-document"
         color="warning"
         title="舊公文資料-A類" to="/doc_a"
         :active="isActive(1)"
         />
         <v-list-item prepend-icon="mdi-file-minus"
         color="warning"
         title="舊公文資料-B類" to="/doc_b"
         :active="isActive(0)"
         />
         <v-list-item prepend-icon="mdi-file-document-remove"
         color="warning"
         title="舊公文資料-C類" to="/doc_c"
         :active="isActive(-1)"
         />
         <v-list-item prepend-icon="mdi-gavel"
         color="warning"
         title="審判公文，隨卷歸檔" to="/doc_d"
         :active="isActive(2)"
         />
         <!-- <MenuDrawer  v-for="item in menus" :key="item.name" 
         :item="item" :current="current"
         @select="onSelected"
         /> -->
      </v-list>
   </v-navigation-drawer>
</template>
