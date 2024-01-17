<script setup>
const name = 'ButtonCreate'
const props = defineProps({
   tooltip: {
      type: String,
      default: '新增'
   },
   disabled: {
      type: Boolean,
      default: false
   },
   class_name: {
      type: String,
      default: ''
   }
})
const emit = defineEmits(['create'])


function create() {
	emit('create')
}
</script>
<template>
   <v-tooltip v-if="tooltip" top>
      <template v-slot:activator="{ on, attrs }">
         <v-btn  small fab dark color="info" :class="class_name"
         :disabled="disabled" @click.prevent="create"  v-bind="attrs" v-on="on"
         >
            <v-icon dark>mdi-plus</v-icon>
         </v-btn>
      </template>
      <span v-text="tooltip"></span>
   </v-tooltip>
   <v-btn v-else small fab dark color="info" :class="class_name"
   :disabled="disabled" @click.prevent="create"
   >
      <v-icon dark>mdi-plus</v-icon>
   </v-btn>
  
</template>
<!-- 
<script>
export default {
   name: 'ButtonCreate',
   props: {
      tooltip: {
         type: String,
         default: ''
      },
      disabled: {
         type: Boolean,
         default: false
      },
      class_name: {
         type: String,
         default: ''
      },
   },
   methods: {
      create() {
         this.$emit('create')
      }
   }
}
</script>

<style>

</style> -->