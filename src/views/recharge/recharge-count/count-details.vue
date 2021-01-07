<template>
  <div class="reset-bg">
    <nav-top @backEvent="$router.go(-1)">
      <div class="my-cards" @click.stop="openRechargeDetails">交易明细</div>
    </nav-top>
    <!-- 内容区域 -->
    <nav-content>
      <div class="container" v-if="complete">
        <!-- 快捷支付二维码 -->
<!--        <div class="quick-pay" v-if="cardDetails.timesCountType == 2">-->
<!--          <canvas id="qrcode" class="quick-qrcode"></canvas>-->
<!--          <p class="name">快捷支付码</p>-->
<!--        </div>-->
        <!-- 卡片信息 -->
        <div class="card-info">
          <img class="card-img" :src="countInfo.cardFrontPicUrl" alt="">
          <div class="content">
            <p class="card-name">{{countInfo.cardName}}</p>
            <p class="card-num">卡号：{{countInfo.cardNo}}</p>
          </div>
        </div>
        <!--        <div class="services-list">-->
        <!--          <div class="table-title">-->
        <!--            <span>服务项目</span>-->
        <!--            <span>开卡次数</span>-->
        <!--            <span>剩余次数</span>-->
        <!--          </div>-->
        <!--          <ul class="ser-content">-->
        <!--            <li class="service-item">-->
        <!--              <span>洗车</span>-->
        <!--              <span>10 次</span>-->
        <!--              <span>9 次</span>-->
        <!--            </li>-->
        <!--            <li class="service-item">-->
        <!--              <span>汽车保养</span>-->
        <!--              <span>5 次</span>-->
        <!--              <span>4 次</span>-->
        <!--            </li>-->
        <!--          </ul>-->
        <!--        </div>-->
        <div class="services-list">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="title-item left">服务项目</div>
                <div class="title-item content">开卡次数</div>
                <div class="title-item right">剩余次数</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <ul class="ser-content">
                  <li class="service-item" v-for="(item, index) in countInfo.serviceItems" :key="index">
                    <div class="info-item left">{{item.skuName}}</div>
                    <div class="info-item content">{{item.useTimes}}次</div>
                    <div class="info-item right">{{item.residueTimes}}次</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <!-- 适用店铺 -->
        <div class="applicable-shop" v-for="(item, index) in countInfo.consumeStores" :key="index">
          <p class="title">
            <img class="shop-icon" src="../assets/image/shop-icon.png" alt="">
            {{item.storeName}}
          </p>
        </div>
        <!-- 详情描述 -->
        <div class="table-view instructions">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">失效日期</div>
              <div class="right" v-if="countInfo.termOfType == 1">永久有效</div>
              <div class="right" v-else-if="countInfo.termOfType == 2">已失效</div>
              <div class="right" v-else>{{countInfo.expireTime}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="description public-section">
                <p class="title">详情描述</p>
                <div class="des-content" v-html="countInfo.cardIntroduction"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--    扫码后弹框-->
      <van-popup v-model="showInfo" position="bottom">
        <div class="icon-pop">
          <van-icon name="cross" size="20" @click="showInfo = false"/>
        </div>
        <div class="recharge-popup">
          <ul class="serve-list">
            <li class="serve-item">洗车 -1次</li>
            <li class="serve-item">汽车保养 -2次</li>
          </ul>
          <div class="info">
            <div class="details">
              <span class="title">订单号</span>
              <span class="content">123412341</span>
            </div>
            <div class="details">
              <span class="title">消费店铺</span>
              <span class="content">喜擦擦汽车美容</span>
            </div>
            <div class="details">
              <span class="title">扣款时间</span>
              <span class="content">2019-11-11</span>
            </div>
          </div>
        </div>
        <div class="re-btn" @click="queryPay">确认支付</div>
      </van-popup>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Toast} from 'vant'
  import Qrcode from 'qrcode'
  import PublicSubmit from '../components/public-submit.vue'
  import DigitalPwd from '../../../components/mall2/common/digital-pwd'
  import {mapGetters} from 'vuex'
  import md5String from "../../../utils/md5"

  export default {
    name: '',
    data() {
      return {
        cardDetails: '',
        countInfo: '', // 详情
        easyCardModel: '', // 所选sku信息
        complete: false,
        showInfo: false // 扫码后的弹框
      }
    },
    destroyed() {
      clearInterval(this.queryPayStateTimer)
    },
    activated() {
      if (this.isPwdSet.status == 1) {
        // 设置过支付密码 直接调用支付接口
        this.payQrcodePay(this.isPwdSet.pwd, this.myInfo.qrcode)
        DigitalPwd.close()
      }
    },
    mounted() {
      this.cardDetails = JSON.parse(this.$route.query.cardDetails)
      this.onceCardBagdetail() // 卡包详情
      // this.makePayQrcode() // 用户生成预支付二维码接口
    },
    methods: {
      openRechargeDetails() {
        // 打开交易明细页面
        this.$router.push({path: '/recharge/transaction-details', query: {source: 'count', easyCardModel: this.countInfo.cardNo, id: this.countId}})
      },
      onceCardBagdetail() {
        // 卡包详情
        let paramsData = {
          token: this.$store.state.login.token,
          id: this.cardDetails.id
        }
        this.$request.post('/app/json/app_user_easy_card/onceCardBagdetail', paramsData).then(res => {
          if (res.status == 0) {
            this.countInfo = res.data
            this.easyCardModel = res.data.easyCardModel
            console.log(this.easyCardModel)
          } else {
            this.$Toast(res.info)
          }
          this.complete = true
        })
      },
      makePayQrcode() {
        // 用户生成预支付二维码接口
        this.$Loading.open()
        let url = '/app/json/app_pay/makePayQrcode';
        let params1 = {
          token: this.$store.state.login.token,
          payMode: 124, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金  124：易捷卡
          groupValue: this.countInfo.cardNo, // 分组值      奖励金用 易捷卡传卡号
          distOuCode: 1, // 发单机构
        }
        this.$http.post(url, params1).then(res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            this.myInfo = data.data;
            this.$nextTick(() => {
              this.toCanvas()
              clearInterval(this.queryPayStateTimer)
              this.queryPayStateTimer = setInterval(() => {
                this.payQrcodeCheck(this.myInfo.qrcode)
              }, 2000000)
            })
          } else {
            this.$Toast(data.info);
          }

        }, error => {
          this.$Loading.close();
        })
      },
      payQrcodeCheck(qrcode) {
        // 检查预支付二维码状态接口
        this.digitalPWD = ''
        this.$request.post('/app/json/app_pay/payQrcodeCheck', {
          payMode: 124, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金 124：易捷卡
          qrcode: qrcode // 二维码
        }).then(res => {
          if (res.status === 0) {
            this.payDetais = res.data
            if (this.payDetais.payUnit) {  // 支付点数  (如果为空,代表还没有发起支付)
              // 已发起支付
              this.showInfo = true // 支付信息弹框
              clearInterval(this.queryPayStateTimer) // 清除定时器
            }
          } else {
            this.$Toast(res.info)
          }
        })
      },
      queryPay() {
        // 确认支付按钮
        if (this.payDetais.needPayPwd) { // 是否需要支付密码
          // 需要
          if (this.payDetais.payPwdState == '1') { // 支付密码状态  0未设置支付密码 1支付密码已锁定 2已设置支付密码
            this.$Toast("支付密码已锁定，请稍后再试！")
            return;
          } else {
            DigitalPwd.open({
              initData: {
                payPwdState: this.payDetais.payPwdState
              },
              toSettingPwd: () => {
                this.$router.push({
                  path: '/usercenter/nosetpwd',
                  query: {
                    isSet: this.payDetais.payPwdState,
                    source: 'rebate'
                  }
                })
                DigitalPwd.close();
              },
              inputFinished: (value) => {
                this.digitalPWD = value
                this.payQrcodePay(this.digitalPWD, qrcode)
                DigitalPwd.close();
              }
            })
          }
        } else {
          // 不需要
          this.payQrcodePay(this.digitalPWD, qrcode)
        }
      },
      payQrcodePay(digitalPWD, qrcode) {
        // 预支付二维码支付接口
        let payPwd = ''
        if (digitalPWD) {
          payPwd = md5String(digitalPWD)
        }
        this.$request.post('/app/json/app_pay/payQrcodePay', {
          payMode: 124, // 支付方式    120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金 124：易捷卡
          qrcode: qrcode, // 二维码
          PayPwd: payPwd // 支付密码
        }).then(res => {
          if (res.status === 0) {
            this.$Toast("支付成功")
            this.showInfo = false // 关闭支付信息弹框
          } else {
            this.$Toast(res.info)
          }
        })
      },
      toCanvas() {
        Qrcode.toCanvas(document.getElementById('qrcode'), this.myInfo.qrcode.toString(), {
          margin: 0,
          width: 170
        })
      }
    },
    computed: {
      ...mapGetters(['isPwdSet'])
    },
    components: {
      Toast,
      PublicSubmit
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl'
  @import '~@/common/stylus/mixin.styl'
  .reset-bg {
    background-color #F6F6F6 !important
  }

  .my-cards {
    position absolute
    right 10px
    top 0
    font-size 13px
  }

  .container {
    height 100%
    overflow-y auto
    padding-bottom 80px
  }

  .quick-pay {
    background-color #fff
    overflow hidden
    padding: 10px 0

    .quick-qrcode {
      display block
      width 170px !important
      height 170px !important
      margin 10px auto 0
    }

    .name {
      font-size 14px
      text-align center
      margin 15px 0 5px
      color: $color-text
    }
  }

  .card-info {
    position relative
    margin-top 10px
    padding 10px 20px
    background-color #fff

    .card-img {
      display block
      width 100%
      border-radius 10px
      height: 150px
    }

    .content {
      box-sizing border-box
      position absolute
      left 20px
      top 5px
      bottom 5px
      right 20px
      padding 25px 15px
      color #fff
      display flex
      justify-content space-between
      align-items left
      flex-direction column

      .card-name {
        font-size 19px
        ellipse()
      }

      .card-price {
        font-size 35px

        .sign {
          font-size 20px
        }
      }

      .card-num {
        font-size 14px
        margin-top 15px
      }
    }
  }

  .services-list {
    background-color #fff
    margin-top 10px
    padding 0 13px
    font-size 14px
    .left {
      flex: 1
      text-align center
    }
    .right, .content {
      width: 25%
      text-align center
    }

    .ser-content {
      font-size 14px
      width: 100%
      .service-item {
        display flex
        justify-content space-between
        align-items center
        line-height 24px
      }
    }
  }

  .public-section {
    background-color #fff

    .title {
      padding 5px 0 8px 0
      display flex
      justify-content space-between
      align-items center
      font-size 14px

      &.has-bd-t {
        bdr-t()
      }

      .more-icon {
        width 20px
        height 5px
      }
    }
  }

  .applicable-shop {
    padding: 15px 20px
    margin 10px 0
    background-color #fff

    .title {
      display flex
      justify-content left
      align-items center
      font-size: 14px

      .shop-icon {
        width 22px
        height 20px
        display flex
        margin-right 10px
      }
    }
  }

  .invitation-code {
    margin-top 10px

    /deep/ &::after {
      display none
    }

    /deep/ .van-field__label {
      font-size 17px
    }
  }

  .invoice {
    margin-top 10px

    .public-section {
      margin-top 0
    }

    .invoice-type {
      display flex
      align-items center
      font-size 12px

      .more-icon {
        margin-left 10px
      }
    }
  }

  .description {
    .des-content {
      font-size 14px
      line-height 19px
      color #666
      >>> img {
        width: 100%
        vertical-align top
      }
    }
  }

  .pay-modal {
    border-radius 15px 15px 0 0

    .spend-price {
      font-size 30px
      text-align center
      margin-top 30px
      font-weight 700

      span {
        font-size 20px
        font-weight 500
      }
    }

    .van-cell {
      align-items center
    }

    .pay-label {
      display flex
      align-items center

      .pay-icon {
        width 25px
        margin-right 10px
      }
    }

    .van-hairline--top-bottom::after {
      display none
    }

    .pay-confirm {
      height 55px
      width 100%
      line-height 55px
      background-color #f02c2d
      text-align center
      font-size 20px
      color #fff
      margin-top 15px
    }

    .close-btn {
      width 15px
      position absolute
      right 20px
      top 15px
    }
  }

  .instructions {
    padding: 11px 5px
    background #fff

    .left {
      font-size: 14px
    }

    .right {
      color: $color-text-d
    }
  }
</style>
