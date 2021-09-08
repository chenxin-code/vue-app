/**Created by liaoyingchao on 2018/10/24.*/

<template>
  <div class="nav-content" style="top: 0" v-if="wxenvironment() && titleDefault">
    <slot></slot>
  </div>
  <div class="nav-content" :style="{top: top + 'px'}" v-else>
    <slot></slot>
  </div>
</template>

<script>
  import cookie from 'js-cookie'
  export default {
    name: "nav-content",
    components: {},
    prop: {
      titleDefault: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },
    methods: {
      wxenvironment() {
        let ua = window.navigator.userAgent.toLowerCase();
        return ua.match(/MicroMessenger/i) == "micromessenger";
      },
    },
    computed: {
      // 不合设计 不要用各种判断，不同情况尽量用webtype，所有地方都判断webtype，谁也不知道cookie什么时候就变了
      // web-view 打开新页面去除 自带导航（河北有滴）
      // isNativeTop() {
      //   // let f = true
      //   // let isnativetop = cookie.get('isnativetop') || ''
      //   // if ((isnativetop && isnativetop == 1) || (this.$route.query.isnativetop && this.$route.query.isnativetop == 1)) {
      //   //   f = false
      //   //   cookie.set('isnativetop', 1)
      //   // }
      //   return cookie.get('isnativetop') != 1
      // },
      top() {
        return this.$store.state.barHeight+this.$market.getNavHeight()
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .nav-content {
    position absolute;
    left 0px;
    right 0px;
    bottom 0px;
    overflow hidden;
  }
</style>
