<script setup>
import { MqResponsive } from 'vue3-mq'
import { ref, watch, onBeforeMount, computed} from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FETCH_ARTICLES } from '@/store/actions.type'
import { ROUTE_NAMES } from '@/consts'
import { resolveErrorData, onErrors, onSuccess } from '@/utils'

const router = useRouter()
const store = useStore()

const articles = computed(() => store.state.articles.list)

onBeforeMount(() => {
  
	fetchData()
})
function fetchData() {
   let params = { }
   store.dispatch(FETCH_ARTICLES, params)
   .catch(error => onErrors(error))
}
function onSelected(id) {
   router.push({ name: ROUTE_NAMES.ARTICLE_DETAILS, params: { id } })
}
</script>

<template>
   <v-container>
      <MqResponsive target="md+">
         <v-row>
            <v-col cols="9">
               <v-row>
                  <v-col>
                     <CarouselsHeadline />
                  </v-col>
               </v-row>
               <ArticlesItem v-for="article in articles"
               :model="article"
               @selected="onSelected"
               />
            </v-col>
            <v-col cols="3">
               <!-- <sides-right /> -->
            </v-col>
         </v-row>
      </MqResponsive>
      <MqResponsive target="sm-">
         <v-fade-transition mode="out-in">
            <v-row>
               <v-col cols="12">
                  <ArticlesItem v-for="article in articles"
                  :model="article"
                  @selected="onSelected"
                  />
               </v-col>
            </v-row>
         </v-fade-transition>
      </MqResponsive>

   </v-container>
</template>
