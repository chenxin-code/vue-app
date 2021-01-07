<template>
  <div>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="block-content prod-info">
        <img
          :src="$route.params.phMainUrl"
          alt
          class="prod-img"/>
        <div class="right">
          <p class="name">{{ $route.params.skuName }}</p>
          <div class="price">
            <span class="current-price">¥{{ dealWithPrice($route.params.salePrice)[2] }}</span>
            <!-- <van-stepper
              v-model="purchaseNum"
              :min="1"
              integer
              class="reset-setpper"
              :max="999"/> -->
            <span class="buy-num">x{{ $route.params.settleCartData.carts[0].number }}</span>
          </div>
        </div>
      </div>
      <div class="block-content chose-coupon" @click="couponEvent">
        <div class="label">优惠券</div>
        <div
          class="right-info">
          <p class="amount">优惠{{ $util.toDecimal2(occurData.couponAmount) }}元</p>
          <i class="iconfont mall-gengduo more-icon"></i>
        </div>
      </div>
      <div class="block-content referrer-container">
        <van-field
          clearable
          v-model="rfrCode"
          label="推荐人"
          placeholder="请输入推荐人编码">
          <van-icon slot="right-icon" name="scan" class="rfr-scan-btn" @click="rfrCodeScanHandler"/>
        </van-field>
      </div>
      <div class="bottom-btn">
        <div class="left-price">
          应付金额：<span class="num">￥{{ newPrice !== undefined ? newPrice : dealWithPrice($route.params.occurData.payAmount)[2] }}</span>
        </div>
        <div class="chum-public-btn submit-btn">
          <van-button
            round
            block
            type="info"
            color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
            @click="submitOrder">提交订单
          </van-button>
        </div>
      </div>
    </nav-content>
    <van-popup
      position="bottom"
      closeable
      class="buy-modal"
      v-model="isShowBuyModal">
      <p class="title">确认付款</p>
      <p class="price-c">￥<span class="num">{{ newPrice !== undefined ? newPrice : dealWithPrice($route.params.occurData.payAmount)[2] }}</span></p>
      <p class="pay-type-title">支付方式</p>
      <div class="pay-type-container">
        <ul class="pay-type-c">
          <li
            class="item"
            v-for="(item, index) in payWayList"
            :key="index"
            @click="chosePayType(item)">
            <div class="left-c">
              <img class="icon" :src="item.icon" alt="">
              <span class="pay-name">{{ item.text }}</span>
            </div>
            <div class="right-c">
              <img src="../../assets/images/icon-select.png" alt="" class="icon-select"
                   v-if="item.payModeSub == selectedPayWay.payModeSub">
              <img src="../../assets/images/icon-unselected.png" alt="" class="icon-select" v-else>
            </div>
          </li>
        </ul>
      </div>
      <div class="chum-public-btn">
        <van-button
          round
          block
          type="info"
          color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
          @click="confirmBuyNow">立即支付
        </van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
  import payHelper from "@/utils/payHelper";
  import utils from '../../assets/utils/tools'
  import Coupon from './coupon'

  export default {
    mixins: [utils],
    data() {
      return {
        purchaseNum: this.$route.params.settleCartData.carts[0].number,
        isShowBuyModal: false,
        selectedPayWay: {},
        payWayList: [],
        submitData: {},
        rfrCode: '',
        scanCode: '',
        entryType: 0,

        occurData: {},
        usedCoupons: [],
        newPrice: undefined,
      };
    },
    mounted() {
      // 3 权益卡购买
      this.occurData = this.$route.params.occurData || {}
      this.paramsData = this.$route.params.settleCartData || {}
      if (this.$route.params.entryType) {
        this.entryType = this.$route.params.entryType;
      }
      this.initData()
    },
    methods: {
      // 获取字符串中参数方法
      getParamsInStr(targetStr, paramsStr) {
        let resultObj = {}
        if (targetStr.indexOf('?') > -1) {
          let tempParamsArr = targetStr.split('?')[1].split('&')
          if (tempParamsArr instanceof Array && tempParamsArr.length > 0) {
            tempParamsArr.forEach(item => {
              resultObj[item.split('=')[0]] = item.split('=')[1]
            })
          }
        }
        return resultObj[paramsStr]
      },
      // 立即支付
      confirmBuyNow() {
        payHelper.payEvent(this.selectedPayWay, this.submitData.orderType, this.submitData.orderId, `/mall2/paysuccess?entryType=${this.entryType}&orderType=${this.submitData.orderType}&orderId=${this.submitData.orderId}`).then(() => {
        }).catch(() => {
          this.$Toast('cancel')
        })
      },
      // 推荐人扫码
      rfrCodeScanHandler() {
        this.$bridgefunc.scanCode(dic => {
          if (String(dic.code).indexOf('http') !== -1) {
            this.scanCode = this.getParamsInStr(dic.code, 'qrCode')
            this.rfrCode = this.getParamsInStr(dic.code, 'qrCode')
          } else {
            this.scanCode = dic.code;
            this.rfrCode = dic.code;
          }
        });
      },
      // 提交订单
      submitOrder() {
        if (this.submitData.orderType && this.submitData.orderId) {
          this.confirmBuyNow()
        } else {
          this.$STLoading.open();
          let requestParams = {
            ...this.$route.params.settleCartData,
            virtualUserPhone: this.$store.state.login.phone,
            deliveryType: 2,
            payDigital: [],
            userInvoice: {},
            orderScene: this.$util.orderScene(),
          }

          // 电子券
          requestParams.couNo = []
          if (this.usedCoupons.length > 0) {
            for (let i = 0; i < this.usedCoupons.length; i++) {
              requestParams.couNo.push(this.usedCoupons[i].couNo)
            }
          } else {
            requestParams.couNo = []
          }

          // 推荐人
          if (this.rfrCode && this.rfrCode.length) {
            requestParams.rfrCode = this.rfrCode;
            // 1 手动输入  2扫一扫
            if (this.rfrCode == this.scanCode) {
              requestParams.rfrCodeType = 2;
            } else {
              requestParams.rfrCodeType = 1;
            }
          }
          this.$http.post('/app/json/app_shopping_order/submit', requestParams).then(res => {
            let data = res.data;
            if (data.status == 0) {
              this.submitData = data.data;
              if (this.submitData.payAmount === 0) {
                this.$router.push({
                  path: '/mall2/paysuccess',
                  query: {
                    entryType: this.entryType,
                    orderType: this.submitData.orderType,
                    orderId: this.submitData.orderId
                  }
                })
              } else {
                this.getPayModal(data.data.orderType)
              }
            } else {
              this.$Toast(data.info);
            }
            this.$STLoading.close();
          }).catch(err => {
            this.$Toast(`submit err ${err}`);
            this.$STLoading.close();
          })
        }
      },
      // 查询支付方式
      getPayModal(orderType) {
        payHelper.getPayWays(200001, this.$route.params.occurData.ouCode).then(res => {
          if (res && (res instanceof Array) && (res.length > 0)) {
            this.payWayList = res;
            this.selectedPayWay = this.payWayList[0];
            this.isShowBuyModal = true;
          } else {
            this.$Toast('暂无支付方式');
          }
        });
      },
      // 选择支付方式
      chosePayType(payData) {
        this.selectedPayWay = payData;
      },
      // 选择电子券
      couponEvent() {
        let canCoupons = []
        for (let i = 0; i < this.occurData.userCanUseCoupon.length; i++) {
          let couNo1 = this.occurData.userCanUseCoupon[i].couNo
          this.occurData.userCanUseCoupon[i].selected = false
          for (let j = 0; j < this.usedCoupons.length; j++) {
            let couNo2 = this.usedCoupons[j].couNo;
            if (couNo2 == couNo1) {
              this.occurData.userCanUseCoupon[i].selected = true
              break;
            }
          }
          canCoupons.push(this.occurData.userCanUseCoupon[i])
        }
        Coupon.open({
          initData: {
            listData: [],
            userCanNotUseCoupon: this.occurData.userCanNotUseCoupon,
            userCanUseCoupon: canCoupons,
            userCanUseWhenNotSelectCoupon: this.occurData.userCanUseWhenNotSelectCoupon,
            type: "use",
            skuId: "",
            categoryId: "",
            storeOuCode: "",
            token: this.$store.state.login.token,
            payAmount: this.$util.toDecimal2(
              parseFloat(this.occurData.payAmount) +
              parseFloat(this.occurData.couponAmount)
            )
          },
          selectedCoupon: couponArr => {
            this.usedCoupons = couponArr
            this._reSettleCart(null)
          }
        })
      },
      reloadSelectedCoupon() {
        let couNo = this.occurData.couNo
        this.usedCoupons = []
        if (couNo.length > 0) {
          for (let i = 0; i < couNo.length; i++) {
            this.usedCoupons.push({
              couNo: couNo[i]
            });
          }
        }
        let canCoupons = []
        for (let i = 0; i < this.occurData.userCanUseCoupon.length; i++) {
          let couNo1 = this.occurData.userCanUseCoupon[i].couNo;
          this.occurData.userCanUseCoupon[i].selected = false;
          for (let j = 0; j < this.usedCoupons.length; j++) {
            let couNo2 = this.usedCoupons[j].couNo;
            if (couNo2 == couNo1) {
              this.occurData.userCanUseCoupon[i].selected = true;
              break;
            }
          }
          canCoupons.push(this.occurData.userCanUseCoupon[i])
        }

        Coupon.reloadSelectedCoupon(canCoupons, [], this.occurData.userCanUseWhenNotSelectCoupon)
      },
      _reSettleCart(carts, cardNo) {
        this.$Loading.open();
        let url = '/app/json/app_cart/SettleCart'
        let paramsData = this.paramsData
        paramsData.couNo = []
        if (this.usedCoupons.length > 0) {
          for (let i = 0; i < this.usedCoupons.length; i++) {
            paramsData.couNo.push(this.usedCoupons[i].couNo)
          }
        } else {
          paramsData.couNo.push("-1")
        }
        paramsData.limitWalletCardNo = cardNo

        if (this.paramsData.deliveryType == 2) {
          if (this.$store.state.mall2.selectAddress.id != "") {
            paramsData.userAddressId = this.$store.state.mall2.selectAddress.id
          }
        } else {
          paramsData.pickupId = this.$store.state.mall2.zitiAddress.id
        }

        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data
            if (data.status == 0) {
              this.occurData = data.data.occur[0]
              this.paramsData = paramsData
              this.newPrice = this.occurData.payAmount
              this.initData()
            } else {
              this.$Toast(data.info)
            }
          },
          error => {
            this.$Loading.close()
            this.$Toast(`SettleCart err ${err}`)
          }
        )
      },
      initData() {
        let couNo = this.occurData.couNo
        this.usedCoupons = []
        if (couNo && couNo.length > 0) {
          for (let i = 0; i < couNo.length; i++) {
            this.usedCoupons.push({
              couNo: couNo[i]
            })
          }
        }

        this.reloadSelectedCoupon()
      },
    }
  };
