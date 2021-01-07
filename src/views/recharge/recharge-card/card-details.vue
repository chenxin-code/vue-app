<template>
  <div class="reset-bg">
    <nav-top @backEvent="backEvent">
      <div class="my-cards" @click.stop="openRechargeDetails">交易明细</div>
    </nav-top>
    <!-- 内容区域 -->
    <nav-content>
      <div class="container" v-if="cardInfo">
        <div class="top-title">
          <div class="card-content">
            <img :src="easyCardModel.cardUrl" alt="" class="bg">
          </div>
          <p class="card-name">{{cardInfo.spuName}}</p>
          <p class="ad-content">{{cardInfo.spuShortName}}</p>
        </div>
        <!-- 充话费 -->
        <div class="charge-section public-section" v-if="skuList.length">
          <p class="title">选择充值金额</p>
          <recharge-grid :col="3" :list="skuList" ref="mychild" @change="chooseChargeCard"></recharge-grid>
          <van-cell-group class="enter-price" v-if="otherSkuInfo">
<!--          <van-cell-group class="enter-price">-->
            <van-field type="number" label="其他充值金额：" v-model="otherChargePrice" @input="inputOtherChargePrice"  @blur="otherChargePriceInput"
                      :placeholder="placeholder" >
              <div slot="right-icon" class="tip" v-if="salePrice">售价{{salePrice}}元</div>
            </van-field>
          </van-cell-group>
        </div>
        <!-- 查看可用商品 -->
        <div
          @click="viewProduct"
          class="more-commodity public-section">
          <p class="title">
            查看可用商品
            <img class="more-icon" src="../assets/image/more-icon.png" alt="">
          </p>
        </div>
        <!-- 邀请码 -->
        <van-cell-group class="invitation-code">
          <van-field type="number" label="邀请码：" v-model="rfrCode" placeholder="填写邀请人手机号，没有可以不填写"/>
        </van-cell-group>
        <!-- 发票 -->
        <div class="invoice">
          <div class="public-section">
            <p class="title">
              发票
              <van-switch active-color="#F80F16" size="20px" v-model="invoiceEnabled"/>
            </p>
          </div>
          <div class="public-section" v-if="invoiceEnabled == true">
            <p class="title has-bd-t" @click="chooseInvoice">
              发票信息
              <span class="invoice-type">
                <span v-if="userInvoice">{{userInvoice.title}}</span>
                <img class="more-icon" src="../assets/image/more-icon.png" alt="">
              </span>
            </p>
          </div>
        </div>
        <!-- 详情描述 -->
        <div class="table-view instructions">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left">失效日期</div>
              <div class="right" v-if="cardDetails.termOfType == 1">永久有效</div>
              <div class="right" v-else-if="cardDetails.termOfType == 2">已失效</div>
              <div class="right" v-else>{{cardDetails.expireTime}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="content">
                <div class="title">详情描述</div>
                <div class="des-content" v-html="cardInfo.mobileDetail"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="re-btn" :class="{active: cardDetails.termOfType == 2}" @click="subCard">立即支付</div>
      <!-- 立即支付弹框 -->
       <!-- <van-popup
         class="pay-modal"
         position="bottom"
         v-show="payModal" >
         <template v-if="selectedSkuItem">
           <div class="spend-price"><span>￥</span>{{salePrice >0 ? salePrice : selectedSkuItem.skuFeatures[0].featureName}}</div>
           <van-cell-group>
             <van-field label="商品名称" input-align="right" :readonly="true" v-model="selectedSkuItem.showTitle"/>
             <van-field label="支付方式" v-if="payStyle.text" input-align="right" :readonly="true" v-model="payStyle.text + '支付'"/>
             <van-radio-group v-model="radio">
               <van-cell-group>
                 <van-cell v-for="(item, index) in selectedPayWay" :key="index" clickable
                           @click="changeStyle(item, index)">
                   <div slot="title" class="pay-label">
                     <img class="pay-icon" v-if="item.payMode == '210'" src="../../../../static/image/mall2/weixin.png"
                          alt="">
                     <img class="pay-icon" v-else src="../../../../static/image/mall2/zhifubao.png" alt="">
                     {{item.text}}支付
                   </div>
                   <van-radio @click="changeStyle(item, index)" :name="index" checked-color="#F80F16"/>
                 </van-cell>
               </van-cell-group>
             </van-radio-group>
           </van-cell-group>
         </template>
         <div class="pay-confirm" @click="payment">立即支付</div>
         <img @click="payModal = false" class="close-btn" src="../../../../static/image/coupon/close-btn.png" alt="">
       </van-popup> -->
      <van-popup
        v-model="show"
        class="pay-modal"
        position="bottom"
      >
      <template v-if="show">
        <div class="spend-price" v-if="show"><span>￥</span>{{salePrice >0 ? salePrice : selectedSkuItem.skuFeatures[0].featureName}}</div>
        <van-cell-group v-if="show">
          <van-field label="商品名称" input-align="right" :readonly="true" v-model="selectedSkuItem.showTitle"/>
          <van-field label="支付方式" v-if="payStyle.text" input-align="right" :readonly="true" v-model="payStyle.text"/>
          <van-radio-group v-model="radio">
            <van-cell-group>
              <van-cell v-for="(item, index) in selectedPayWay" :key="index" clickable
                        @click="changeStyle(item, index)">
                <div slot="title" class="pay-label">
                  <img class="pay-icon" v-if="item.payMode == '210'" src="../../../../static/image/mall2/weixin.png"
                       alt="">
                  <img class="pay-icon" v-else src="../../../../static/image/mall2/zhifubao.png" alt="">
                  {{item.text}}
                </div>
                <van-radio @click="changeStyle(item, index)" :name="index" checked-color="#F80F16"/>
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </van-cell-group>
      </template>
      <div class="pay-confirm" @click="payment">立即支付</div>
      <img @click="payModal = false" class="close-btn" src="../../../../static/image/coupon/close-btn.png" alt="">
      </van-popup>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Toast} from 'vant'
  import RechargeGrid from '../components/recharge-grid'
  import PublicSubmit from '../components/public-submit.vue'
  import payHelper from '@/utils/payHelper'
  import {mapGetters} from 'vuex'

  export default {
    name: '',
    data() {
      return {
        getResultTimes: 0,
        hasToPay: false,
        isInvoice: true, // 是否开票
        show:false,
        payModal: false,
        skuList: [], // sku列表
        selectedSkuItem: {}, // 选中的sku信息
        otherSkuInfo: null, // 其它价格sku信息
        otherChargePrice: '', // 其它充值金额
        invoiceEnabled: false, // 选择是否填写发票
        rfrCode: '', // 推荐码
        selectedPayWay: [], // 支付方式
        payStyle: null, // 支付方式
        radio: '',
        submitInfo: '', // 下单成功的信息 为支付使用
        cardInfo: '', // 卡信息
        selectSkuInfo: '', // 所选sku信息
        easyCardModel: '', // 所选sku信息
        cardDetails: '' // 列表卡的item详情
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == '/recharge/my-card') {
        this.$keepaliveHelper.deleteCache(this)
      }
      next();
    },
    activated() {
      //从后台进前台的协议
      this.$bridgefunc.enterForegroundCallBack(() => {
        if (this.hasToPay) {
          this.hasToPay = false;
          this.getResultTimes = 0;
          this.checkPayResult();
        }
      });
    },
    mounted() {
      this.cardDetails = JSON.parse(this.$route.query.cardDetails)
      console.log(this.cardDetails)
      this.myCardBagDetail() // 卡包详情
    },
    computed: {
      checkPayResult: function() {
          this.$Loading.open();
          let url = "/app/json/app_shopping_order/queryPayState";
          let paramsData = {
              token: this.$store.state.login.token,
              tradeNo: this.submitInfo.tradeNo,
          };
          this.$http.post(url, paramsData).then(
              res => {
                  this.$Loading.close();
                  let data = res.data;
                  if (data.status == 0) {
                      // 0 待支付  1支付成功  2其他(支付失败、支付取消等)
                      if (data.data.state == 1) {
                          this.enterSuccess()
                      } else {
                          this.getResultTimes++;
                          if (this.getResultTimes > 6) {
                              return;
                          }
                          setTimeout(() => {
                              this.checkPayResult();
                          }, 500)
                      }
                  }
              },
              error => {
                  this.$Loading.close();
              }
          );
      },
      placeholder() {
        let str = `请输入充值金额`
        if (this.otherSkuInfo.saleNumBegin && this.otherSkuInfo.saleNumMax) {
          str = `单次只能充值${this.otherSkuInfo.saleNumBegin}-${this.otherSkuInfo.saleNumMax}元`
        }
        if (this.otherSkuInfo.saleNumBegin) {
          str = `单次最小充值${this.otherSkuInfo.saleNumBegin}`
        } else if (this.otherSkuInfo.saleNumMax) {
          str = `单次最小充值${this.otherSkuInfo.saleNumMax}`
        }
        return str
      },
      salePrice() {
        console.log(this.otherSkuInfo,"this.otherSkuInf")
        console.log(this.otherChargePrice,"this.otherSkuInf")
        console.log(this.otherSkuInfo,"this.otherSkuInf")
        if (this.otherSkuInfo) {
          return Math.round((+this.otherChargePrice * this.otherSkuInfo.salePrice) * 100) / 100
        } else {
          return 0
        }
      },
      ...mapGetters(['userInvoice'])
    },
    methods: {
      myCardBagDetail() {
        // 卡包详情
        let paramsData = {
          token: this.$store.state.login.token,
          id: this.cardDetails.id
        }
        this.$request.post('/app/json/app_user_easy_card/myCardBagDetail', paramsData).then(res => {
          if (res.status == 0) {
            this.skuList = res.data.list
            this.cardInfo = res.data.spuModels[0]
            this.easyCardModel = res.data.easyCardModel
            this.formatCardInfo()
          } else {
            this.$Toast(res.info)
          }
        })
      },
      // 选中充值面额
      chooseChargeCard(item) {
        console.log(item)
        this.selectedSkuItem = item
        this.otherChargePrice = ''
        console.log(item)
      },
      // 选择发票
      chooseInvoice() {
        this.$router.push(`/taitouList?fromPage=recharge`)
      },
      inputOtherChargePrice() {
        // 输入其他金额
        this.otherChargePrice = /^[1-9]\d*$/.exec(this.otherChargePrice) ? /^[1-9]\d*$/.exec(this.otherChargePrice)[0] : ''
        this.$refs.mychild.changeItemActive() // 将选中sku样式去掉
      },
      // 选择支付方式
      changeStyle(item, index) {
        this.radio = index
        this.payStyle = item
      },
      setPayWays() {
        this.selectedPayWay = []
        payHelper.getPayWays('200001', this.selectedSkuItem.receivablesOuCode).then(res => {

          this.selectedPayWay = res || []
          if (this.selectedPayWay.length > 0) {
            this.radio = 0
            this.payStyle = this.selectedPayWay[0]
          }
          this.show=true
          this.payModal = true
        })
      },
      subCard() {
        // 立即充值
        if (!this.selectedSkuItem.skuFeatures && !this.otherChargePrice) {
          this.$Toast('请选择充值金额')
        } else if (this.invoiceEnabled && !this.userInvoice) {
          this.$Toast('请选择发票')
        } else {
          this.setPayWays() // 获取支付方式
        }
      },
      // 提交订单
      payment() {
        if (this.cardDetails.termOfType != 2) {
          if (this.radio !== '') {
            this.$Loading.open()
            let paramsData = {
              token: this.$store.state.login.token,
              deliveryType: '2',
              carts: [{
                skuId: this.selectedSkuItem.skuId,
                storeOuCode: this.selectedSkuItem.storeOuCode,
                number: this.selectedSkuItem.number ? this.selectedSkuItem.number : (this.otherChargePrice || 1) // 兼容 otherChargePrice，bug 30540，没有细读逻辑
              }]
            }
            if (this.rfrCode) {
              paramsData.rfrCode = this.rfrCode
            }
            if (this.invoiceEnabled && this.userInvoice) {
              paramsData.userInvoice = {
                invoiceUse: 1,
                invoiceType: this.userInvoice.type,
                invoiceTitleType: this.userInvoice.titleType,
                invoiceTitle: this.userInvoice.title,
                invoiceUserName: this.userInvoice.userName,
                invoiceUserEmail: this.userInvoice.userEmail,
                invoiceUserMobile: this.userInvoice.userPhone,
                invoiceUserOrgTaxNo: this.userInvoice.orgTaxNo,
                invoiceDetailType: 0
              }
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
        }
      },
      // 支付订单
      pay() {
        if (this.payStyle == null) {
          this.$Toast("请选择支付方式！")
          return;
        }
        this.show = false
        this.hasToPay = true
        payHelper.payEvent(this.payStyle, this.submitInfo.orderType, this.submitInfo.orderId).then(() => {
          this.enterSuccess();

        }).catch(() => {
          this.hasToPay = false
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
          path: '/recharge/recharge-result',
          query: {
            orderType: this.submitInfo.orderType,
            shoppingOrderId: this.submitInfo.shoppingOrderId
          }
        })
      },
      otherChargePriceInput() {
        if (this.otherSkuInfo.saleNumBegin && this.otherChargePrice < this.otherSkuInfo.saleNumBegin) {
          this.otherChargePrice = this.otherSkuInfo.saleNumBegin
          this.$Toast(`最小充值金额${this.otherSkuInfo.saleNumBegin}`)
        } else if (this.otherSkuInfo.saleNumMax && this.otherChargePrice > this.otherSkuInfo.saleNumMax) {
          this.otherChargePrice = this.otherSkuInfo.saleNumMax
          this.$Toast(`最大充值金额${this.otherSkuInfo.saleNumMax}`)
        } else if (this.otherSkuInfo.saleNumStep) {
          let modulo = (this.otherChargePrice - this.otherSkuInfo.saleNumBegin) % this.otherSkuInfo.saleNumStep
          let remainder = Math.round((this.otherChargePrice - this.otherSkuInfo.saleNumBegin) / this.otherSkuInfo.saleNumStep)
          if (modulo != 0) {
            this.otherChargePrice = this.otherSkuInfo.saleNumBegin + this.otherSkuInfo.saleNumStep * remainder
            if (this.otherChargePrice < this.otherSkuInfo.saleNumBegin) {
              this.otherChargePrice = this.otherSkuInfo.saleNumBegin
            } else if (this.otherSkuInfo.saleNumMax && this.otherChargePrice > this.otherSkuInfo.saleNumMax) {
              this.otherChargePrice = this.otherSkuInfo.saleNumMax
            }
          }
        }
        // bug-30092 直接输入其他金额时没有带出收单机构
        this.formatCardInfo()
      },
      // 查看可用商品
      viewProduct() {
        let path = '/mall2/list/' + this.$util.getDataString()
        this.$router.push({
          path: path,
          query: {
            lastPath: this.$route.path,
            easyCardId: this.cardDetails.cardId
          }
        })
      },
      formatCardInfo() {
        console.log( this.skuList)
        this.skuList.forEach(item => {
          if (item.activityPrice === 1) {
            this.otherSkuInfo = item
            this.selectedSkuItem = item
          }
        })
        console.log( this.otherSkuInfo,"otherSkuInfo")
      },
      backEvent() {
        this.$router.go(-1)
        this.$keepaliveHelper.deleteCache(this)
      },
      openMyCard() {
        // 打开我的卡包
        this.$router.push({path: '/recharge/my-card'})
      },
      openRechargeDetails() {
        // 打开交易明细页面
        this.$router.push({path: '/recharge/transaction-details', query: {source: 'yj', easyCardModel: this.easyCardModel.cardNo, id: this.cardDetails.id}})
      }
    },
    components: {
      Toast,
      PublicSubmit,
      RechargeGrid
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl'
  @import '~@/common/stylus/mixin.styl'
  $color-theme-b = #1C8FF1
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

  .top-title {
    position relative
    z-index 2
    background-color #fff
    padding 15px
    .card-content {
      width 100%
      height 130px
      overflow hidden
      border-radius 10px
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

    // bdr-t()

    .card-name {
      font-size 18px
      padding 10px 0
    }

    .ad-content {
      font-size 13px
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

  .charge-section {
    .chose-list {
      display flex
      flex-wrap wrap
      justify-content space-between
      text-align center

      .item {
        width 110px
        padding 15px 0
        border 1px solid $color-theme-b
        border-radius 5px
        color $color-theme-b
        position relative
        overflow hidden
        margin-bottom 15px

        .price {
          font-size 17px
        }

        .sell-price {
          font-size 13px
          margin-top 5px
        }

        &.disable {
          color #ccc
          border-color #ccc
        }

        &.active::before {
          content ''
          position absolute
          right -17px
          bottom -17px
          border 15px solid transparent
          border-left-color $color-theme-b
          transform rotate(45deg)
        }
      }
    }

    .enter-price {
      padding 15px 0

      /deep/ &::after {
        display none
      }

      .van-cell {
        padding 0
        align-items center

        /deep/ .van-field__label {
          max-width 100px
        }

        /deep/ .van-field__control {
          background-color #F6F6F6
          font-size 12px
          padding 5px 10px
          border-radius 20px
        }

        .tip {
          color $color-theme-r
        }
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
      background-color $color-theme-r
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
  /deep/ .van-cell {
    display flex
    justify-content space-between
    align-items center
  }
  /deep/ .van-radio {
    display inline-block
  }
  .instructions {
    padding: 11px 5px
    background #fff
    margin-top: 10px

    .left {
      font-size: 14px
    }

    .right {
      color: $color-text-d
    }
    .content {
      .title {
        padding-bottom: 10px
      }
      .des-content {
        line-height 20px
        color: $color-text-d
      }
    }
  }
  .re-btn {
    text-align center
    background: $color-theme-r
    color: #fff
    font-size: 16px
    position fixed
    bottom: 0
    left: 0
    right: 0
    z-index 10;
    height 44px;
    line-height:44px;
  }
  .active {
    background #f7b0b2
  }
</style>
