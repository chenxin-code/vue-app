/**Created by liaoyingchao on 2020-01-03.*/

<template>
  <div class="language">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content">

      </div>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "language",
    components: {},
    data() {
      return {}
    },
    methods: {},
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .language {
    width 100%
    height 100%
    overflow hidden
    .content {

    }
  }
</style>
