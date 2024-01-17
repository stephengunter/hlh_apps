<template>
   <v-tooltip v-if="tooltip" top>
      <template v-slot:activator="{ on, attrs }">
         <v-btn  small fab color="default" :class="class_name"
         :disabled="disabled" @click.prevent="search"  v-bind="attrs" v-on="on"
         >
            <v-icon dark>mdi-magnify</v-icon>
         </v-btn>
      </template>
      <span v-text="tooltip"></span>
   </v-tooltip>
   <v-btn v-else small fab color="default" :class="class_name"
   :disabled="disabled" @click.prevent="search"
   >
      <v-icon dark>mdi-magnify</v-icon>
   </v-btn>
  
</template>

<script>
export default {
   name: 'ButtonSearch',
   props: {
      tooltip: {
         type: String,
         default: ''
      },
      class_name: {
         type: String,
         default: ''
      },
      disabled: {
         type: Boolean,
         default: false
      },
   },
   methods: {
      search() {
         this.$emit('search')
      }
   }
}
</script>

<style>

</style>