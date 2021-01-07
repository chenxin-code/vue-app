<template>
  <div class="bottom">

  </div>
</template>

<script>

  export default {
    name: 'template',
    components: {},
    data() {
      return {
        msg: 'msg'
      }
    },
    methods: {
      testFunc: function () {
        console.log('testFunc')
      }
    },
    created() {
      document.title = "template"
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/stylus">

</style>