</script>
<style lang="stylus" scoped>
  @import '~@/deploy/chum/assets/stylus/chum-public.styl';
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';

  .reset-setpper {
    display flex;
    align-items center;

    /deep/ .van-stepper__minus,
    /deep/ .van-stepper__plus {
      font-size 15px;
      background-color: #FFF;
      border 1px solid #ddd;
      width 33px;
    }

    /deep/ .van-stepper__input {
      margin 0;
      border-top 1px solid #ddd;
      border-bottom 1px solid #ddd;
      background-color: #FFF;
    }
  }

  .block-content {
    margin 10px 20px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    padding 15px 10px;
    border-radius 5px;
  }

  .prod-info {
    display: flex;
    // max-height 85px;

    .prod-img {
      display: block;
      width: 80px;
      max-height: 80px;
      border-radius: 5px;
    }

    .right {
      flex: 1;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .name {
        font-weight: 500;
        font-size: 15px;
        line-height: 18px;
        ellipse-2();
      }

      .price {
        margin-top 15px;
        display flex;
        justify-content space-between
        align-items center;

        .current-price {
          font-size: 16px;
          font-weight: 500;
          color: $color-theme-r;
        }

        .buy-num {
          font-size 13px;
        }
      }
    }
  }

  .chose-coupon {
    display flex;
    justify-content space-between;
    .label {
      font-size 14px;
    }
    .right-info {
      display flex;
      align-items center;
      .amount {
        font-size 14px;
        padding-right 15px;
      }
      .iconfont {
        color #999;
      }
    }
  }

  .referrer-container {
    .van-cell {
      padding 0;
    }
    .rfr-scan-btn {
      font-size 24px;
    }
  }

  .bottom-btn {
    position absolute
    left 0
    right 0
    bottom 0
    height 60px;
    line-height 60px;
    padding 0 20px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    display flex;
    justify-content space-between
    align-content center;

    .left-price {
      font-size 15px;
      font-weight 600;

      .num {
        font-weight 700;
        color $color-theme-r;
      }
    }

    .submit-btn {
      display flex;
      align-items center;

      .van-button {
        height 40px;
        line-height 40px;

        .van-button__text {
          font-size 15px;
        }
      }
    }
  }

  .buy-modal {
    padding 18px 20px 10px;

    .title {
      font-size 16px;
      font-weight 600;
      text-align center;
    }

    .price-c {
      text-align center;
      margin-top 30px;
      font-size 15px;
      font-weight 700;

      .num {
        font-size 25px;
        font-weight 700;
      }
    }

    .pay-type-title {
      font-size 15px;
      font-weight 600;
      padding 10px 0;
      bdr-b();
    }

    .pay-type-container {
      min-height 150px;

      .pay-type-c {
        .item {
          display flex;
          justify-content space-between;
          align-items center;
          margin-top 10px;

          .left-c {
            display flex;
            align-items center;

            .icon {
              display block;
              width 25px;
              height 25px;
            }

            .pay-name {
              font-size 15px;
              font-weight 400;
              padding-left 5px;
            }
          }

          .right-c {
            .icon-select {
              display block;
              width 20px;
              height 20px;
            }
          }
        }
      }
    }
  }
</style>
