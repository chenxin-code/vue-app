
<template>
  <div class="details" v-if='isDetails'>
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="shop">
        <img src="../images/icon-wash.png" alt="" class="left-icon">
        <div class="center-content">
          <div class="store-top">
            <p class="business">营业中</p>
            <p class="store-name">{{details.stationName}}</p>
          </div>
          <p class="address-info"><van-icon color="color: #666" size='12' name="location" />&nbsp;{{details.sysStore.addressFull}}</p>
          <div class="store-bom">
            <p class="address-info">{{`${$util.toDecimal2(details.distance / 1000)}km`}}&nbsp;/&nbsp; {{details.sysStore.openTime}}</p>
            <div class="right-btn">
              <img src="../images/icon-navigation的副本.png" alt="" class="icon-navigation">
              <span class="vertical">|</span>
              <a style="color: #fff" :href="'tel:'+details.sysStore.phone"><van-icon name="phone" color="color: #fff" size='18'/></a>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div v-for="(item, index) in deviceList" :key="index">
          <p class="device-title">{{ item.deviceName }}</p>
          <ul class='programme'>
            <li
              class="item"
              v-for="(stander, standerIndex) in item.standardRules"
              :key="standerIndex"
              @click="clickStandardRules(stander)">
              <p class="programme-name">{{stander.ruleName}}</p>
              <span class="programme-custom">时长：约{{stander.timeSpan}}分钟</span>
              <div class="programme-amount">
                <span class="amountTip">￥</span>
                <span class="amount">{{$util.toDecimal2(stander.price)}}</span>
              </div>
              <img v-if="isScanCode && standardRulesObj.ruleCode == stander.ruleCode" class='selectIco' src="../images/选中.png" alt="">
            </li>
          </ul>
        </div>
        <div class="couponBox">
          <div class="coupon-titer">
            <img class="img" src="../images/券.png" alt="">
            <span class="titer">可用优惠券</span>
          </div>
          <div v-if="isScanCode">
            <ul class="settle" v-if="tempUserCanUseCoupon.length">
              <li class="item" v-for="(item,index) in tempUserCanUseCoupon" :key="index" @click="clickUseCoupon(item, index)">
                <div class="price">
                  <div> <span class="price-num">{{item.couFaceValue}}</span> <span class="price-text">元</span> </div>
                </div>
                <div class="titer">
                  <p>{{item.couTypeTitle}}</p>
                  <span class="text">{{`有效期至 ${item.validEndDate}`}}</span>
                  <span class="text" v-html="item.couDesc"></span>
                </div>
                <div class="selectImg">
                  <img v-if="useCouponObj.couNo == item.couNo" class="img" src="../images/选中2.png" alt="">
                  <img v-else class="img" src="../images/未选中.png" alt="">
                </div>
              </li>
            </ul>
            <ul v-else class="coupon"><li class="coupon-center">暂无可用优惠券～</li></ul>
          </div>
          <div v-else>
            <ul class="coupon" v-if="details.sysStore.couponSkuList.length">
              <li class="item" v-for="(item,index) in details.sysStore.couponSkuList" :key="index">
                <div class="titer">
                  <p>{{item.skuName}}</p>
                  <span class="text" v-html="item.couDesc"></span>
                <div class="amountBox">
                  <span class="amountTip">￥</span>
                  <span class="amount">{{$util.toDecimal2(item.salePrice)}}</span>
                </div>
                </div>
                <div class="selectImg">
                  <span class="btn" @click="purchase(item)">购买</span>
                </div>
              </li>
            </ul>
            <ul v-else class="coupon"><li class="coupon-center">暂无可用优惠券～</li></ul>
          </div>
        </div>
      </div>
      <van-popup position="bottom" round class="buy-modal" v-model="isShowBuyModal" @closed='closed'>
       <div class="top">
          <p class="titer">购买洗车优惠券</p>
          <van-icon name="cross" color="#979797" size="18" @click="isShowBuyModal = false"/>
       </div>
       <span class="solid"></span>
        <div class="prod-info">
          <img src="../images/商品图.png" alt="" class="prod-img">
          <div class="right">
            <p class="name">{{purchaseGouponObj.skuName}}</p>
            <span class="price"><i>¥</i>{{$util.toDecimal2(purchaseGouponObj.salePrice)}}</span>
          </div>
        </div>
        <span class="solid"></span>
        <div class="purchase-quantity">
          <p class="title">购买数量</p>
          <van-stepper v-model="purchaseNum" :min="purchaseGouponObj.saleNumBegin" :max="purchaseGouponObj.saleNumMax" :step="purchaseGouponObj.saleNumStep"  disable-input integer class="reset-setpper"/>
        </div>
        <span class="solid"></span>
        <div class="modal-submit-btn">
          <van-button round block type="info" color="#FF6745" @click="settleCart">立即购买</van-button>
        </div>
      </van-popup>
      <!-- 位置 -->
      <van-popup round class="tips-modal" v-model="tips" @closed='$router.go(-1)' :close-on-click-overlay='false'>
        <div class="top">温馨提示</div>
        <div class="words">
          <span>当前定位与洗车机之间距离太远，无法使用该门店洗车服务，请移动至洗车机附近后重试！</span>
        </div>
        <span class="solid"></span>
        <div class="modal-btn" @click="$router.go(-1)">我知道了！ </div>
      </van-popup>
    </nav-content>
    <!-- 扫码 -->
    <div class="btm-btn publicBtn" v-if="!isScanCode">
      <div class="btn" @click="scanHandler">
        <img src="../images/扫码洗车.png" alt="">
      </div>
    </div>
    <!-- 正常 -->
    <div class="btm-normal btn publicBtn" v-if="isScanCode && isAvailable">
      <div class="normal-left">
        <span class="total">合计：<i>¥</i><i class="amount"> {{$util.toDecimal2(settleObj.payAmount)}}</i></span>
        <span class="deduction">券抵扣：¥ {{$util.toDecimal2(settleObj.couponAmount)}}</span>
      </div>
      <div class="normal-right" @click="submitDevice"><span>提交订单</span></div>
    </div>
    <!-- 进行中 -->
    <div class="btm-time btn publicBtn" v-else-if="isScanCode">
      <div v-if="!otherError">洗车中，请稍后下单！</div>
      <div v-else>{{ errorMsg }}</div>
      <div class="time-right" v-if="!otherError">
        <span class='titer'>剩余时间</span>&nbsp;&nbsp;
        <van-count-down :time="orderFinishTime" format="mm:ss">
          <template v-slot="timeData">
            <span class="block">{{ (timeData.hours * 60 + timeData.minutes).toString().length == 2 ? `${timeData.hours * 60 + timeData.minutes}` :  `0${timeData.hours * 60 + timeData.minutes}`}}</span>
            <span class="colon">:</span>
            <span class="block">{{ timeData.seconds.toString().length == 2 ? timeData.seconds : `0${timeData.seconds}` }}</span>
          </template>
        </van-count-down>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { CountDown, Dialog } from "vant";
