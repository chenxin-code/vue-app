/**Created by liaoyingchao on 2019-10-21.*/

<template>
  <div class="yl-pay-redirect">
    
  </div>
</template>

<script>
  export default {
    name: "yl-pay-redirect",
    components: {},
    data() {
      return {}
    },
    methods: {},
    created() {
      this.$bridgefunc.turnBack()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .yl-pay-redirect {
    width 100%
    height 100%
    overflow hidden
  }
</style>
