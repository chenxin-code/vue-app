/**Created by liaoyingchao on 2019-05-13.*/

<template>
  <div class="place-order mall2">
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content v-if="lastRes">
      <div class="scroll-div">
        <div class="block-div">
          <div class="flex-row" @click="payWayShow">
            <div class="label-middle theme_font_common">支付方式</div>
            <div class="full"></div>
            <div class="theme_font_common right-margin">{{selectedPayWay.text}}</div>
            <div>
              <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
            </div>
          </div>
        </div>
        <div class="block-div">
          <div class="flex-row">
            <div class="title full theme_font_common">发票</div>
            <div class="swith" @click="useInvoiceEvent">
              <img v-if="useInvoice" src="static/image/mall2/switch-on.png">
              <img v-if="!useInvoice" src="static/image/mall2/switch-off.png">
            </div>
          </div>
          <div class="flex-row" v-if="useInvoice" @click="changeInvoice">
            <div class="label-middle theme_font_common">发票信息</div>
            <div class="full"></div>
            <div class="theme_font_black right-margin" :class="{theme_font_tint: invoiceInfo == ''}">{{invoiceInfo !=
              '' ? invoiceInfo : '请编辑发票信息'}}
            </div>
            <div>
              <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
            </div>
          </div>
        </div>
        <div class="block-div">
          <div class="flex-row" @click="couponEvent">
            <div class="label-middle theme_font_common">优惠券</div>
            <div class="full"></div>
            <div class="theme_font_black right-margin">优惠{{$util.toDecimal2(occurData.couponAmount)}}元</div>
            <div>
              <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
            </div>
          </div>
          <!--能使用的各种金额-->
          <div v-for="digital in occurData.digitalList">
            <div class="flex-row" v-if="digital.deductionState != 0">
              <div class="label-middle theme_font_common">{{getDigitalDisplayName(digital.acctType)}}</div>
              <div class="full"></div>
              <div class="right-margin" v-if="digital.userCanUseDigital > 0">
                共{{digital.userBalanceDigital}}，可用{{digital.userCanUseDigital}}，抵￥{{$util.toDecimal2(digital.userCanUseDigitalAmount)}}元
              </div>
              <div class="right-margin" v-if="digital.userCanUseDigital <= 0">
                共{{digital.userBalanceDigital}}，{{getCanNotUseStr(digital.deductionState)}}，不能使用
              </div>
              <div class="swith" @click="useDigitalEvent(digital)">
                <img v-if="digital.payDigital > digital.fixedDigital" src="static/image/mall2/switch-on.png">
                <img v-if="digital.payDigital <= digital.fixedDigital" src="static/image/mall2/switch-off.png">
              </div>
            </div>
          </div>
        </div>
        <div class="block-div">
          <div class="flex-row">
            <div class="label-middle full theme_font_common">商品金额</div>
            <div class="theme_font_black">￥{{$util.toDecimal2(occurData.amount)}}</div>
          </div>
          <div class="flex-row">
            <div class="label-middle full theme_font_common">立减</div>
            <div class="theme_font_red">-￥{{$util.toDecimal2(occurData.discountAmount)}}</div>
          </div>
          <div class="flex-row">
            <div class="label-middle full theme_font_common">优惠券</div>
            <div class="theme_font_red">-￥{{$util.toDecimal2(occurData.couponAmount)}}</div>
          </div>
          <div class="flex-row" v-for="digital in occurData.digitalList"
               v-if="digital.payDigital > digital.fixedDigital">
            <div class="label-middle full theme_font_common">{{getDigitalDisplayName(digital.acctType)}}</div>
            <div class="theme_font_red">-￥{{$util.toDecimal2(digital.userCanUseDigitalAmount)}}</div>
          </div>
        </div>
        <div class="block-div" v-if="recommendDisabled">
          <div class="flex-row">
            <div class="passwords-input">
              <div class="label-middle full theme_font_common">推荐人</div>
              <div class="passwords">
                <input placeholder="请输入推荐码" v-model="referrer" :disabled="!canEditReferrer"/>
              </div>
              <div class="show-passwords" @click="scanCodeFunc" v-show="canEditReferrer">
                <img src="static/image/setting/icon-scan.png" class="scancode"/>
              </div>
            </div>
          </div>
        </div>
        <div class="block-div">
          <div class="flex-row">
            <div class="name">{{occurData.store[0].storeName}}</div>
          </div>
          <van-swipe-cell :right-width="80" :on-close="deleteEvent(item)"
                          v-for="(item, idx) in occurData.store[0].noActivityCart" :key="idx">
            <div class="pro-row">
              <div class="img-div">
                <img :src="item.phPictureUrl">
              </div>
              <div class="info-div">
                <div class="title single-line">{{item.productName}}</div>
                <div class="price-number">
                  <PriceOrder :productData="item"></PriceOrder>
                  <!--<Counter v-model="item.number" :minValue="item.saleNumBegin" :maxValue="item.saleNumMax"-->
                           <!--:stepNum="item.saleNumStep" @numChange="numChange(item)"></Counter>-->
                  <van-stepper v-model="item.number" :min="item.saleNumBegin" :max="item.saleNumMax" :step="item.saleNumStep" @change="numChange(item)" integer/>
                </div>
              </div>
            </div>
            <div class="delete-btn" slot="right">删除</div>
          </van-swipe-cell>
          <div class="buy-more theme_font_gray" @click="buyMoreEvent">继续购买商品</div>
        </div>
        <!--<van-swipe-cell :right-width="80">-->
        <!--<van-cell title="单元格" value="内容" />-->
        <!--<span slot="right">删除</span>-->
        <!--</van-swipe-cell>-->
      </div>
      <div class="place-bottom-div">
        <div class="rmb-div">
          <span class="theme_font_red">￥</span>
          <span class="price-big theme_font_red">{{getTotalPriceDuan(0)}}</span>
          <span class="theme_font_red">.{{getTotalPriceDuan(1)}}</span>
        </div>
        <div class="pay-now theme_font_white theme_bg_red" @click="payNow">立即支付</div>
      </div>
    </nav-content>
    <pop-view v-if="payWayPopShow" @closeEvent="popClose">
      <div class="pop-body">
        <div class="pop-title theme_font_common">请选择支付方式</div>
        <div class="items-div pop-scroll-div">
          <!--<div class="item theme_font_common theme_bg_white_ef"-->
               <!--:class="{theme_bg_light_red_i: payWaySelected == payway.tag, theme_font_red_i: payWaySelected == payway.tag, theme_border_red_i: payWaySelected == payway.tag}"-->
               <!--@click="payWayEvent(payway)" v-for="payway in payWays">{{payway.text}}-->
          <!--</div>-->
          <div class="pay-way" :class="{'line-top': idx != 0}" v-for="(item, idx) in payWays" @click="selectPayWay(item)">
            <div class="icon-div">
              <img :src="item.icon"/>
            </div>
            <div class="full">{{item.text}}</div>
            <div class="selected-mark">
              <i class="iconfont mall-weixuanzhong theme_font_tint" v-if="selectedPayWay.payModeSub != item.payModeSub"></i>
              <i class="iconfont mall-xuanzhong theme_font_red" v-else></i>
            </div>
          </div>
        </div>
      </div>
    </pop-view>
  </div>
