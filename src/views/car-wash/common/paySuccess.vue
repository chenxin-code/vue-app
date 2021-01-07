<template>
  <div class="paysuccess">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content class="container">
      <div class="padding-con">
        <div class="top-image">
          <div class="title-con">
            <img src="../images/pay-success.png"/>
          </div>
        </div>
        <div class="pay-success-tip success">恭喜您，支付成功!</div>
        <!-- <div class="pay-success-tip jump">30”后将自动跳转到洗车页面</div> -->
        <div class="btm-btn">
          <div class="btn-r" v-if="false">
            <img src="../images/icon-scan.png" alt="" class="icon-btn">
            扫码洗车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
          <div class="btn-r" v-else @click="immediatelyWash">
            立即洗车(<van-count-down :time="60 * 1000" format="ss" class="reset-count-down" @finish="immediatelyWash"/>S)
          </div>
        </div>
      </div>
      <div class="step">
        <p class="titer">洗前检查</p>
        <div class="stepBox">
          <img src="../images/第一步.png"/>
          <div class="stepBox-right">
            <p>第一步</p>
            <span>确认当前停车位置为正确的洗车区域，如果没有将无法启动洗车，需要进行调整。</span>
          </div>
        </div>
        <div class="stepBox">
          <img src="../images/第二步.png"/>
          <div class="stepBox-right">
            <p>第二步</p>
            <span>检查四周是否存在异常，如果存在，立即与相关工作人员进行联系，确保不会出现问题！</span>
          </div>
        </div>
        <div class="stepBox">
          <img src="../images/第三步.png"/>
          <div class="stepBox-right">
            <p>第三步</p>
            <span>车辆熄火，关闭车门车窗，收回后视镜等，以免车辆剐蹭带来经济损失！</span>
          </div>
        </div>
      </div>
    </nav-content>
    <!-- 停车位置错误 -->
    <van-dialog class="reset-dialog-style" v-model="tips" confirm-button-text="我知道了！">
      <div slot="title">停车位置错误</div>
      当前停车不在洗车的有效范围内！<br/>无法开启洗车服务
    </van-dialog>
  </div>
</template>

<script>
  import { CountDown } from 'vant'
  export default {
    name: 'paysuccess',
    components: {
      VanCountDown: CountDown
    },
    data() {
      return {
        tips: false,
      }
    },
    created() {},
    methods: {
      backEvent() {
        this.$router.go(-1)
      },
      eventClick() {
        this.$router.replace({
          path: '/device_management/home',
          query: {
            psySuccess: true
          }
        })
      },
      turnback: function () {//返回
        this.$router.go(-1);
      },
      activated () {},
      beforeRouteLeave (to, from, next) {
        this.$keepaliveHelper.deleteCache(this)
        next()
      },
      sharePage() {},
      // 立即洗车 -- 检查车辆停车状态
      immediatelyWash() {
        this.$Loading.open()
        this.$http.post('/app/json/app_self_car_order/checkParkStatus', {
          deviceCode: this.$route.query.deviceCode,
          storeOuCode: this.$route.query.storeOuCode
        }).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            if (data.data.result == 'true' || data.data.result == true) {
              // 车辆到位
              this.$router.replace({
                path: '/carWash/speedProgress',
                query: {
                  orderId: this.$route.query.orderId,
                  orderType: this.$route.query.orderType,
                  tradeNo: String(this.$route.query.tradeNo),
                  deviceCode: this.$route.query.deviceCode,
                  storeOuCode: this.$route.query.storeOuCode
                }
              })
              
              // let checkState = JSON.parse(data.data.data)
              // if (checkState.isOK == 1) {
                

              //   // this.$router.replace({
              //   //   path: '/carWash/speedProgress',
              //   //   query: {
              //   //     orderId: 5648,
              //   //     orderType: 700006002,
              //   //     tradeNo: '99920200828036769917799',
              //   //     deviceCode: '00E04C0E06EB0000',
              //   //     storeOuCode: 1
              //   //   }
              //   // })
              // } else {
              //   // 车辆未到位
              //   this.tips = true
              // }
            } else {
              this.$Toast(data.data.msg)
            }
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Loading.close()
          this.$Toast(`checkParkStatus err ${err}`)
        })
      }
    },
  }
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/mixin.styl';
  .reset-count-down {
    display inline-block;
    font-size 18px;
    color #fff;
    font-weight 500;
    width 24px;
  }
  .reset-dialog-style {
    border-radius 5px;
    /deep/ .van-dialog__header {
      padding-top 30px;
      font-size 24px;
      font-weight 500;
      color #118820
    }
    /deep/ .van-dialog__content {
      color #676767
      font-weight 500;
      font-size 14px;
      line-height 21px;
      padding 0 20px;
      margin-top 17px;
      margin-bottom 30px;
      text-align center;
    }
    /deep/ .van-dialog__confirm {
      color #118820
      font-weight 500;
    }
    .has-bg {
      font-weight 500;
      color #118820;
    }
  }
  .paysuccess {
    width 100%
    height 100%
    overflow: hidden
    .container {
      width 100%
      height 100%
      padding 0 12px
      background-color #F5F5F5
      .padding-con {
        padding 20px 0
        .top-image {
          display flex
          padding-bottom 15px
          .title-con{
            margin auto
            display flex
            align-items center
            img {
              width 60px
              height 60px
            }
          }
        }
        .pay-success-tip {
          padding 8px 20px;
          text-align center
          color #333333
          
        }
        .success {
          font-weight 500
          font-size: 22px;
        }
        .jump {
          font-size: 15px;
        }
        .btm-btn {
          padding 10px 0;
          display flex;
          justify-content center
          .btn-r {
            width 200px;
            height 44px;
            line-height 43px;
            text-align center;
            border-radius 22px;
            background:linear-gradient(180deg,rgba(39,189,67,1) 0%,rgba(17,136,32,1) 100%);
            font-size 18px;
            color #fff;
            font-weight 500;
            .icon-btn {
              float left;
              width 44px;
              height 44px;
            }
          }
        }
      }
      .step {
        width 100%
        padding 0 20px 
        background-color #fff
        border-radius:10px
        border: .5px solid #eaeaea
        .titer {
          font-size 18px
          font-weight 500
          color #118820
          text-align center
          padding 20px 0 0
        }
        .stepBox {
          margin 30px 0
          width 100%
          height 50px
          display flex
          img {
            width 50px
            height 50px
          }
          .stepBox-right {
            width: calc(100% - 50px)
            margin-left 10px
            p {
              color #118820
              font-size: 15px;
              font-weight: 500
              margin-bottom 6px
            }
            span {
              width 100%
              color #969595
              line-height: 16px;
              ellipse-2()
            }
          }
        }
      }
    }
  }

</style>
