/**Created by liaoyingchao on 2018/10/23.*/

<template>
  <div class="index">
    <keep-alive>
      <router-view :key="$route.path" v-if="$route.meta.keepAlive && isShow()" />
    </keep-alive>
    <router-view :key="$route.path" v-if="!$route.meta.keepAlive && isShow()" />
  </div>
</template>

<script>
  export default {
    name: "index",
    components: {},
    data() {
      return {}
    },
    methods: {
      isShow: function () {
        let path = this.$route.path;
        if (path.indexOf("/usercenter") === 0) {
          return true
        }
        return false
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .index {
    width 100%
    height 100%
    overflow hidden
  }
</style>
