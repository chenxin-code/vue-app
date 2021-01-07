/**Created by liaoyingchao on 2020-06-23.*/

<template>
  <div class="jzg">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <iframe class="iframe-content" :src="frameUrl" frameborder="0"></iframe>
    </nav-content>
  </div>
</template>

<script>
  export default {
    name: "jzg",
    components: {},
    data() {
      return {
        frameUrl: 'https://qd.jingzhengu.com/xiansuo/sellcar-youlu.html'
      }
    },
    methods: {},
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .jzg {
    width 100%
    height 100%
    overflow hidden
    .iframe-content{
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background white
    }
  }
</style>
