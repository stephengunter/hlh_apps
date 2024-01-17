<template>
   <div class="tiptap-vuetify-editor__content" v-html="content" />			
</template>

<script>
export default {
   name: 'HtmlPreview',
   props: {
		content: {
         type: String,
         default: ''
      }
   }
}
</script>