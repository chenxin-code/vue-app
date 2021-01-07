/**Created by steven on 2019/6/21.*/

<template>
  <!--<transition name="fade">-->
    <div class="group-success">
      <div class="content">
        <img class="up" src="./image/success-up-3.png" alt="" v-if="successType == 2">
        <img class="up" src="./image/success-up-2.png" alt="" v-else-if="successType == 3">
        <img class="up" src="./image/success-up.png" alt="" v-else>
        <div class="down" v-if="successType == 3">
          <p class="title1">还差最后一步</p>
          <p class="title2">快让好友一起参团 获得低价商品~</p>
          <p class="title3" @click="shareGroup">邀请好友参团</p>
        </div>
        <div class="down" v-else>
          <p class="title1">订单开始备货</p>
          <p class="title2">点击查看订单进入订单页面</p>
          <p class="title3" @click="closeEvent">查看订单</p>
        </div>
        <div class="close">
          <img @click="closeEvent" src="./image/guanbi.png" alt="">
        </div>

      </div>

    </div>
  <!--</transition>-->

</template>

<script>

export default {
  name: "group-success",
  components: {

  },
  props:['successType'],
  data () {
    return {
      // isShow:false
    }
  },
  methods: {
    closeEvent: function () {
      this.$emit('closeEvent')
    },
    shareGroup: function () {
      this.$emit('shareGroup')
    }
  },
  watch: {
    // isShow(curVal, oldVal) {
    //   this.$emit(`update:visible`, curVal)
    // },
  },
  created () {
    // this.isShow = this.visible;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .group-success {
    width 100%
    height 100%
    overflow hidden
    position absolute
    z-index 100000
    background-color rgba(0, 0, 0, 0.4)
    display flex
    align-items center
    justify-content center
    .content{
      width 100%
      padding-right 10px
      .up{
        display block;
        width 330px
        height 125px
      }
      .down{
        margin-left 43px
        width 287px
        height 166px
        background-image: url('./image/success-down.png');
        background-size: 100% 100%;

        display flex
        flex-direction column
        justify-content center
        align-items center

        .title1{
          font-size 20px
          font-weight $font-weight-x
        }
        .title2{
          font-size  $font-size-medium-x
          margin-top 8px
        }
        .title3{
          margin-top 15px
          font-size  20px
          font-weight $font-weight-x
          background-color $color-theme-r
          padding 10px 24px
          border-radius 20px
          color white
        }

      }
      .close{
        width 100%
        margin-top 60px
        display flex
        justify-content center
        img{
          width 30px
          height 30px
        }
      }
    }

  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
