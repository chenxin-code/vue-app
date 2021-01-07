<template>
  <div ref="ErrPageRef" v-show="visible" class="err-page">
    <div class="error-div">
      <!--<div class="top-space" v-if="!hasBtn"></div>-->
      <div v-if="errType == 'NetError'">
        <img src="../../../../../static/image/error/p3.png"/>
        <div class="title">服务器正在开小差，请稍后！</div>
        <div class="light">请稍后尝试或联系我们的客服！</div>
        <div class="err-btn" @click="btnEvent">再次尝试</div>
      </div>
      <div v-if="errType == 'NoProducts'">
        <img src="../../../../../static/image/error/p1.png"/>
        <div class="title">暂无商品信息！</div>
        <div class="light">去看看其他类型的商品吧！</div>
        <div class="err-btn" @click="btnEvent">继续购物</div>
      </div>
      <div v-if="errType == 'NoCart'">
        <img src="../../../../../static/image/error/p4.png"/>
        <div class="title">购物车空空如也……</div>
        <div class="light">去看看其他的商品吧！</div>
        <div class="err-btn" @click="btnEvent">继续购物</div>
      </div>
      <div v-if="errType == 'NoAddress'">
        <img src="../../../../../static/image/error/p2.png"/>
        <div class="title">您还没有添加地址！</div>
        <div class="light">请添加您的地址信息！</div>
        <div class="err-btn" @click="btnEvent">添加收货地址</div>
      </div>
      <div v-if="errType == 'NoOrder'">
        <img src="../../../../../static/image/error/p1.png"/>
        <div class="title">列表无数据!</div>
        <div class="light"></div>
        <div class="err-btn" @click="btnEvent">再次尝试</div>
      </div>


    </div>
  </div>
</template>

<script>
  export default {
    name: 'err-page',
    components: {},
    props: {
      errType: {
        type: String,
        default: function () {
          return 'NetError'
        }
      },
      pageType: {
        type: String,
        default: function () {
          return 'noNav'
        }
      },
      btnCallBack: {
        type: Function
      }
    },
    data() {
      return {
        visible: false
      }
    },
    methods: {
      btnEvent: function () {
        this.btnCallBack()
      }
    },
    mounted() {
      console.log(this.pageType)
       // if (this.pageType == 'hasNav') {
       //   this.$nextTick(() => {
       //     this.$refs.ErrPageRef.style.top = '64px';
       //   })
       // }else if (this.pageType == 'hasTab') {
       //   this.$nextTick(() => {
       //     this.$refs.ErrPageRef.style.top = '112px';
       //   })
       // }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  .err-page {
    position absolute;
    top 0px;
    bottom 0px;
    left 0px;
    right 0px;
    background-color $color-background-lll
    overflow hidden
    z-index 1000;
    .error-div {
      position absolute
      top 45%
      left 10%
      margin-top -160px;
      width 80%;
      height 320px;
      text-align center;

      .top-space {
        height 30px;
      }

      img {
        width 150px;
        height 150px;
      }

      .title {
        font-size $font-size-medium-x
      }

      .light {
        margin-top 14px;
        font-size $font-size-medium-s
        color $color-text-l
      }

      .err-btn {
        display inline-block;
        min-width 60%;
        padding 9px 20px;
        margin-top 20px;
        font-size $font-size-medium;
        border-radius 20px;
        border 1px solid $color-theme-btn-d
        color $color-theme-btn-d
      }
    }
  }
</style>