</template>

<script>
  import PriceOrder from '@/components/commonui/price/price-order'
  // import Counter from '@/components/commonui/counter/counter'
  import Coupon from '../common/coupon'
  import Invoice from '../common/invoice'
  import payHelper from "../../../utils/payHelper";
  import appLocalstorage from '@zkty-team/x-engine-module-localstorage'

  export default {
    name: "place-order",
    components: {
      PriceOrder,
      // Counter
    },
    data() {
      return {
        useInvoice: false,
        historyPros: [],
        paramsData: {},
        payDigitals: [],
        lastRes: null,
        occurData: {},
        canEditReferrer: true,
        referrer: '',
        payWayPopShow: false,
        payWays: [],
        selectedPayWay: {},
        storeOuCode: '',
        invoiceData: null,
        invoiceInfo: '',
        currentInvoice: null,
        usedCoupons: [],
        payInfo: {},
        pickupId: '',
      }
    },
    computed: {
      recommendDisabled() {
        return (!this.$store.state.globalConfig.recommendDisabled || !Number(this.$store.state.globalConfig.recommendDisabled))
      }
    },
    methods: {
      useDigitalEvent: function (digital) {
        if (digital.userCanUseDigital <= 0) {
          let str = this.getCanNotUseStr(digital.deductionState)
          this.$Toast(
            str +
            "，不支持" +
            this.getDigitalDisplayName(digital.acctType) +
            "支付！"
          );
          return;
        }
        let acctType = digital.acctType;
        if (digital.payDigital <= digital.fixedDigital) {
          let arr = [];
          for (let i = 0; i < this.payDigitals.length; i++) {
            if (this.payDigitals[i].acctType != acctType) {
              arr.push(this.payDigitals[i]);
            }
          }
          this.payDigitals = arr;

          this.payDigitals.push({
            acctType: acctType,
            payDigital: digital.userCanUseDigital + digital.fixedDigital
          });
        } else {
          let arr = [];
          for (let i = 0; i < this.payDigitals.length; i++) {
            if (this.payDigitals[i].acctType != acctType) {
              arr.push(this.payDigitals[i]);
            }
          }
          this.payDigitals = arr;
        }
        this.reSettleCart();
      },
      getCanNotUseStr: function (state) {
        if (state == 1 || state == 3) {
          return "余额不足";
        } else if (state == 1) {
          return "订单金额不够";
        } else {
          return "未知原因";
        }
      },
      payNow: function () {
        this.submitOrder()
      },
      enterSuccess:function () {
        if (this.$store.state.webtype == '2' || this.$store.state.webtype == '3') {
          this.$bridgefunc.setItem('scanbuy_cart_number', '0')
        } else {
          appLocalstorage.set({
            key: 'scanbuy_cart_number',
            value: '0',
            isPublic: true,
          })
        }
        this.$bridgefunc.destroyPreviousController()
        window.localStorage.removeItem('historyPros')
        this.$router.replace({
          path: '/mall2/scanbuypaysuccess',
          query: {
            orderId: this.payInfo.orderId,
            payAmount: this.payInfo.payAmount,
            payWayText: this.selectedPayWay.text,
            tradeNo:this.payInfo.tradeNo
          }
        });
      },
      checkPayResult:function () {
        this.$Loading.open();
        let url = '/app/json/app_shopping_order/detail';
        let paramsData = {
          token: this.$store.state.login.token,
          orderType: this.payInfo.orderType,
          orderId: this.payInfo.orderId,
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0 && data.data.state == 3) {
              this.enterSuccess();
            }
          },
          error => {
            this.$Loading.close();
          }
        )
      },
      payEvent: function () {
        if (this.selectedPayWay == null) {
          this.$Toast("请选择支付方式！")
          return;
        }
        payHelper.payEvent(this.selectedPayWay, this.payInfo.orderType, this.payInfo.orderId).then(() => {
          this.enterSuccess();
        }).catch(() => {
        })
      },
      submitOrder: function () {
        let url = '/app/json/app_shopping_order/submit';
        let paramsData = this.paramsData;

        paramsData.isScanBuy = true

        paramsData.couNo = [];
        if (this.usedCoupons.length > 0) {
          for (let i = 0; i < this.usedCoupons.length; i++) {
            paramsData.couNo.push(this.usedCoupons[i].couNo)
          }
        }
        paramsData.token = this.$store.state.login.token
        // 下单场景
        paramsData.orderScene = this.$util.orderScene()

        //推荐人
        if (this.referrer && this.referrer.length) {
          paramsData['rfrCode'] = this.referrer;
        }
        // 1 手动输入  2扫一扫
        if (this.referrer == this.scanCode) {
          paramsData['rfrCodeType'] = 2;
        } else {
          paramsData['rfrCodeType'] = 1;
        }

        paramsData.userInvoice = {}
        if (this.currentInvoice != null && this.useInvoice == true) {
          paramsData.userInvoice.invoiceUse = '1'
          paramsData.userInvoice.invoiceType = '1'
          if (this.currentInvoice.type == 0) {
            // 个人
            paramsData.userInvoice.invoiceTitleType = '4'
            paramsData.userInvoice.invoiceTitle = '个人'//this.currentInvoice.name
          } else {
            // 公司
            paramsData.userInvoice.invoiceTitleType = '5'
            paramsData.userInvoice.invoiceTitle = this.currentInvoice.company
          }
          paramsData.userInvoice.invoiceUserName = this.currentInvoice.name
          paramsData.userInvoice.invoiceUserEmail = this.currentInvoice.email
          paramsData.userInvoice.invoiceUserMobile = this.currentInvoice.phone
          paramsData.userInvoice.invoiceUserOrgTaxNo = this.currentInvoice.identifyNumber
          // 票内容类型(0: 商品明细, 1:商品类别)
          paramsData.userInvoice.invoiceDetailType = this.currentInvoice.selectedGoodsType
        }
        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.payInfo = data.data
              this.payEvent()
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      backEvent: function () {
        this.$router.go(-1)
      },
      selectPayWay: function (item) {
        this.selectedPayWay = item
        this.payWayPopShow = false
      },
      async getPayWays () {
        this.payWays = await payHelper.getPayWays('200001', this.storeOuCode)
        if (this.payWays.length > 0) {
          this.selectedPayWay = this.payWays[0];
        }
      },
      payWayEvent: function (payway) {

      },
      popClose: function () {
        this.payWayPopShow = false
      },
      buyMoreEvent: function () {
        this.backEvent()
      },
      getTotalPriceDuan: function (index) {
        let str = this.$util.toDecimal2(this.occurData.payAmount)
        let arr = str.split('.')
        return arr[index]
      },
      numChange: function (item) {
        this.historyPros = this.getNewPros(item.skuId, item.number)
        this.reSettleCart()
      },
      getNewPros: function (id, number) {
        let arr = []
        for (let i = 0; i < this.historyPros.length; i++) {
          let item = this.historyPros[i]
          if (id == item.skuId) {
            if (number != 0) {
              item.number = number
              arr.push(item)
            }
          } else {
            arr.push(item)
          }
        }
        return arr
      },
      scanCodeFunc: function () {

      },
      payWayShow: function () {
        this.payWayPopShow = true
      },
      // 获取前面已填写的发票
      useInvoiceEvent: function () {
        this.useInvoice = !this.useInvoice
        if (this.useInvoice && this.invoiceData == null) {
          this.$Loading.open();
          let url = '/app/json/order_invoice/loadTwoTypeDefaultUserInvoiceHead';
          let paramsData = {
            token: this.$store.state.login.token
          };
          this.$http.post(url, paramsData).then(
            res => {
              this.$Loading.close();
              let data = res.data;
              if (data.status == 0) {
                this.invoiceData = data.data
                if (this.invoiceData.current == 'personal') {
                  this.currentInvoice = this.invoiceData.personal
                  this.currentInvoice.name = this.invoiceData.personal.title
                  this.invoiceInfo = this.invoiceData.personal.title
                  this.currentInvoice.type = 0
                } else {
                  this.currentInvoice.type = 1
                  this.currentInvoice = this.invoiceData.company
                  this.currentInvoice.invoiceTitle = this.currentInvoice.company.title
                  this.invoiceInfo = this.invoiceData.company.title
                }
                this.invoiceData.phone = this.$store.state.login.phone
                this.invoiceData.email = this.$store.state.userInfo.email
                this.invoiceData.name = this.$store.state.userInfo.nickName
              } else {
                this.$Toast(data.info);
              }
            },
            error => {
              this.$Loading.close();
              this.$Toast('请求数据失败！')
            }
          );
        }
      },
      changeInvoice: function () {
        Invoice.open({
          initData: {
            ...this.invoiceData,
            token: this.$store.state.login.token
          },
          selectedInvoice: (invoice) => {
            console.log(invoice)
            this.currentInvoice = invoice
            if (invoice.type == 0) {
              // 个人
              this.invoiceInfo = '个人'

              this.invoiceData.personal.title = invoice.name
              this.invoiceData.personal.userPhone = invoice.phone
              this.invoiceData.personal.userEmail = invoice.email
            } else {
              // 公司
              this.invoiceInfo = invoice.company

              this.invoiceData.company.userPhone = invoice.phone
              this.invoiceData.company.userEmail = invoice.email
              this.invoiceData.company.orgTaxNo = invoice.identifyNumber
              this.invoiceData.company.title = invoice.company
            }
            Invoice.close()
          },
          invoiceInformation: () => {
            this.showAgreement = true;
          }
        })
      },
      couponEvent: function () {
        for (let i = 0; i < this.occurData.userCanUseCoupon.length; i++) {
          let couNo1 = this.occurData.userCanUseCoupon[i].couNo
          this.occurData.userCanUseCoupon[i].selected = false
          for (let j = 0; j < this.usedCoupons.length; j++) {
            let couNo2 = this.usedCoupons[j].couNo
            if (couNo2 == couNo1) {
              this.occurData.userCanUseCoupon[i].selected = true
              break
            }
          }
        }
        Coupon.open({
          initData: {
            listData: [],
            userCanNotUseCoupon: this.occurData.userCanNotUseCoupon,
            userCanUseCoupon: this.occurData.userCanUseCoupon,
            type: 'use',
            skuId: '',
            categoryId: '',
            storeOuCode: '',
            token: this.$store.state.login.token,
            payAmount: this.$util.toDecimal2(parseFloat(this.occurData.payAmount) + parseFloat(this.occurData.couponAmount))
          },
          selectedCoupon: (couponArr) => {
            this.usedCoupons = couponArr;
            this.reSettleCart();
            Coupon.close();
          }
        })
      },
      deleteEvent: function (item) {
        return (clickPosition, instance) => {
          switch (clickPosition) {
            case 'left':
            case 'cell':
            case 'outside':
              instance.close();
              break;
            case 'right':
              console.log(item)
              if (this.historyPros.length == 1) {
                this.$Toast('至少需要购买一个商品！')
                instance.close();
                break;
              }
              this.historyPros = this.getNewPros(item.skuId, 0)
              this.reSettleCart()
              instance.close();
              break;
          }
        }
      },
      initData: function () {
        this.pointsGain = this.lastRes.pointsGain
        this.occurData = this.lastRes.occur[0]
        console.log(this.occurData)
        let couNo = this.occurData.couNo
        this.usedCoupons = []
        if (couNo.length > 0) {
          for (let i = 0; i < couNo.length; i++) {
            this.usedCoupons.push({
              couNo: couNo[i]
            })
          }
        }
        this.payDigitals = []
        for (let i = 0; i < this.occurData.digitalList.length; i++) {
          let dItem = this.occurData.digitalList[i]
          if (dItem.payDigital > dItem.fixedDigital) {
            this.payDigitals.push({
              acctType: dItem.acctType,
              payDigital: dItem.userCanUseDigital + dItem.fixedDigital
            })
          } else {
            this.payDigitals.push({
              acctType: dItem.acctType,
              payDigital: dItem.fixedDigital
            })
          }
        }
      },
      getDigitalDisplayName: function (acctType) {
        return this.$mallCommon.accTypeToName(acctType, '200001')
      },
      // 结算
      reSettleCart: function () {
        this.$Loading.open();
        let url = '/app/json/app_cart/SettleCart';
        let paramsData = this.paramsData;
        paramsData.isScanBuy = true
        paramsData.couNo = [];
        paramsData.carts = this.historyPros
        paramsData.deliveryType = '1'
        paramsData.pickupId = this.pickupId

        paramsData.payDigital = this.payDigitals;

        let num = 0
        for (let i = 0; i < this.historyPros.length; i++) {
          let item = this.historyPros[i]
          num += item.number
        }
        if (this.$store.state.webtype == '3'||this.$store.state.webtype == '2') {
          this.$bridgefunc.setItem('scanbuy_cart_number', num)
        } else {
          appLocalstorage.set({
            key: 'scanbuy_cart_number',
            value: num,
            isPublic: true,
          })
        }

        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              window.localStorage.setItem('historyPros', JSON.stringify(this.historyPros))
              this.lastRes = data.data
              this.paramsData = paramsData
              this.initData()
              this.$mallCommon.isExistCanNotAttendActivity(data.data.occur, true);
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
    },
    created() {
      this.storeOuCode = this.$route.query.storeoucode
      this.pickupId = this.$route.query.pickupId
      this.getPayWays()
      let str = window.localStorage.getItem('historyPros')
      if (str && str != undefined && str != '') {
        this.historyPros = JSON.parse(str)
      } else {
        this.historyPros = []
      }
      this.reSettleCart()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .place-order {
    width 100%
    height 100%
    overflow hidden

    .scroll-div {
      position absolute;
      left 0;
      right 0;
      top 0;
      bottom 45px;
      overflow-x hidden
      overflow-y auto;
      -webkit-overflow-scrolling touch;

      .text {
        width 100%;
        word-wrap: break-word;
      }

      .passwords-input {
        width 100%
        display: flex;
        align-items center;
        justify-content: space-between;

        .passwords {
          width: 75%;

          input {
            margin -10px 0;
            height 30px;
            display: block;
            width: 100%;
            font-size: $font-size-medium;
          }

          input:disabled {
            background-color: #fff
          }
        }

        .show-passwords {
          position: relative

          &.show-passwords:before {
            content: ''
            position: absolute
            top: -10px
            left: -10px
            right: -10px
            bottom: -10px
          }

          img {
            display: block;
            // margin-top:4px;
          }

          .scancode {
            width: 20px;
            height: 20px;
          }
        }
      }

      .pro-row {
        padding 10px;
        //bdr-b()
        position: relative
        &.pro-row:after {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          content: '';
          background: #ddd;
          transform: scaleY(0.5);
          -webkit-transform: scaleY(0.5);
          z-index: 1;
        }

        .price-number {
          display flex;
          align-items center;
          justify-content space-between;
        }
      }

      .delete-btn {
        width 80px;
        height 100%;
        background-color #F80F16;
        color white;
        display: flex
        align-items: center
        justify-content: center;
      }
      .buy-more {
        padding 13px;
        text-align center;
        font-size 13px;
      }
    }

    .place-bottom-div {
      position absolute;
      left 0;
      right 0;
      bottom 0;
      display flex;
      align-items center;
      box-shadow 0 -1px 5px #efefef;
      .rmb-div {
        flex 1;
        padding-left 12px;
        font-weight 500;
        .price-big {
          font-size 20px;
          margin-right -4px;
          padding-right 0;
        }
      }
      .pay-now {
        padding 14px 20px;
        font-size 16px;
        font-weight 500;
      }
    }

    .pay-way {
      display flex;
      align-items center;
      padding 10px 5px;
      overflow hidden;
      .icon-div {
        margin-right 10px;
        img {
          width 24px;
          height 24px;
        }
      }
      .selected-mark {
        padding-right 10px;
        i {
          font-size 18px;
        }
      }
    }
  }
</style>
