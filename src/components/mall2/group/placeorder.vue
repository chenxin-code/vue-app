/**Created by liaoyingchao on 2019-07-04.*/

<template>
  <div class="placeorder mall2">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="flex-div">
        <div class="scroll-div">
          <div class="block-div no-padding-bottom"
               v-if="deliveryType == 2">
            <div v-if="$store.state.mall2.selectAddress.id > 0 && deliveryType == 2" @click="toSelectAddress">
              <div class="flex-row">
                <div class="name theme_font_black">{{$store.state.mall2.selectAddress.receiverName}}</div>
                <div class="name theme_font_black">{{$store.state.mall2.selectAddress.mobile}}</div>
                <div class="act-item-full theme_standard_bg theme_font_white"
                     v-if="$store.state.mall2.selectAddress.isDefault == 1">默认
                </div>
              </div>
              <div class="flex-row">
                <div class="full theme_font_tint font-small">{{$store.state.mall2.selectAddress.addressFull}}</div>
                <div>
                  <i class="iconfont mall-gengduojiantou theme_font_tint icon-font"></i>
                </div>
              </div>
            </div>
            <div v-if="(!($store.state.mall2.selectAddress.id > 0)) && deliveryType == 2" @click="toSelectAddress">
              <div class="flex-row">
                请选择地址信息
              </div>
            </div>
            <div v-if="$store.state.mall2.zitiAddress.id > 0 && deliveryType == 1" @click="toSelectZitiAddress">
              <div class="pickup-shop">
                <div style="flex: 1;">
                  <div class="flex-row">
                    <div class="name theme_font_black">自提店铺：{{$store.state.mall2.zitiAddress.storeName}}</div>
                  </div>
                  <div class="flex-row">
                    <div class="full theme_font_tint font-small" style="line-height: 1.4;">
                      {{$store.state.mall2.zitiAddress.addressFull}} {{$store.state.mall2.zitiAddress.phone &&
                      $store.state.mall2.zitiAddress.phone != '' ? '('+$store.state.mall2.zitiAddress.phone+')' : ''}}
                    </div>
                  </div>
                </div>
                <div>
                  <i class="iconfont mall-gengduojiantou theme_font_tint icon-font"></i>
                </div>
              </div>
            </div>
            <div class="colorfulline">
              <img src="static/image/mall2/colorfulline.png"/>
            </div>
          </div>

          <div class="block-div" v-if="deliveryType == 1">
            <div class="flex-row">
              <div class="title theme_font_black">提货人信息</div>
            </div>
            <div class="flex-row flex-row-smallbottom">
              <div class="label-middle theme_font_common">姓名</div>
              <div class="full">
                <input class="row-input" placeholder="请输入提货人姓名" v-model="$store.state.mall2.pickUpUser"/>
              </div>
            </div>
            <div class="flex-row">
              <div class="label-middle theme_font_common">联系方式</div>
              <div class="full">
                <input class="row-input" placeholder="请输入提货人联系方式" v-model="pickupPhone"/>
              </div>
            </div>
            <div class="flex-row" @click="openPicker">
              <div class="label-middle theme_font_common">自提时间</div>
              <div class="full theme_font_common" :class="{theme_font_tint_i: pickupTime == ''}"
                   style="text-align: right;">{{pickerConfirm(pickupTime)}}
              </div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </div>
            </div>
          </div>

          <!--虚拟商品-->
          <!--<div class="block-div" v-if="occurData.needVirtualUserPhone == '1'">-->
            <!--<div class="flex-row">-->
              <!--<div class="right-margin theme_font_common">接收短信的手机号</div>-->
              <!--<div class="theme_font_common">{{$store.state.login.phone}}</div>-->
            <!--</div>-->
            <!--<div class="flex-row theme_font_tint">-->
              <!--<div class="font-small">购买成功后相关短信会自动发送到您手机上</div>-->
            <!--</div>-->
          <!--</div>-->

          <div class="block-div">
            <div class="flex-row" @click="payWayShow">
              <div class="label-middle theme_font_common">支付方式</div>
              <div class="full"></div>
              <div class="theme_font_common right-margin">{{payWayText}}</div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </div>
            </div>
          </div>

          <div class="block-div">
            <div class="flex-row">
              <div class="name">{{settleData.ouName}}</div>
            </div>
            <div>
              <div class="pro-row" v-for="prodata in settleData.carts">
                <div class="img-div">
                  <img :src="prodata.phPictureUrl">
                </div>
                <div class="info-div">
                  <div class="title theme_font_black">{{prodata.productName}}</div>
                  <div class="title theme_font_black">
                    <span>{{prodata.specs}}</span>
                  </div>
                  <div class="price">
                    <PriceOrder :productData="prodata"></PriceOrder>
                    <span style="float: right;">x {{prodata.number}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-row">
              <div class="label-middle theme_font_common">备注</div>
              <div class="full">
                <input class="row-input theme_font_common" placeholder="请留下您想说的话" v-model="remark"/>
              </div>
            </div>
          </div>
          <!-- 发票系统临时屏蔽 -->
          <!-- <div class="block-div" v-if="$store.state.globalConfig.invoice_shopping_enable != false">
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
          </div> -->

          <div class="block-div">
            <div class="flex-row">
              <div class="label-middle full theme_font_common">商品金额</div>
              <div class="theme_font_black">￥{{$util.toDecimal2(settleData.amount)}}</div>
            </div>
            <!--<div class="flex-row">-->
              <!--<div class="label-middle full theme_font_common">立减</div>-->
              <!--<div class="theme_font_red">-￥{{$util.toDecimal2(occurData.discountAmount)}}</div>-->
            <!--</div>-->
            <div class="flex-row" @click="showFreightDetail">
              <div class="label-middle full theme_font_common">运费<i class="iconfont mall-info theme_font_gray"
                                                                    style="margin-left: 3px;"></i></div>
              <div class="theme_font_red">+￥{{$util.toDecimal2(parseFloat(settleData.freightAmount) -
                parseFloat(settleData.freightDiscountAmount))}}
              </div>
            </div>
            <!--<div class="flex-row">-->
              <!--<div class="label-middle full theme_font_common">优惠券</div>-->
              <!--<div class="theme_font_red">-￥{{$util.toDecimal2(occurData.couponAmount)}}</div>-->
            <!--</div>-->
            <!--<div class="flex-row" v-for="digital in occurData.digitalList" v-if="digital.payDigital > digital.fixedDigital">-->
              <!--<div class="label-middle full theme_font_common">{{getDigitalDisplayName(digital.acctType)}}</div>-->
              <!--<div class="theme_font_red">-￥{{$util.toDecimal2(digital.userCanUseDigitalAmount)}}</div>-->
            <!--</div>-->
          </div>

          <!-- 临时屏蔽<div class="block-div" v-if="recommendDisabled">
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
          </div> -->
        </div>
        <div class="bottom-btns">
          <div class="tip theme_bg_yl theme_standard_font theme_light_bg" v-if="deliveryType == 2">
            {{$store.state.mall2.selectAddress.addressFull}}
          </div>
          <div class="btn theme_standard_bg theme_font_white" @click="checkProductStock">提交订单</div>
          <div class="price">
            <div class="rmb-div">
              <span class="theme_font_red">￥</span>
              <span class="left-no-space price-big theme_font_red">{{getTotalPriceDuan(0)}}</span>
              <span class="theme_font_red">.{{getTotalPriceDuan(1)}}</span>
            </div>
            <!--<div v-if="showDigitals">-->
              <!--<div class="digital-div" v-for="digital in occurData.digitalList" v-if="getTotalUsePoints(digital)>0">-->
                <!--<span class="price-big">+{{getTotalUsePoints(digital)}}</span>-->
                <!--<span class="">{{getTotalUnitStr(digital.acctType)}}</span>-->
              <!--</div>-->
            <!--</div>-->
          </div>
        </div>
      </div>
    </nav-content>
    <mt-datetime-picker
      ref="dateDom"
      type="date"
      v-model="pickupTime"
      :startDate="new Date()"
      :endDate="getEndDate()"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日">
    </mt-datetime-picker>
    <pop-view v-if="payWayPopShow" @closeEvent="popClose">
      <div class="pop-body">
        <div class="pop-title theme_font_common">请选择支付方式</div>
        <div class="items-div pop-scroll-div">
          <div class="item theme_font_common theme_bg_white_ef"
               :class="{theme_light_bg: payWaySelected == payway.tag, theme_standard_font_i: payWaySelected == payway.tag, theme_standard_bdr_i: payWaySelected == payway.tag}"
               @click="payWayEvent(payway)" v-for="payway in payWays">{{payway.text}}
          </div>
        </div>
        <div class="bottom-btn theme_font_white theme_standard_bg bottom-space" @click="popSureEvent">确定</div>
      </div>
    </pop-view>
    <Agreement :propsValue="9" v-if="showAgreement" @backEvent="showAgreement = false"></Agreement>
  </div>
</template>

<script>
  import Invoice from '../common/invoice'
  import Freight from '../common/freight'
  // import NoStock from '../common/no-stock'
  // import DigitalPwd from '../common/digital-pwd'
  import PriceOrder from '@/components/commonui/price/price-order'
  import Agreement from '@/components/usercenter/register/agreement'

  export default {
    name: "placeorder",
    components: {
      PriceOrder,
      Agreement
    },
    data() {
      return {
        deliveryType: this.$store.state.mall2.staticDeliverType,
        paramsData: {},
        settleData: {},
        pickupPhone: this.$store.state.login.phone,
        pickupTime: new Date(),
        payWayText: '在线支付',
        payWayPopShow: false,
        payWays: [{
          text: '在线支付',
          tag: '1'
        }, {
          text: '货到付款',
          tag: '0'
        }, {
          text: '提货付款',
          tag: '0'
        }],
        payWaySelected: 1,
        remark: '',
        useInvoice: false,
        invoiceData: null,
        invoiceInfo: '',
        currentInvoice: {},
        showAgreement: false,
        //推荐码
        referrer: '',
        canEditReferrer: true,
        //扫描出来的推荐码
        scanCode: '',
        type: '1', // 1 开团； 2参团
      }
    },
    computed: {
      recommendDisabled() {
        return (!this.$store.state.globalConfig.recommendDisabled || !Number(this.$store.state.globalConfig.recommendDisabled))
      }
    },
    methods: {
      scanCodeFunc: function () {
        this.$bridgefunc.scanCode((dic) => {
          this.scanCode = dic.code;
          this.referrer = dic.code;
        });
      },
      checkProductStock: function () {
        // 判断地区
        if (this.deliveryType == 1) {
          if (this.$store.state.mall2.pickUpUser == undefined || this.$store.state.mall2.pickUpUser == '') {
            this.$Toast('请完善自提人信息')
            return;
          } else if (this.pickupPhone == '') {
            this.$Toast('请完善自提人信息')
            return;
          }
          this.$bridgefunc.vuexStorage()
        }
        if ((!(this.$store.state.mall2.selectAddress.id > 0)) && this.deliveryType == 2) {
          this.$Toast("请维护并选择收货地址！")
          return;
        }

        // 判断库存是否足够 提交订单先判断库存
        for (let i = 0; i < this.settleData.carts.length; i++) {
          let product = this.settleData.carts[i]
          if (product.stockNumber < product.number) {
            this.$Toast('当前区域商品库存不足！')
            return;
          }
        }
        this._submitOrder()
      },
      _submitOrder: function () {

        let url = '/app/json/app_fight_group_order/start';
        if (this.type == '2') {
          url = '/app/json/app_fight_group_order/join';
        }
        let paramsData = this.paramsData;
        if (this.deliveryType == 1) {
          paramsData.pickupReceiver = this.$store.state.mall2.pickUpUser;
          paramsData.pickupMobile = this.pickupPhone;
          let time = this.$util.getMyDate(this.pickupTime);
          paramsData.selectReceiveTime = time;
        }

        paramsData.remark = this.remark

        paramsData.userAddress = this.$store.state.mall2.selectAddress
        paramsData.userAddressId = this.$store.state.mall2.selectAddress.id
        paramsData.token = this.$store.state.login.token

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
              if (data.data.responseSubmit.payAmount == 0) {
                this.$router.replace({
                  path: '/group_detail',
                  query: {
                    orderId: data.data.orderId,
                    mktGroupBuyId: this.mktGroupBuyId,
                    formPaySuccess: '1'
                  }
                });
              } else {
                // this.$router.replace({
                //   name: '收银台',
                //   params: {
                //     payInfo: data.data.responseSubmit,
                //     occurOuCode: this.settleData.ouCode,
                //     isGroup: '1',
                //     orderId: data.data.orderId,
                //     mktGroupBuyId: this.mktGroupBuyId
                //   }
                // })
                console.log('-----------------------------------',this.$route)
                this.$router.replace({
                  path: '/mall2/checkstand',
                  query: {
                    payInfo: JSON.stringify(data.data.responseSubmit),
                    occurOuCode: this.settleData.ouCode,
                    isGroup: '1',
                    orderId: data.data.orderId,
                    mktGroupBuyId: this.mktGroupBuyId,
                    skuId:this.$route.params.skuId,
                    productType:this.$route.params.productType,
                    groupId:this.$route.params.groupId,
                  }
                })
              }
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
      getTotalPriceDuan: function (index) {
        let str = this.$util.toDecimal2(this.settleData.payAmount)
        let arr = str.split('.')
        return arr[index]
      },
      getImgArrs: function (settleData) {
        let arr = [];
        let a3 = settleData.carts
        for (let j = 0; j < a3.length; j++) {
          arr.push(a3[j].phPictureUrl)
        }
        return arr
      },
      showFreightDetail: function () {
        let storeArr = []

        let item = {}
        item.storeName = this.settleData.ouName
        item.freightAmount = this.settleData.freightAmount
        item.freightDiscountAmount = this.settleData.freightDiscountAmount
        item.proImgs = this.getImgArrs(this.settleData)
        storeArr.push(item)

        Freight.open({
          initData: {
            listData: storeArr,
          },
          sureEvent: () => {
            Freight.close();
          }
        })
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
                  this.currentInvoice.invoiceTitle = this.invoiceData.company.title
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
      returnStoreProducts: function (store) {
        let num = store.noActivityCart.length;
        let num1 = 0 // 商品个数总数
        let proImgArr = []
        for (let k = 0; k < store.noActivityCart.length; k++) {
          proImgArr.push(store.noActivityCart[k].phPictureUrl)
          num1 += store.noActivityCart[k].number
        }
        for (let i = 0; i < store.activity.length; i++) {
          num += store.activity[i].cart.length
          for (let j = 0; j < store.activity[i].cart.length; j++) {
            proImgArr.push(store.activity[i].cart[j].phPictureUrl)
            num1 += store.activity[i].cart[j].number
          }
        }
        let storeProData = {
          num: num,
          proNum: num1,
          proImgArr: proImgArr
        }
        store.storeProData = storeProData
      },
      _settle: function () {
        this.$Loading.open();
        let url = '/app/json/app_fight_group_order/settle';

        let paramsData = this.paramsData
        if (this.deliveryType == 2) {
          if (this.$store.state.mall2.selectAddress.id > 0) {
            paramsData.userAddressId = this.$store.state.mall2.selectAddress.id
          }
        } else {
          paramsData.pickupId = this.$store.state.mall2.zitiAddress.id
        }

        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.settleData = data.data
              // this.$router.replace({
              //   name: '收银台',
              //   params: {
              //     payInfo: data.data.responseSubmit,
              //     occurOuCode: this.detailData.storeOuCode
              //   }
              // })
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
      payWayShow: function () {
        this.payWayPopShow = true
      },
      payWayEvent: function (payway) {
        if (payway.tag == 0) {
          this.$Toast("暂不支持！")
          return;
        }
        this.payWaySelected = payway.tag
        this.payWayText = payway.text
      },
      popSureEvent: function () {
        this.payWayPopShow = false
      },
      popClose: function () {
        this.payWayPopShow = false
      },
      toSelectAddress: function () {
        this.$router.push({
          path: '/mall2/addresslist'
        })
      },
      toSelectZitiAddress: function () {
        console.log(this.paramsData)

        let carts = this.paramsData.carts
        let skuIds = []
        for (let i = 0; i < carts.length; i++) {
          skuIds.push(carts[i].skuId)
        }
        this.$router.push({
          path: '/mall2/mypickupaddress',
          query: {
            skuIds: JSON.stringify(skuIds)
          }
        })
      },
      openPicker() {
        this.$refs.dateDom.open();
      },
      pickerConfirm: function (value) {
        let week = '星期' + "天一二三四五六 ".charAt(new Date(value).getDay());
        let date = this.$util.getMyDate(value)
        return date + ' 【' + week + '】'
      },
      getEndDate: function () {
        let dd = new Date()
        dd.setDate(dd.getDate() + 14);
        return dd;
      },
    },
    created() {
      this.type = this.$route.params.type ? this.$route.params.type : '1'
      this.orderId = this.$route.params.orderId ? this.$route.params.orderId : ''
      this.mktGroupBuyId = this.$route.params.mktGroupBuyId ? this.$route.params.mktGroupBuyId : ''
      this.paramsData = JSON.parse(this.$route.params.paramsData)
      this.lastPath = this.$route.query.lastPath
      // this.settleData = JSON.parse(this.$route.query.settleData)
    },
    activated() {
      this._settle();
    },
    beforeRouteLeave(to, from, next) {
      if (to.path == this.lastPath || to.path == '/group_detail' || to.path == '/mall2/checkstand') {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .placeorder {
    width 100%
    height 100%
    overflow hidden

    .points-rule-btn {
      margin -10px 0;
      padding 10px 0;
    }

    .pickup-shop {
      display flex;
      align-items center;
    }

    .flex-div {
      height 100%;
      display flex;
      flex-direction column;

      .scroll-div {
        flex 1
        overflow-x hidden
        overflow-y auto
        -webkit-overflow-scrolling touch

        .colorfulline {
          margin 0 -8px;
          height 3px;

          img {
            width 100%;
            height 100%;
            display block;
          }
        }
      }

      .bottom-btns {
        /*height 70px;*/
        //box-shadow 0 -2px 2px #efefef;
        overflow hidden;

        .tip {
          padding 5px 15px;
          display flex;
          align-items center;
          font-size $font-size-small;
          line-height 16px;

          i {
            margin 6px;
            font-size 15px;
          }
        }

        .price {
          height 50px;
          overflow hidden;
          padding 0px 10px 0 20px;
          // line-height 50px;
          font-size 0px;
          display flex;
          flex-direction: column;
          justify-content center;
          /*justify-content space-between;
          align-content space-between*/

          /*.rmb-div {
            flex 1;
          }*/
          .digital-div {
            padding-top 3px;
            display inline-block;
            font-size 0px;
            span {
              color #999;
              font-size 12px;
              margin 0;
              padding 0;
            }
            .price-big {
              font-size 12px;
            }
          }
          span {
            font-size 14px;
            margin 0;
            padding 0;
          }

          .price-big {
            font-size 20px;
          }
        }

        .btn {
          float right;
          height 50px;
          line-height 50px;
          text-align center;
          padding 0 25px;
          font-size 18px;
          font-weight 500;
        }
      }
    }

    .pro-row {
      display flex;
      align-items center;

      .img-div {
        width 80px;
        height 80px;

        img {
          display block;
          width 100%;
          height 100%;
        }
      }

      .info-div {
        padding-left 8px;
        line-height 16px;
        min-height $font-size-medium;
        font-size $font-size-medium;
        flex 1;

        .font-small {
          font-size 12px;
        }
      }
    }

    .pros-row {
      padding-bottom 8px;
      /*overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;*/
      font-size 0px;

      .img-div {
        margin-right 8px;
        display inline-block;
        width 80px;
        height 80px;

        img {
          display block;
          width 100%;
          height 100%;
        }
      }

      .pros-msg {
        float right;
        margin-top 30px;
        font-size 12px;

        i {
          font-size 16px;
        }
      }
    }

    .title-max {
      height 32px;
      margin-bottom 8px;
    }

    .title-min {
      margin-bottom 8px
    }

    .scan-div {
      padding 5px 10px
    }

    .passwords-input {
      width 100%
      display: flex;
      align-items center;
      justify-content: space-between;

      .passwords {
        width: 75%;

        input {
          height 30px;
          display: block;
          width: 100%;
          font-size: $font-size-medium;
        }
      }

      .show-passwords {
        extend-click()

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
  }
</style>
