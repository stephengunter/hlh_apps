<template>
   <span class="my-chip themelight">
      <span class="my-chip__content">
         <slot> </slot>
      </span>
   </span>
</template>

<script>
export default {
   name: 'CoreLabel'

}
</script>

<style scoped>
.my-chip .my-chip__content {
   cursor: default;
   -webkit-box-pack: justify;
   -ms-flex-pack: justify;
   justify-content: space-between;
   padding: 5px;
   z-index: 1;
   
}

.my-chip, .my-chip .my-chip__content {
   -webkit-box-align: center;
   -ms-flex-align: center;
   align-items: center;
   border-radius: 28px;
   display: -webkit-inline-box;
   display: -ms-inline-flexbox;
   display: inline-flex;
   vertical-align: middle;
   margin: 3px;
}

.themelight.my-chip {
   background: #e0e0e0;
   color: rgba(0,0,0,.87);
}
</style>