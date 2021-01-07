<template>
  <div class="paysuccess">
    <nav-top :no-back="true" title="支付成功">
      <!-- <div class="right-btn theme_font_gray" style="right: 0px; height: 44px; top: 0px; padding-right: 12px;font-size: 16px;" @click="turnback">完成</div> -->
      <!--<div class="right-btn">完成</div>-->
      <div class="life-pay" @click="openRechargeBill">
        <img src="../image/zd.png" alt />
      </div>
    </nav-top>
    <nav-content>
      <div class="scroll-div">
        <div class="padding-con">
          <!-- <div class="top-image">
            <div class="title-con">
              <img src="static/image/mall2/finish.png" />
              <p class="theme_font_red">支付成功！</p>
            </div>
          </div>-->
          <van-steps direction="vertical" active-color="#f80f16" :active="1">
            <van-step>
              <h3>支付完成</h3>
            </van-step>
            <van-step>
              <h3>预计10分钟到账,请关注到账通知</h3>
            </van-step>
            <van-step>
              <h3>充值到账</h3>
            </van-step>
          </van-steps>
          <!-- <div class="btn-con theme_bg_white theme_border_light"><p class="theme_font_gray" @click="eventClick(1)">我的订单</p></div> -->
          <div class="btn-con theme_bg_red theme_border_red_i">
            <p class="theme_font_white" @click="turnback">返回</p>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>

export default {
  name: 'paysuccess',
  data() {
    return {
      msg: 'msg'
    }
  },
  mounted() {
    console.log(234)
    console.log(this.$store.state.globalConfig.hideRechargeEntry)
  },
  methods: {
    // eventClick: function (type) {
    // if (type == 1){//我的订单
    //   if (this.$store.state.mall2.staticDeliverType == 1) {
    //     this.$router.replace({
    //       path: '/mall2/orderlist',
    //       query: {
    //         selectedIndex: '2'
    //       }
    //     });
    //   } else {
    //     this.$router.replace({
    //       path: '/mall2/orderlist?selectedIndex=1',
    //     });
    //   }
    // }else if (type == 2){//继续购物
    //   this.$router.go(-1);
    // }
    // },
    turnback: function () {//返回
      /**
       * @type {string}
       * 话费充值 type=1
       * 流量充值 type=2
       * 游戏充值 type=3
       * 视频会员 type=4
       * QQ充值   type=5
       * 公共事业 type=6
       * 燃气费   type=7(公共事业和燃气费不能同时存在)
       *
       * key: hideRechargeEntry
       value: 字符串，多个逗号分隔
       列如要隐藏 游戏充值和固化充值 value = 3,6
       */
      // 如果配置（hideRechargeEntry）中 隐藏了公共事业 （6）代表只有燃气费一个入口，返回就直接返回到话费充值页面
      let hideRechargeEntry = this.$store.state.globalConfig.hideRechargeEntry
      if (hideRechargeEntry) {
        if (hideRechargeEntry.includes(6) && !hideRechargeEntry.includes(7)) {
          this.$router.replace({
            path: '/phone-bill-recharge',
          })
        } else {
          this.$router.replace({
            path: '/life-pay',
          });
        }
      }
    },
    activated() {
      this.$userCenter._getMyOrder();
    },
    beforeRouteLeave(to, from, next) {
      this.$keepaliveHelper.deleteCache(this)
      next()
    },
    openRechargeBill() {
      // 打开账单页面
      this.$router.push({ path: '/recharge-bill', query: { name: 'lify' } })
    }
  },
  created() {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';

.paysuccess {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .life-pay {
    text-align: right;
    padding-right: 10px;

    img {
      width: 20px;
      vertical-align: middle;
    }
  }

  .scroll-div {
    position: absolute;
    top: 0;
    bottom: 0px;
    left: 0px;
    right: 0px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    // background: url('../../../../static/image/mall2/list-bg.png') no-repeat center center / 100% 100%;
  }

  .top-image {
    display: flex;
    padding-bottom: 15px;

    .title-con {
      margin: auto;
      display: flex;
      align-items: center;

      img {
        width: 41px;
        height: 45px;
      }

      p {
        margin-left: 5px;
        font-size: $font-size-medium;
      }
    }
  }

  .btn-con {
    margin: 10px 25px 0px 25px;
    display: flex;
    padding: 10px 0px;
    border-radius: 20px;
    border: 1px solid;

    P {
      width: 100%;
      text-align: center;
      font-size: $font-size-small;
    }
  }

  .padding-con {
    padding: 12px;
  }

  .bigtitle {
    font-size: $font-size-medium;
    font-weight: $font-weight-m;
    text-align: center;
  }

  .recommend-div {
    overflow: hidden;
  }

  /deep/ .van-step--finish {
    .van-step__circle {
      background-color: #f80f16;
    }

    .van-step__line {
      background-color: #f80f16;
    }
  }
}
</style>
