<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
//import { SET_TAGS } from '@/store/mutations.type'

const store = useStore()

onMounted(() => {
   const items = [{
      title: '維修常識', ac: 32 
   },{
      title: '省電撇步', ac: 106
   },{
      title: '好物安利', ac: 18
   }]
   //store.commit(SET_TAGS, items)
})

const tags = computed(() => store.getters.tags)

function onTagSelected(tag) {
   console.log('selected', tag)
}

</script>

<template>
   <div>
      <v-row>
         <v-col>
            <v-img
            src="https://picsum.photos/350/165?random"
            height="125"
            cover
            class="bg-grey-lighten-2"
            ></v-img>
         </v-col>
      </v-row>
      <v-row>
         <v-col>
            <v-card>
               <v-chip link v-for="tag in tags" @click.prepend="onTagSelected(tag)"  class="ma-2" label>
                  {{ tag.title }} ({{ tag.ac }})
               </v-chip>
            </v-card>
         </v-col>
      </v-row>
   </div>
</template>