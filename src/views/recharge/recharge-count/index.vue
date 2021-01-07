<template>
  <div class="reset-bg">
    <nav-top @backEvent="$router.go(-1)">
      <div class="my-cards">我的卡包</div>
    </nav-top>
    <!-- 内容区域 -->
    <nav-content>
      <div class="container">
        <swiper
          class="card-swiper"
          :options="swiperOption"
          ref="cardSwiper"
          @slideChange="callback">
          <swiper-slide
            v-for="(item, index) in cardList"
            :key="index"
            class="card-item">
            <div class="card-content">
              <img src="../assets/image/card3.png" alt="" class="bg">
              <div class="content">
                <div class="card-name">
                  <span class="text">洗擦擦洗车卡</span>
                  <span class="card-type">计次卡</span>
                </div>
<!--                <div class="card-price"><span class="identifier">￥</span>200</div>-->
                <div class="card-number">卡号：2937516029372943</div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
        <div class="top-title">
          <p class="card-name">洗擦擦洗车卡</p>
          <p class="card-price"><span class="identifier">￥</span>200</p>
          <p class="ad-content">后台设置的广告语</p>
        </div>
        <!-- 服务内容 -->
        <div class="service-range public-section">
          <p class="title">服务范围</p>
          <ul class="service-list">
            <li class="ser-item">洗车<span class="num">x5</span></li>
            <li class="ser-item">保养<span class="num">x10</span></li>
          </ul>
        </div>
        <!-- 适用店铺 -->
        <div class="applicable-shop public-section">
          <p class="title">
            <img class="shop-icon" src="../assets/image/shop-icon.png" alt="">
            xxx 自营店
          </p>
        </div>
        <!-- 邀请码 -->
        <van-cell-group class="invitation-code">
          <van-field
            type="number"
            label="邀请码："
            placeholder="填写邀请人手机号，没有可以不填写"/>
        </van-cell-group>
        <!-- 发票 -->
        <div class="invoice">
          <div class="public-section">
            <p class="title">
              发票
              <van-switch
                active-color="#f02c2d"
                size="20px"
                v-model="isInvoice"/>
            </p>
          </div>
          <div class="public-section">
            <p class="title has-bd-t">
              发票信息
              <span class="invoice-type">
                个人
                <img class="more-icon" src="../assets/image/more-icon.png" alt="">
              </span>
            </p>
          </div>
        </div>
        <!-- 详情描述 -->
        <div class="description public-section">
          <p class="title">详情描述</p>
          <div class="des-content">
            1.此卡可用于APP端消费易捷卓玛泉330ML、4L单次充值每次充100多送60，单笔3000元封顶
            <br><br>
            2.卡内余额不得超过4999元。支付成功后实时到帐单次充值每次充100多送60，单笔3000元封顶
          </div>
        </div>
      </div>
      <public-submit @click="subCard">立即开卡</public-submit>
      <!-- 立即支付弹框 -->
      <van-popup
        class="pay-modal"
        position="bottom"
        v-model="payModal">
        <div class="spend-price"><span>￥</span>99</div>
        <van-cell-group>
          <van-field
            label="商品名称"
            input-align="right"
            :readonly="true"
            v-model="oderName"/>
