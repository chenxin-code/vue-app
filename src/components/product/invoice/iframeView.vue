<template>
  <iframe :src="$route.query.url" frameborder="0"></iframe>
</template>

<script>
    export default {
        name: "iframeView",
       data() {
          return {

          }
       },
      mounted() {
        console.log(this.$route.query.url);
      }
    }
</script>

<style scoped>

</style>
