<template>
   <form @submit.prevent="search">
      <v-text-field :label="label"
      prepend-icon="mdi-magnify"
      clearable
      v-model="val" 
      @click:clear="clear"
      />
   </form>
</template>
<script>
export default {
   name: 'Search',
	props: {
      label: {
         type: String,
         default: '搜尋'
      },
      keyword: {
         type: String,
         default: ''
      }
	},
   data: () => ({
      val: ''      
   }),
   beforeMount() {
      this.val = this.keyword
   },
   methods: {
      clear() {
         this.val = ''
         this.search()
      },
      search() {
         this.$emit('search', this.val)
      }
	}
}
</script>