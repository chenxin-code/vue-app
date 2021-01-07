<template>
  <div class="placeorder mall2 container">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="flex-div">
        <div class="scroll-div">
          <!-- 收货地址信息 -->
          <div class="block-div no-padding-bottom top-address-info">
            <div
              v-if="$store.state.mall2.selectAddress.id > 0 && deliveryType == 2"
              @click="toSelectAddress">
              <div class="flex-row">
                <div class="name theme_font_black">{{$store.state.mall2.selectAddress.receiverName}}</div>
                <div class="name theme_font_black">{{$store.state.mall2.selectAddress.mobile}}</div>
                <div
                  class="act-item-full theme_standard_bg theme_font_white"
                  v-if="$store.state.mall2.selectAddress.isDefault == 1">默认</div>
              </div>
              <div class="flex-row">
                <div class="full theme_font_tint font-small">{{ $store.state.mall2.selectAddress.addressFull }}</div>
                <div><i class="iconfont mall-gengduojiantou theme_font_tint icon-font"></i></div>
              </div>
            </div>
            <div
              v-if="(!($store.state.mall2.selectAddress.id > 0)) && deliveryType == 2"
              @click="toSelectAddress">
              <div class="flex-row">请选择地址信息</div>
            </div>
            <div
              v-if="$store.state.mall2.zitiAddress.id > 0 && deliveryType == 1"
              @click="toSelectZitiAddress">
              <div class="pickup-shop">
                <div style="flex: 1;">
                  <div class="flex-row">
                    <div class="name theme_font_black">自提店铺：{{ $store.state.mall2.zitiAddress.storeName }}</div>
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

          <!-- 自提信息 -->
          <div class="block-div" v-if="deliveryType == 1">
            <div class="flex-row">
              <div class="title theme_font_black">提货人信息</div>
            </div>
            <div class="flex-row flex-row-smallbottom">
              <div class="label-middle theme_font_common">姓名</div>
              <div class="full">
                <input
                  class="row-input"
                  placeholder="请输入提货人姓名"
                  v-model=" $store.state.mall2.pickUpUser "
                />
              </div>
            </div>
            <div class="flex-row">
              <div class="label-middle theme_font_common">联系方式</div>
              <div class="full">
                <input class="row-input" placeholder="请输入提货人联系方式" v-model="pickupPhone"/>
              </div>
            </div>
            <div
              class="flex-row"
              @click="openPicker"
              v-if="$store.state.globalConfig.order_pickup_time_selecter_show != 'false'">
              <div class="label-middle theme_font_common">自提时间</div>
              <div
                class="full theme_font_common"
                :class="{theme_font_tint_i: pickupTime == ''}"
                style="text-align: right;"
                v-if="pickupTime">{{ pickerConfirm(pickupTime) }}</div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </div>
            </div>
            <div class="flex-row" v-if="$store.state.globalConfig.order_pickup_cancel_tip_show != 'false'">
              <div class="pick-up-tip">请于{{ pickUpEndTime }}之前提货，超过自提时间后系统将自动取消订单并退款</div>
            </div>
          </div>

          <!-- 支付方式 -->
          <div class="block-div pay-type-c">
            <div class="flex-row" @click="payWayShow">
              <div class="label-middle theme_font_common">支付方式</div>
              <div class="full"></div>
              <div class="theme_font_common right-margin">{{ payWayText }}</div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </div>
            </div>
          </div>

          <!-- 商品信息 -->
          <div class="block-div" v-for="(store, index) in occurData.store" :key="index">
            <div class="flex-row">
              <div class="name">{{ store.storeName }}</div>
            </div>
            <div class="pro-row" v-for="(prodata, index) in store.noActivityCart" :key="index">
              <div class="img-div">
                <img :src="prodata.phPictureUrl"/>
              </div>
              <div class="info-div">
                <div class="title theme_font_black">{{ prodata.productName }}</div>
                <div class="title theme_font_black">
                  <span>{{ prodata.specs }}</span>
                </div>
                <div class="price">
                  <PriceOrder :productData="prodata"></PriceOrder>
                  <span style="float: right;">x {{prodata.number}}</span>
                </div>
              </div>
            </div>
            <div class="flex-row">
              <div class="label-middle theme_font_common">备注</div>
              <div class="full">
                <input
                  class="row-input theme_font_common"
                  placeholder="请留下您想说的话"
                  v-model="store.remark"
                />
              </div>
            </div>
          </div>

          <!-- 发票 -->
          <div
            class="block-div"
            v-if="$store.state.globalConfig.invoice_shopping_enable != 'false'">
            <div class="flex-row">
              <div class="title full theme_font_common">发票</div>
              <div class="swith" @click="useInvoiceEvent">
                <img v-if="useInvoice" src="static/image/mall2/switch-on.png"/>
                <img v-if="!useInvoice" src="static/image/mall2/switch-off.png"/>
              </div>
            </div>
            <div class="flex-row" v-if="useInvoice" @click="changeInvoice">
              <div class="label-middle theme_font_common">发票信息</div>
              <div class="full"></div>
              <div
                class="theme_font_black right-margin"
                :class="{theme_font_tint: invoiceInfo == ''}">
                {{invoiceInfo != '' ? invoiceInfo : '请编辑发票信息'}}</div>
              <div>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </div>
            </div>
          </div>

          <!-- 金额信息 -->
          <div class="block-div">
            <div class="flex-row">
              <div class="label-middle full theme_font_common">商品金额</div>
              <div class="theme_font_black">￥{{$util.toDecimal2(occurData.amount)}}</div>
            </div>
            <div class="flex-row" @click="showFreightDetail">
              <div class="label-middle full theme_font_common">
                运费
                <i class="iconfont mall-info theme_font_gray" style="margin-left: 3px;"></i>
              </div>
              <div class="theme_font_red">
                +￥{{$util.toDecimal2(parseFloat(occurData.freightAmount) -
                parseFloat(occurData.freightDiscountAmount))}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部提交订单 -->
      <div class="bottom-btns">
        <div class="price-container">￥<span class="big">{{ dealWithPrice(occurData.payAmount)[0] }}</span>.{{ dealWithPrice(occurData.payAmount)[1] }}</div>
        <van-button
          type="danger"
          class="reset-submit-btn"
          @click="checkProductStock"
          color="#f80f16">提交订单</van-button>
      </div>
    </nav-content>

    <!-- 支付方式-弹窗 -->
    <pop-view v-if="payWayPopShow" @closeEvent="popClose">
      <div class="pop-body">
        <div class="pop-title theme_font_common">请选择支付方式</div>
        <div class="items-div pop-scroll-div">
          <div
            class="item theme_font_common theme_bg_white_ef"
            :class="{theme_light_bg: payWaySelected == payway.tag, theme_standard_font_i: payWaySelected == payway.tag, theme_standard_bdr_i: payWaySelected == payway.tag}"
            @click="payWayEvent(payway)"
            v-for="(payway, index) in payWays"
            :key="index">{{ payway.text }}</div>
        </div>
        <div
          class="bottom-btn theme_font_white theme_standard_bg bottom-space"
          @click="payWayPopShow = false">确定</div>
      </div>
    </pop-view>

    <mt-datetime-picker
      ref="dateDom"
      type="date"
      v-model="pickupTime"
      :startDate="new Date()"
      :endDate="getEndDate()"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
    ></mt-datetime-picker>

    <Agreement :propsValue="9" v-if="showAgreement" @backEvent="showAgreement = false"></Agreement>
  </div>
</template>
<script>
import PriceOrder from "@/components/commonui/price/price-order";
import Invoice from '@/components/mall2/common/invoice';
import Freight from "@/components/mall2/common/freight";
import Agreement from "@/components/usercenter/register/agreement";
export default {
  components: {
    PriceOrder,
    Agreement
  },
  data() {
    return {
      paramsData: {},
      deliveryType: 1,
      pickupPhone: this.$store.state.userInfo.phone,
      pickupTime: '',
      pickUpEndTime: '', // 最晚提货时间
      payWays: [
        {
          text: "在线支付",
          tag: "1"
        },
        {
          text: "货到付款",
          tag: "0"
        },
        {
          text: "提货付款",
          tag: "0"
        }
      ],
      payWayText: '在线支付',
      payWaySelected: 1,
      payWayPopShow: false,

      productInfo: {},
      occurData: {
        store: []
      },
      currentStore: {},
      useInvoice: false,
      invoiceData: null,
      currentInvoice: {},
      invoiceInfo: '',
      showAgreement: false,
    }
  },
  mounted() {
    // 计算最晚提货时间
    let durationHours = this.$store.state.globalConfig.order_timeout_pickup_cancel || 360
    if (parseInt(durationHours) == 0) {
      durationHours = 360
    }
    let t1 = (new Date()).getTime()
    t1 += parseInt(durationHours) * 3600 * 1000
    this.pickUpEndTime = this.$util.getPreTime(t1)

    let cancelTime = this.$store.state.globalConfig.order_timeout_pickup_cancel || 0
    let nowTime = new Date()
    nowTime.setHours(nowTime.getHours() + parseInt(cancelTime))
    this.pickupTime = nowTime

    if (this.$route.query.productInfo) {
      this.productInfo = JSON.parse(this.$route.query.productInfo)
      this.deliveryType = this.productInfo.deliverType
    }

    // 结算
    this.initSettle()
  },
  methods: {
    toSelectAddress() {
      this.$router.push({
        path: "/mall2/addresslist"
      })
    },
    toSelectZitiAddress() {
      let carts = [
        {
          skuId: this.productInfo.skuId,
          storeOuCode: this.productInfo.storeOuCode,
          number: 1,
          checked: 1
        }
      ]
      let skuIds = []
      for (let i = 0; i < carts.length; i++) {
        skuIds.push(carts[i].skuId)
      }
      this.$router.push({
        path: "/mall2/mypickupaddress",
        query: {
          skuIds: JSON.stringify(skuIds)
        }
      })
    },
    payWayShow() {
      this.payWayPopShow = true
    },
    popClose() {
      this.payWayPopShow = false;
    },
    payWayEvent(payway) {
      if (payway.tag == 0) {
        this.$Toast("暂不支持！")
        return
      }
      this.payWaySelected = payway.tag
      this.payWayText = payway.text
    },
    openPicker() {
      this.$refs.dateDom.open();
    },
    getEndDate() {
      let cancelTime = this.$store.state.globalConfig.order_timeout_pickup_cancel || 0
      let dd = new Date()
      if (cancelTime) {
        dd.setHours(dd.getHours() + parseInt(cancelTime))
      } else {
        dd.setDate(dd.getDate() + 14)
      }
      return dd
    },
    pickerConfirm(value) {
      let week = "星期" + "天一二三四五六 ".charAt(new Date(value).getDay())
      let date = this.$util.getMyDate(value)
      return date + " 【" + week + "】"
    },
    toServiceEvent(item) {
      let url = "/app/json/product/getThirdServeDetail"
      let paramsData = {
        id: item.thirdServeId
      };
      this.$http.post(url, paramsData).then(res => {
        let data = res.data;
        if (data.status == 0) {
          let pageUrl = data.data.pageUrl
          if (pageUrl == '') {
            this.$Toast('暂无详情！')
            return;
          } else {
            if (pageUrl.indexOf("?") != -1) {
              pageUrl = pageUrl + '&'
            } else {
              pageUrl = pageUrl + '?'
            }
            pageUrl += 'token' + '=' + token + '&lng=' + store.state.currentLocation.posx + '&lat=' + store.state.currentLocation.posy + '&pickupId=' + store.state.mall2.zitiAddress.id + '&webtype=' + store.state.webtype;
            window.location.href = pageUrl
          }
        }
      });
    },
    // 获取前面已填写的发票
    useInvoiceEvent() {
      this.useInvoice = !this.useInvoice
      if (this.useInvoice && this.invoiceData == null) {
        this.$Loading.open()
        let url = "/app/json/order_invoice/loadTwoTypeDefaultUserInvoiceHead"
        let paramsData = {
          token: this.$store.state.login.token
        }
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close()
            let data = res.data
            if (data.status == 0) {
              this.invoiceData = data.data
              if (this.invoiceData.current == "personal") {
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
              this.$Toast(data.info)
            }
          },
          error => {
            this.$Loading.close()
            this.$Toast("请求数据失败！")
          }
        );
      }
    },
    changeInvoice() {
      Invoice.open({
        initData: {
          ...this.invoiceData,
          token: this.$store.state.login.token
        },
        selectedInvoice: invoice => {
          this.currentInvoice = invoice;
          if (invoice.type == 0) {
            // 个人
            this.invoiceInfo = "个人";

            this.invoiceData.personal.title = invoice.name;
            this.invoiceData.personal.userPhone = invoice.phone;
            this.invoiceData.personal.userEmail = invoice.email;
          } else {
            // 公司
            this.invoiceInfo = invoice.company;

            this.invoiceData.company.userPhone = invoice.phone;
            this.invoiceData.company.userEmail = invoice.email;
            this.invoiceData.company.orgTaxNo = invoice.identifyNumber;
            this.invoiceData.company.title = invoice.company;
          }
          Invoice.close();
        },
        invoiceInformation: () => {
          this.showAgreement = true;
        }
      });
    },
    showFreightDetail() {
      let storeArr = []
      for (let i = 0; i < this.occurData.store.length; i++) {
        let store = this.occurData.store[i]
        let item = {}
        item.storeName = store.storeName
        item.freightAmount = store.freightAmount
        item.freightDiscountAmount = store.freightDiscountAmount
        item.proImgs = this.getImgArrs(store)
        storeArr.push(item)
      }

      Freight.open({
        initData: {
          listData: storeArr
        },
        sureEvent: () => {
          Freight.close()
        }
      })
    },
    getImgArrs(store) {
      let arr = [];
      for (let i = 0; i < store.activity.length; i++) {
        let a1 = store.activity[i].cart;
        for (let j = 0; j < a1.length; j++) {
          arr.push(a1[j].phPictureUrl);
        }
      }
      let a3 = store.noActivityCart;
      for (let j = 0; j < a3.length; j++) {
        arr.push(a3[j].phPictureUrl);
      }
      return arr;
    },
    // 处理价格整数小数方法
    dealWithPrice(price) {
      price = Number(price);
      if (!price) {
        return [0, 0, `0.00`];
      }
      price = String(price.toFixed(2));
      let decimalNum = price.split('.')[1]; // 小数
      let integerNum = price.split('.')[0]; // 整数
      return [integerNum, decimalNum, `${integerNum}.${decimalNum}`];
    },
    // 结算
    initSettle() {
      this.$Loading.open()
      let params = {
        carts: [{
          skuId: this.productInfo.skuId,
          storeOuCode: this.productInfo.storeOuCode,
          number: 1,
          checked: 1
        }],
        pickupId: this.$store.state.mall2.zitiAddress.id,
        userAddressId: this.$store.state.mall2.selectAddress.id,
        deliveryType: this.deliveryType,
        packageRefuelId: this.$route.query.packageRefuelId
      }
      this.$http.post('/app/json/app_contract_shopping_order/settle', params).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.occurData = data.data.occur[0]
        } else {
          this.$Toast(data.info)
        }
      })
      .catch(err => {
        this.$Loading.close()
        this.$Toast(`settle err ${err}`)
      })
    },
    // 提交前检查
    checkProductStock() {
      if (!this.occurData.store || this.occurData.store.length == 0) {
        if (this.deliveryType == 1) {
          this.$Toast('当前自提点无库存！')
        } else {
          this.$Toast('当前地址无库存！')
        }
        return
      }
      // 判断地区
      if (this.deliveryType == 1) {
        if (
          this.$store.state.mall2.pickUpUser == undefined ||
          this.$store.state.mall2.pickUpUser == ""
        ) {
          this.$Toast("请完善自提人信息");
          return;
        } else if (this.pickupPhone == "") {
          this.$Toast("请完善自提人信息");
          return;
        }
        this.$bridgefunc.vuexStorage()
      }

      if (
        !(this.$store.state.mall2.selectAddress.id > 0) &&
        this.deliveryType == 2 &&
        this.occurData.needVirtualUserPhone != "1"
      ) {
        this.$Toast("请维护并选择收货地址！")
        return
      }
      
      this._submitOrder()
    },
    // 提交
    _submitOrder(carts) {
      let url = '/app/json/app_contract_shopping_order/submit'
      let paramsData = {
        packageRefuelId: this.$route.query.packageRefuelId,
        deliveryType: this.deliveryType,
      };
      if (this.deliveryType == 1) {
        paramsData.pickupReceiver = this.$store.state.mall2.pickUpUser;
        paramsData.pickupMobile = this.pickupPhone;
        paramsData.pickupId = this.$store.state.mall2.zitiAddress.id
        if (this.$store.state.globalConfig.order_pickup_time_selecter_show != 'false') {
          let time = this.$util.getMyDate(this.pickupTime);
          paramsData.selectReceiveTime = time;
        }
      } else {
        userAddressId: this.$store.state.mall2.selectAddress.id
      }
      // 下单场景
      paramsData.orderScene = this.$util.orderScene()
      paramsData.carts = [{
        skuId: this.productInfo.skuId,
        storeOuCode: this.productInfo.storeOuCode,
        number: 1,
        checked: 1
      }]
      paramsData.remark = [];
      for (let i = 0; i < this.occurData.store.length; i++) {
        let astore = this.occurData.store[i];
        let rm = {
          storeOuCode: astore.storeOuCode,
          remark: astore.remark
        };
        paramsData.remark.push(rm);
      }
      if (this.occurData.needVirtualUserPhone == "1") {
        paramsData.virtualUserPhone = this.$store.state.login.phone;
      }
      paramsData.userAddress = this.$store.state.mall2.selectAddress;
      paramsData.userAddressId = this.$store.state.mall2.selectAddress.id;
      paramsData.token = this.$store.state.login.token;

      // 发票相关
      paramsData.userInvoice = {};
      if (this.currentInvoice != null && this.useInvoice == true) {
        paramsData.userInvoice.invoiceUse = "1";
        paramsData.userInvoice.invoiceType = "1";
        if (this.currentInvoice.type == 0) {
          // 个人
          paramsData.userInvoice.invoiceTitleType = "4";
          paramsData.userInvoice.invoiceTitle = "个人";
        } else {
          // 公司
          paramsData.userInvoice.invoiceTitleType = "5";
          paramsData.userInvoice.invoiceTitle = this.currentInvoice.company;
        }
        paramsData.userInvoice.invoiceUserName = this.currentInvoice.name;
        paramsData.userInvoice.invoiceUserEmail = this.currentInvoice.email;
        paramsData.userInvoice.invoiceUserMobile = this.currentInvoice.phone;
        paramsData.userInvoice.invoiceUserOrgTaxNo = this.currentInvoice.identifyNumber;
        // 票内容类型(0: 商品明细, 1:商品类别)
        paramsData.userInvoice.invoiceDetailType = this.currentInvoice.selectedGoodsType;
      }

      this.$Loading.open();
      this.$http.post(url, paramsData).then(
        res => {
          this.$Loading.close();
          let data = res.data;
          if (data.status == 0) {
            sessionStorage.removeItem('RHY_Pickup_Address')
            sessionStorage.removeItem('Place_Order_Params')
            sessionStorage.removeItem('Place_Order_Delivery_Type')
            this.$router.replace({
              path: '/mall2/checkstand',
              query: {
                payInfo: JSON.stringify(data.data),
                occurOuCode: this.occurData.ouCode,
                giftCards: JSON.stringify({
                  skuId: this.productInfo.skuId,
                  storeOuCode: this.productInfo.storeOuCode,
                  number: 1,
                  checked: 1
                }),
                deliveryType: this.deliveryType,
                isContractOrder: 1,
                packageRefuelId: this.$route.query.packageRefuelId,
                bundleName: this.$route.query.bundleName,
                rebateNum: this.productInfo.rebate
              }
            })
          } else {
            this.$Toast(data.info);
          }
        },
        error => {
          this.$Loading.close();
          this.$Toast("请求数据失败！");
        }
      );
    },
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .container {
    .block-div {
      background-color #fff;
    }
    .nav-content {
      background-color #f6f6f6;
      padding-bottom 50px;
      overflow-y auto;
    }
    .top-address-info {
      background-color #fff;
    }
    .pickup-shop {
      display: flex;
      align-items: center;
    }
    .pick-up-tip {
      line-height 1.4;
      margin -5px 0px;
      color red;
    }
    .colorfulline {
      margin: 0 -8px;
      height: 3px;

      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .pay-type-c {
      background-color #fff;
    }

    .bottom-btns {
      height 50px;
      background-color #fff;
      box-shadow 0 0 10px #ddd;
      position fixed;
      bottom 0;
      left 0;
      right 0;
      display flex;
      align-items center;
      justify-content space-between;
      .price-container {
        padding 0 20px;
        color #f80f16;
        font-size 15px;
        font-weight 700;
        .big {
          font-weight 700;
          font-size 20px;
        }
      }
      .reset-submit-btn {
        height 100%;
        .van-button__text {
          font-size 18px;
          font-weight 400;
        }
      }
    }
  }
</style>