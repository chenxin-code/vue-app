/**Created by liaoyingchao on 2018/10/23.*/

<template>
  <div class="index">
    <keep-alive>
      <router-view :key="$route.path" v-if="isShow()"/>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: "index",
    components: {},
    data() {
      return {
        showSub: true
      }
    },
    methods: {
      isShow: function () {
        let path = this.$route.path;
        console.log('----------', path)
        if (path.indexOf("/mall2") === 0) {
          return true
        }
        return false
      }
    },
    created() {
    },
    mounted() {
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
