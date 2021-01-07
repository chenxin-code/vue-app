<template>
  <div class="nav-top theme_bg_white" :style="{height: (this.$store.state.barHeight+$market.getNavHeight(isMust))+ 'px', backgroundImage: 'url('+ bgImg +')', ...navTopStyle}">
    <div class="navcontent" :style="{top: this.$store.state.barHeight+ 'px','height': $market.getNavHeight(isMust)+'px','line-height': $market.getNavHeight(isMust)+'px'}">
      <div v-if="!noTitle" class="title-div" :class="[bgImg ? 'theme_font_white' :'theme_font_black' ]" >{{navTitle}}</div>
      <div v-if="!hideBackBtn" class="nav-back-btn"  @click="backEvent">
        <i class="iconfont mall-fanhui" :class="[bgImg ? 'theme_font_white' :'theme_font_black' ]" style="margin-left: 10px; font-size: 20px;"></i>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import cookie from 'js-cookie'
  export default {
    name: 'nav-top',
    props: {
      noTitle: [String, Number, Boolean],
      noBack: [String, Number, Boolean],
      title: String,
      bgImg: String,
      isMust: [String, Number, Boolean],
      navTopStyle: {
        type: Object,
        default() {
          return {}
        }
      }
    },  //isMust 无视所有的情况显示出来
    components: {},
    data() {
      return {
      }
    },
    computed: {
      navTitle() {
        return this.title || document.title || this.$route.meta.title || this.$route.name
      },
      hideBackBtn() {
        return this.noBack || this.$store.state.firstEntryLocationPath == this.$route.path || this.$route.query.hideBackBtn == 1
      }
    },
    created() {
    },
    methods: {
      backEvent: function () {
        this.$emit('backEvent')
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .nav-top {
    position absolute;
    width 100%;
    overflow hidden
    font-size 0px;
    z-index 5;
    background-size: 100% 100%;

    .navcontent{
      position: absolute;
      width 100%
      bottom 0px
      left 0px
      overflow hidden;
      .title-div {
        position absolute;
        left 50px;
        right 50px;
        bottom 0px;
        text-align center;
        font-weight $font-weight-x
        font-size $font-size-large;
        height 100%
      }

      .nav-back-btn {
        position absolute;
        top 0px
        left 0px;
        bottom 0px;
        width 50px;
        z-index 10;
        //background url("../static/image/mall/nav-back.png")
      }
    }

    .title-right {
      position absolute;
      right 0px;
      width 25px
      bottom 0px;
      text-align center;
      font-weight  $font-weight-m
      font-size $font-size-medium;
      height 100%
    }

    .search-div {
      position absolute;
      display flex;
      align-items center;

      .icon-font {
        font-size $font-size-medium;
      }
    }

    .right-btn {
      position absolute;
    }
  }
</style>
