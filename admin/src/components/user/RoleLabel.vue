<template>
   <v-chip small class="ml-1">{{ role }}</v-chip>
</template>

<script>

export default {
   name: 'UserRoleLabel',
   props: {
		role: {
         type: String,
         default: ''
      }
   }

}

</script>