import DigitalPwd from "@/components/mall2/common/digital-pwd";
export default {
  name: "carDetails",
  data() {
    return {
      isScanCode: false,
      isDetails: false,
      // 是否可用
      isAvailable: true,
      details: {},
      settleObj: {},
      // 设备&方案列表
      deviceList: [],
      standardRulesObj: {},
      useCouponObj: {},
      purchaseGouponObj: {},
      digitalPWD: '',
      purchaseNum: 1,
      isShowBuyModal: false,
      tips: false,
      tempUserCanUseCoupon: [],
      otherError: false,
      errorMsg: '',
      orderFinishTime: 0,
      limitDistance: 0,
    };
  },
  components: {
    [CountDown.name]: CountDown
  },
  created() {
    if (this.$store.state.globalConfig.washcar_limit_range) {
      this.limitDistance = Number(
        this.$store.state.globalConfig.washcar_limit_range
      )
    }
    if (this.$route.query.stationOuCode) {
      this.isScanCode = this.$route.query.isScanCode || false
      // 获取设备信息（店铺信息，店铺下可购买的电子券信息）
      this.getDeviceDetail(this.$route.query.stationOuCode)
      // 获取设备列表&方案
      this.getDeviceList(this.$route.query.stationOuCode)
    } else {
      this.$Toast('为获取到响应参数！')
    }
  },
  methods: {
    // 获取设备信息（店铺信息，店铺下可购买的电子券信息）
    getDeviceDetail(stationOuCode) {
      this.$Loading.open()
      this.$http.post('/app/json/app_selfservice_device/getCarDeviceDetail', {
        stationOuCode: stationOuCode,
        posx: this.$store.state.currentLocation.posx,
        posy: this.$store.state.currentLocation.posy
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          if (!this.isScanCode) {
            this.isDetails = true
          }
          this.details = data.data || {}

          // 超过距离，不能使用 TODO
          if (data.data.distance && data.data.distance > this.limitDistance) {
            this.tips = true
          }

          // 扫码
          if (this.$route.query.isScanCode) {
            this.checkStatus()
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`getCarDeviceDetail err ${err}`)
      })
    },
    // 获取设备列表&方案
    getDeviceList(stationOuCode) {
      this.$Loading.open()
      this.$http.post('/app/json/app_selfservice_device/getDeviceList', {
        stationOuCode,
        posx: this.$store.state.currentLocation.posx,
        posy: this.$store.state.currentLocation.posy
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          if (data.data instanceof Array && data.data.length > 0) {
            this.deviceList = data.data
            this.standardRulesObj = data.data[0].standardRules[0]
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`getDeviceList err ${err}`)
      })
    },
    // 检查设备状态
    checkStatus() {
      this.$Loading.open()
      this.$http.post('/app/json/app_self_car_order/getWorkOrder', {
        storeOuCode: this.$route.query.stationOuCode,
        self: false
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.getSettle({storeOuCode: this.$route.query.stationOuCode,deviceCode: this.$route.query.deviceCode}, true)
          if (data.data.work) {
            // 正在洗车
            let endTime = moment(data.data.startTime).add(data.data.washerTime, 'm')
            let currentTime = moment()
            this.isAvailable = false
            this.otherError = false

            this.orderFinishTime = endTime.subtract(currentTime).minutes() * 60 * 1000
          } else {
            this.isAvailable = true
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`getWorkOrder err ${err}`)
      })
    },
    // 结算-获取券列表
    getSettle(obj, isFirst) {
      this.$Loading.open()
      this.$http.post('/app/json/app_self_car_order/settle', obj).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.settleObj = data.data || {}
          if (this.settleObj.userCanUseCoupon instanceof Array && this.settleObj.userCanUseCoupon.length > 0 && this.tempUserCanUseCoupon.length == 0) {
            this.tempUserCanUseCoupon = this.settleObj.userCanUseCoupon
          }
          if (this.settleObj.userCanUseCoupon.length) {
            if (isFirst) {
              this.useCouponObj = this.settleObj.userCanUseCoupon[0]
            }
          }
          if (this.isScanCode) {
            this.isDetails = true
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`settle err ${err}`)
      })
    },
    // 扫码洗车
    scanHandler() {
      // 无洗车订单
      this.$bridgefunc.scanCode(res => {
        let tempCode = JSON.parse(res.code)
        // 检查是否本人正在洗车
        this.$Loading.open()
        let params = {
          storeOuCode: tempCode.stationOuCode,
          self: true
        }
        this.$http.post('/app/json/app_self_car_order/getWorkOrder', params).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            if (data.data.work) {
              // 工作中
              if (data.data.self) {
                // 本人正在洗车 -- 跳转洗车中页面
                this.$router.replace({
                  path: '/carWash/speedProgress',
                  query: {
                    orderId: data.data.shoppingOrderModel.id,
                    orderType: data.data.shoppingOrderModel.orderType,
                    tradeNo: data.data.shoppingOrderModel.tradeNo,
                    deviceCode: data.data.utilityAccount,
                    startTime: data.data.startTime, // 洗车开始时间
                    washerTime: data.data.washerTime, // 洗车时长
                    isCountContinue: 1
                  }
                })
              }
            } else {
              this.$router.replace({
                path: '/carWash/replacePage',
                query: {
                  stationOuCode: tempCode.stationOuCode,
                  deviceCode: tempCode.deviceCode || '',
                  washingWay: tempCode.washingWay || '',
                  isScanCode: true
                }
              })
            }
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Loading.close()
          this.$Toast(`getWorkOrder err ${err}`)
        })
      })
    },
    // 选择方案
    clickStandardRules(item) {
      this.standardRulesObj = item
      this.tempUserCanUseCoupon = []
      this.useCouponObj = {}
      if (this.isScanCode) {
        this.getSettle({couNo: [Object.keys(this.useCouponObj).length ? this.useCouponObj.couNo : '-1'], storeOuCode: this.$route.query.stationOuCode, deviceCode: this.$route.query.deviceCode, ruleCode: item.ruleCode})
      }
    },
    // 选择优惠券
    clickUseCoupon(item, index) {
      if (item.couNo == this.useCouponObj.couNo) {
        if (Object.keys(this.useCouponObj).length) {
          this.useCouponObj = {}
        } else {
          this.useCouponObj = item
        }
      } else {
        this.useCouponObj = item
      }
      this.getSettle({
        couNo: [Object.keys(this.useCouponObj).length ? this.useCouponObj.couNo : '-1'],
        storeOuCode: this.$route.query.stationOuCode,
        deviceCode: this.$route.query.deviceCode,
        ruleCode: this.standardRulesObj.ruleCode
      })
    },
    closed() {
      this.isShowBuyModal = false
      this.purchaseNum = 1
    },
    // 提交订单-洗车
    submitDevice() {
      let paramsData = {
        storeOuCode: this.$route.query.stationOuCode,
        deviceCode: this.$route.query.deviceCode,
        ruleCode: this.standardRulesObj.ruleCode
      }
      paramsData.couNo = []
      if (Object.keys(this.useCouponObj).length) {
        paramsData.couNo = [Object.keys(this.useCouponObj).length ? this.useCouponObj.couNo : '']
      }
      this.$Loading.open()
      this.$http.post('/app/json/app_self_car_order/submit', paramsData).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          console.log('payAmount', data.data.payAmount)
          if (data.data.payAmount == 0) {
            let targetPath = '/carWash/paySuccess'
            if (this.$route.query.washingWay == 2 || this.$route.query.washingWay == '2') {
              targetPath = '/carWash/scanPaySuccess'
            }
            this.$router.replace({
              path: targetPath,
              query: {
                state: 3,
                orderId: data.data.orderId,
                orderType: data.data.orderType,
                tradeNo: data.data.tradeNo,
                deliverCheckcode: data.data.deliverCheckcode,
                deviceCode: this.$route.query.deviceCode,
                storeOuCode: this.$route.query.stationOuCode,
                washingWay: this.$route.query.washingWay,
                stationName: this.details.stationName
              }
            })
          } else {
            this.$router.replace({
              path: '/mall2/checkstand',
              query: {
                payInfo: JSON.stringify(data.data),
                occurOuCode: data.data.occurOuCode,
                deliveryType: 2,
                deviceCode: this.$route.query.deviceCode,
                storeOuCode: this.$route.query.stationOuCode,
                washingWay: this.$route.query.washingWay,
                isWashCarOrder: 1,
                stationName: this.details.stationName
              }
            })
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`submit err ${err}`)
      })
    },

    // 券购买按钮点击
    purchase(item) {
      this.getAppProDetail({skuId: item.skuId, deliverType: 2})
    },
    getAppProDetail(obj) {
      this.$Loading.open()
      this.$http.post('/app/json/product/getAppProDetail', obj).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.purchaseGouponObj = data.data || {}
          this.isShowBuyModal = true
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`getAppProDetail err ${err}`)
      })
    },
    // 提交订单-购券
    settleCart() {
      let paramsData = {
        token: this.$store.state.login.token,
        carts: [{
          skuId: this.purchaseGouponObj.skuId,
          storeOuCode: this.purchaseGouponObj.storeOuCode,
          number: this.purchaseNum,
          checked: '1'
        }],
        deliveryType: this.purchaseGouponObj.deliveryType,
        userAddress: this.$store.state.mall2.selectAddress,
        pickupId: this.$store.state.mall2.zitiAddress.id
      };
      if (this.purchaseGouponObj.deliveryType == 2) {
        if (this.$store.state.mall2.selectAddress.id > 0) {
          paramsData.userAddressId = this.$store.state.mall2.selectAddress.id
        }
      }
      this.$Loading.open()
      this.$http.post('/app/json/app_cart/SettleCart', paramsData).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          let params = {
            res: data.data,
            paramsData: paramsData,
            deliveryType: this.purchaseGouponObj.deliveryType,
            skuCode: this.purchaseGouponObj.skuCode, // 商品编码
            storeOuCode: this.purchaseGouponObj.storeOuCode, // 店铺编码
          };
          if (!(this.$store.state.mall2.selectAddress.id > 0) && this.purchaseGouponObj.deliveryType == 2) {
            if (this.matchAddress) {
              this.$store.state.mall2.selectAddress = this.matchAddress;
              this.$bridgefunc.vuexStorage(() => {
              })
            } else {
              params.noMatch = true;
            }
          }
          this.closed()
          if (this.$mallCommon.isExistCanNotAttendActivity(data.data.occur) == true) {
            this.$MessageBox.confirm('部分商品不能参加活动</br>将按原价购买，是否继续？', '提示', {confirmButtonText: '确定'}).then(action => {
              this.$router.replace({
                name: '填写订单',
                params: params
              })
            }).catch(action => {
            });
          } else {
            this.$router.replace({
              name: '填写订单',
              params: params
            })
          }
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`SettleCart err ${err}`)
      })
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/mixin.styl';
.details {
  width: 100%;
  height: 100%;
  position: relative;
  .container {
    background-color #F5F5F5
    .shop {
      color #fff
      width 100%
      height 120px
      padding 12px 0px 10px 10px;
      background-color #118820
      display flex;
      .left-icon {
        display block;
        width 48px;
        height 48px;
      }
      .center-content {
        padding-left 10px
        width calc(100% - 50px)
        .store-top {
          width 100%
          margin-bottom 14px
          display flex
          align-items center
          .business {
            padding 3px 4px
            color #118820
            font-size 10px;
            margin-right 6px
            border-radius 10px;
            border .5px solid #61C36D;
            background-color #fff;
          }
          .store-name {
            width calc(100% - 70px)
            font-size 15px;
            line-height 18px;
            font-weight 500;
            ellipse()
          }
        }
        .address-info {
          width 100%
          margin-top 5px;
          padding 0 2px;
          font-size 12px;
          line-height 18px;
          ellipse()
        }
        .store-bom {
          width 100%
          display flex
          justify-content space-between
          align-items center
          .right-btn {
            display flex;
            justify-content center
            align-items center
            padding 5px 10px;
            font-size 15px;
            font-weight 500;
            .icon-navigation {
              display block;
              margin 0 auto;
              width 19px;
            }
            .vertical {
              margin 0 10px
            }
          }
        }
      }
    }
    .content {
      width 100%
      margin-top -10px
      background-color #F5F5F5
      height calc(100% - 165px)
      border-radius: 10px 10px 0px 0px
      overflow-y auto
      padding 5px
      .device-title {
        font-size 18px;
        font-weight 500;
        color #333333;
        padding 10px;
      }
      .programme {
        width 100%
        overflow hidden
        .item {
          margin 5px
          float left
          height 100px
          width: calc(50% - 10px);
          background-color #fff
          display flex
          flex-direction column
          justify-content space-between
          padding 10px 10px 16px
          position relative
          .programme-name {
            font-size 15px
            font-weight 500
            width 80%
            ellipse()
          }
          .programme-custom {
            color #999
            margin-top -4px
            font-size 12px
          }
          .programme-amount {
            color #FF6745
            .amountTip {
              font-weight 500
            }
            .amount {
              font-weight 500
              font-size 15px
            }
          }
          .selectIco {
            position absolute
            right 0
            top 0
            width 30px
            height 30px
          }
        }
      }
      .couponBox {
        width: calc(100% - 10px);
        height 100px
        margin 5px
        .coupon-titer {
          margin 12px 0
          display flex
          align-items center
          .img {
            width 24px
            height 20px
          }
          .titer {
            font-size 15px
            font-weight 500
            margin-left 8px
          }
        }
        .coupon {
          width 100%
          .item {
            width 100%
            height 90px
            margin 10px 0
            padding 14px 22px
            background-image url("../images/券底图.png")
            background-repeat no-repeat
            background-size 100% 100%
            display flex
            justify-content space-between
            align-items center
            .titer {
              height 100%
              width: calc(100% - 80px);
              display flex
              flex-direction column
              justify-content space-between
              p {
                width 100%
                font-size 15px
                font-weight 500
                ellipse()
              }
              .text {
                color #999
                width 100%
                line-height 18px
                ellipse()
              }
              .amountBox {
                color #FF6745
                .amountTip {
                  font-weight 500
                }
                .amount {
                  font-weight 500
                  font-size 15px
                }
              }
            }
            .selectImg {
              width 60px
              height 100%
              display flex
              justify-content center
              align-items center
              .btn {
                width 52px
                height 26px
                color #fff
                line-height 26px
                text-align center
                display inline-block
                border-radius: 50px;
                background-color #FF6745
              }
            }
          }
          .coupon-center {
            color #999999
            width 100%
            height 90px
            text-align center
            background-image url("../images/券底图.png")
            background-repeat no-repeat
            background-size 100% 100%
            text-align center
            line-height 90px
          }
        }
        .settle {
          width 100%
          .item {
            width 100%
            height 90px
            margin 10px 0
            padding 14px
            background-image url("../images/券底图.png")
            background-repeat no-repeat
            background-size 100% 100%
            display flex
            justify-content space-between
            align-items center
            .price {
              width 80px
              color #FF6745
              height 100%
              display flex
              justify-content center
              align-items center
              .price-num {
                font-size 30px
                font-weight 500
              }
              .price-text {
                font-weight 500
              }
            }
            .titer {
              height 100%
              width: calc(100% - 140px);
              margin 0 12px
              display flex
              flex-direction column
              justify-content space-between
              p {
                width 100%
                font-size 15px
                font-weight 500
                ellipse()
              }
              .text {
                color #999
                width 100%
                ellipse-2()
                line-height 18px
              }
            }
            .selectImg {
              width 40px
              height 100%
              display flex
              justify-content center
              align-items center
              .img {
                width 30px
                height 30px
              }
            }
          }
        }
      }
    }
    .buy-modal {
      width 100%
      padding 25px 20px 0;
      .solid {
        width 100%
        height 0.5px
        margin 14px 0
        display inline-block
        background-color #DCDCDC
      }
      .top {
        display flex
        justify-content space-between
        align-items center
        .titer {
          font-size: 15px
          font-weight 500
        }
      }

      .prod-info {
        display flex;
        .prod-img {
          display block;
          width 70px;
          height 70px;
          border-radius 5px;
        }
        .right {
          flex 1;
          display flex;
          padding-top 2px
          padding-bottom 2px
          padding-left 10px;
          flex-direction column;
          justify-content space-between;
          .name {
            font-weight 500;
            font-size 15px;
            line-height 18px;
            ellipse-2();
          }
          .price {
            font-size 16px;
            font-weight 500
            color rgb(255, 103, 69);
            i {
              font-weight 500
              font-size 12px;
              font-style normal
              margin-right 2px
            }
          }
        }
      }
      .purchase-quantity {
        display flex;
        justify-content space-between;
        align-items center;
        .title {
          font-size 14px;
          font-weight 500;
        }
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
      }
      .modal-submit-btn {
        font-weight 500
        // margin-top 54px;
        margin-bottom 10px;
      }
    }
    .tips-modal {
      width 80%
      padding 20px 0
      .top {
        color: #118820
        font-size: 22px
        font-weight 500
        text-align center
      }
      .words {
        color #333333
        padding 16px 22px
        font-size: 15px
        line-height: 24px
      }
      .modal-btn {
        text-align center
        font-size 16px
        color: #118820
        font-weight: 500
      }
      .solid {
        width 100%
        height 0.5px
        margin 14px 0
        display inline-block
        background-color #DCDCDC
      }
    }
  }
  .publicBtn {
    position fixed;
    left 0;
    right 0;
    bottom 0;
    display flex
  }
  .btm-btn {
    height: 96px;
    justify-content center
    background:linear-gradient(179deg,rgba(245,245,245,0) 0%,rgba(245,245,245,1) 100%);
    .btn {
      width 200px
      height 96px
      img {
        width 100%
        height 100%
      }
    }
  }
  .btm-time {
    height: 50px;
    padding 0 12px
    color #fff
    font-size 15px
    font-weight 500
    display flex
    align-items center
    justify-content space-between
    background-color #FF6745
    .time-right {
      display flex
      align-items center
      justify-content center
      font-weight 200
      font-size 12px
      /deep/ .van-count-down {
        .block {
          width 30px
          height 30px
          display inline-block
          text-align center
          line-height 30px
          font-weight 500
          color #FF6745
          border-radius 30px
          background-color #fff
        }
        .colon {
          font-weight 500
          color #fff
        }
      }
    }
  }
  .btm-normal {
    padding 0 12px
    height: 60px;
    align-items center
    background-color #fff
    justify-content space-between
    .normal-left {
      .total {
        color #333333
        vertical-align: text-bottom
        i {
          font-weight 500
          color #FF6745
          font-style normal
        }
        .amount {
          font-size 18px
        }
      }
      .deduction {
        margin-left 20px
        color #909090
      }
    }
    .normal-right {
      padding 9px 12px
      border-radius: 30px;
      background-color #FF6745
      span {
        color #fff
        font-weight: 500
        font-size: 14px
      }
    }

  }
}
</style>
