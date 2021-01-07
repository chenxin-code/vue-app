<template>
  <div class="paysuccess">
    <nav-top :no-back="true">
      <div class="right-btn theme_font_gray" v-if="$store.state.webtype != 3" style="right: 0px; height: 44px; top: 0px; padding-right: 12px;font-size: 16px;" @click="turnback">完成</div>
    </nav-top>
    <nav-content>
      <div class="scroll-div">
        <div class="padding-con shadow-cell">
          <div class="top-image">
            <div class="title-con">
              <img src="static/image/mall2/finish.png"/>
              <p class="theme_font_red">支付成功！</p>
            </div>
          </div>
          <div class="pay-success-tip" v-if="$store.state.globalConfig.pay_success_tip">
            <div class="tip-text">{{$store.state.globalConfig.pay_success_tip}}</div>
          </div>
          <div class="btn-con theme_bg_white theme_border_light"><p class="theme_font_gray" @click="eventClick">查看订单</p></div>
          <!-- <div class="btn-con theme_bg_red theme_border_red_i"><p class="theme_font_white" @click="eventClick(2)">继续购物</p></div> -->
        </div>
        <!-- <SubPage :divKeywords="'PaySuccessDiv'"></SubPage> -->
      </div>
    </nav-content>
  </div>
</template>

<script>
  import wxfunc from '@/utils/wxfunc'
  import Config from '@/api/config'
  // import SubPage from '@/components/product/index/subpage/subpage'

  export default {
    name: 'paysuccess',
    components: {
      // SubPage
    },
    data() {
      return {}
    },
    methods: {
      eventClick() {
        this.$router.replace({
          path: '/device_management/home',
          query: {
            psySuccess: true
          }
        })
      },
      turnback: function () {//返回
        this.eventClick()
        // this.$router.go(-1);
      },
      activated () {},
      beforeRouteLeave (to, from, next) {
        this.$keepaliveHelper.deleteCache(this)
        next()
      },
      sharePage() {},
    },
    created() {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .paysuccess {
    width 100%
    height 100%
    overflow: hidden

    .scroll-div {
      position absolute;
      top 0px;
      bottom 0px;
      left 0px;
      right 0px;
      overflow-x hidden;
      overflow-y auto;
      -webkit-overflow-scrolling touch;
      background: url('../../../../static/image/mall2/list-bg.png') no-repeat center center / 100% 100%;
    }
    .top-image {
      display flex
      padding-bottom 15px
      .title-con{
        margin auto
        display flex
        align-items center
        img {
          width 41px
          height 45px
        }
        p{
          margin-left 5px
          font-size $font-size-medium
        }
      }
    }
    .pay-success-tip {
      padding 10px 20px;
      display flex;
      justify-content center;
      .tip-text {
        max-width 290px;
        font-size 12px;
        line-height 16px
      }
    }
    .btn-con{
      margin 10px 25px 0px 25px
      display flex
      padding 10px 0px
      border-radius 20px
      border 1px solid
      P {
        width 100%
        text-align center
        font-size $font-size-small
      }
    }
    .padding-con {
      padding 12px
    }
    .bigtitle {
      font-size $font-size-medium
      font-weight $font-weight-m
      text-align center
    }
    .recommend-div {
      overflow hidden;
    }
  }

</style>