<!--          <van-field label="发票" :readonly="true">-->
<!--            <van-switch-->
<!--              slot="right-icon"-->
<!--              active-color="#F80F16"-->
<!--              size="20px"-->
<!--              :disabled="true"-->
<!--              v-model="isInvoice"/>-->
<!--          </van-field>-->
          <van-field
            v-if="complete"
            label="支付方式"
            input-align="right"
            :readonly="true"
            v-model="payStyle.text + '支付'"/>
          <van-radio-group v-model="radio">
            <van-cell-group>
              <van-cell v-for="(item, index) in selectedPayWay" :key="index" clickable
                        @click="changeStyle(item, index)">
                <div slot="title" class="pay-label">
                  <img class="pay-icon" v-if="item.payMode == '210'" src="../../../../static/image/mall2/weixin.png" alt="">
                  <img class="pay-icon" v-else src="../../../../static/image/mall2/zhifubao.png" alt="">
                  {{item.text}}支付
                </div>
                <van-radio @click="changeStyle(item, index)" :name="index" checked-color="#F80F16"/>
              </van-cell>
              <!--              <van-cell clickable @click="params.payTypeChange = '支付宝支付'">-->
              <!--                <div slot="title" class="pay-label">-->
              <!--                  支付宝支付-->
              <!--                </div>-->
              <!--                <van-radio name="支付宝支付" checked-color="#F80F16"/>-->
              <!--              </van-cell>-->
            </van-cell-group>
          </van-radio-group>
        </van-cell-group>
        <div class="pay-confirm" @click="nowRecharge">立即支付</div>
        <img @click="payModal = false" class="close-btn" src="../../../../static/image/coupon/close-btn.png" alt="">
      </van-popup>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import { Toast } from 'vant'
  import PublicSubmit from '../components/public-submit.vue'
  import payHelper from '@/utils/payHelper'
  export default {
    name: '',
    data() {
      return {
        swiperOption: {
          effect: 'coverflow',
          coverflowEffect: {
            depth: 60,
            rotate: 40,
            slideShadows: false
          },
          slidesPerView: 'auto',
          centeredSlides: true
        },
        cardList: [
          {
            url: '../assets/image/card1.png'
          },
          {
            url: '../assets/image/card2.png'
          },
          {
            url: '../assets/image/card3.png'
          }
        ],
        isInvoice: true, // 是否开票
        payModal: false,
        params: {
          orderCode: '12313231234',
          payType: '微信支付',
          payTypeChange: '微信支付'
        },

        status: true,
        changeItem: null, // 选中效果
        changeNum: '', // 实际需支付的面额
        selectedPayWay: [], // 支付方式
        orderInfo: '', // 订单信息
        payStyle: {}, // 支付方式
        radio: '',
        complete: false, // 支付方式获取
        submitInfo: '', // 下单成功的信息 为支付使用
        changeInvoice: false, // 选择是否填写发票
        oderName: '', // 商品名称
      }
    },
    methods: {
      // 立即开卡
      changeStyle(item, index) {
        // 选择支付方式
        this.radio = index
        this.payStyle = item
      },
      subCard() {
        this.payModal = true
        this.setPayWays() // 获取支付方式
      },
      setPayWays() {
        this.selectedPayWay = []

        payHelper.getPayWays('200001', this.orderInfo.receivablesOuCode).then(res => {
          this.selectedPayWay = res || []
          this.complete = true
          if (this.selectedPayWay.length > 0) {
            this.radio = 0
            this.payStyle = this.selectedPayWay[0]
          }
        })
      },
      nowRecharge() {
        // 提交订单
        if (this.radio !== '') {
          this.$Loading.open()
          let paramsData = {
            token: this.$store.state.login.token,
            deliveryType: '2',
            carts: [{
              skuId: this.orderInfo.skuId,
              storeOuCode: this.orderInfo.storeOuCode,
              number: 1
            }]
          }
          this.$http.post('/app/json/app_shopping_order/submit', paramsData).then(res => {
            let data = res.data
            if (data.status == 0) {
              this.submitInfo = data.data
              console.log(this.submitInfo)
              this.pay()
            } else {
              this.$Toast(data.info)
            }
            this.$Loading.close()
          })
        } else {
          this.$Toast('请选择支付方式')
        }
      },
      pay() {
        // 支付订单
        if (this.payStyle == null) {
          this.$Toast("请选择支付方式！")
          return;
        }
        payHelper.payEvent(this.payStyle, this.submitInfo.orderType, this.submitInfo.orderId).then(() => {
          this.enterSuccess();
        }).catch(() => {
        })
        // this.$Loading.open()
        // let paramsData = {
        //   token: this.$store.state.login.token,
        //   orderType: this.submitInfo.orderType, // 订单类型
        //   orderId: this.submitInfo.orderId, // 商城订单ID
        //   payMode: this.payStyle.payMode, // 支付方式
        //   payModeSub: this.payStyle.payModeSub // 支付具体方式
        // }
        // this.$http.post('/app/json/app_shopping_order/pay', params).then(res => {
        //   let data = res.data
        //   if (data.status == 0) {
        //     payHelper.doPay(this.payStyle, data.data.payInfo).then(() => {
        //       this.enterSuccess()
        //     }).catch(() => {
        //       this.$Toast('支付失败')
        //     })
        //   } else {
        //     this.$Toast(data.info)
        //   }
        //   this.$Loading.close()
        // })
      },
      enterSuccess() {
        // 支付宝成功支付以后的回调
        this.$router.replace({
          path: '/recharge-bill-details',
          query: {
            orderType: this.submitInfo.orderType,
            orderId: this.submitInfo.orderId
          }
        })
      },
      // 更改支付方式
      // 立即支付
      payConfirm() {
        console.log('立即支付')
      },
      callback() {
        console.log(this.$refs.cardSwiper.swiper.activeIndex) // 当前切换索引
      }
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
  .card-swiper {
    overflow hidden
    // height 160px
    background-color #fff
    .card-item {
      width 75%
      .card-content {
        width 100%
        height 160px
        overflow hidden
        border-radius 10px 10px 0 0
        position relative
        .bg {
          width 100%
          height 100%
        }
        .content {
          box-sizing border-box
          position absolute
          left 0
          top 0
          bottom 0
          right 0
          padding 20px 15px
          color #fff
          display flex
          justify-content space-between
          align-items left
          flex-direction column
          .card-name {
            font-size 18px
            display flex
            justify-content space-between
            align-items flex-end
            .text {
              max-width 200px
              ellipse()
            }
            .card-type {
              font-size 14px
            }
          }
          .card-price {
            font-size 30px
            margin-top 35px
            .identifier {
              font-size 20px
            }
          }
          .card-number {
            margin-top 25px
            font-size 14px
          }
        }
      }
    }
  }
  .top-title {
    position relative
    z-index 2
    background-color #fff
    box-shadow 0 -5px 5px #ddd
    padding 15px
    margin-top 2px
    // bdr-t()
    .card-name {
      font-size 18px
    }
    .card-price {
      padding-top 10px
      font-size 25px
      color #F02E2C
      .identifier {
        font-size 18px
      }
    }
    .ad-content {
      font-size 13px
      padding-top 10px
      color #454545
      line-height 16px
    }
  }
  .public-section {
    background-color #fff
    margin-top 10px
    padding 0 15px
    .title {
      font-size 17px
      padding 15px 0
      display flex
      justify-content space-between
      align-items center
      &.has-bd-t {
        bdr-t()
      }
      .more-icon {
        width 20px
        height 5px
      }
    }
  }
  .service-range {
    .service-list {
      .ser-item {
        display flex
        justify-content space-between
        height 45px
        line-height 45px
        font-size 15px
        bdr-b()
      }
    }
  }
  .applicable-shop {
    .title {
      justify-content left
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
      font-size 13px
      .more-icon {
        margin-left 10px
      }
    }
  }
  .description {
    padding-bottom 15px
    .des-content {
      font-size 14px
      line-height 19px
      color #666
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
</style>
