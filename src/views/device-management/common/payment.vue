<template>
  <div>
    <nav-top @backEvent="backEvent"></nav-top>
    <nav-content class="container mall2" v-if="showDetail">
      <div class="detail-item">
        <div class="center-content">
          <span class="titer">{{`${item.brandName}${item.deviceName}`}}</span>
          <span style="color: #666">{{item.stationName}}</span>
        </div>
        <div class="right-btn">
          <span>
            <van-tag :color="useState(item).color" type="primary"></van-tag>
            <i style='font-style:normal' :style="{color: useState(item).color}">{{useState(item).typeText}}</i>
          </span>
          <span>
            <i style="font-style:normal;color: #0e80ff">设备编号：7378987</i>
          </span>
        </div>
      </div>
      <div class="explain">
        <div class="content titer">
          <div>服务信息</div>
          <div class="right" @click="rules(item.instruction)">
            <van-icon name="question-o" size='16'/>&nbsp;使用说明
          </div>
        </div>
        <div class="content" v-for="(res, index) in item.standardRules" :key="index" @click='radioChange(index,res)'
             v-if="item.standardRules">
          <div>{{res.ruleName}} <span style="color: #666">(约{{res.timeSpan}}分钟)</span></div>
          <div class="radioBox">
            <div v-if="ahDeviceManage">
              <div v-if="res.priceMode == 0">
                <span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(res.price)}}</span><span
                class="price-x theme_font_red">.{{getDecimals(res.price)}}</span>
              </div>
              <div v-else>
                <span class="price-x theme_font_red">{{res.price}} {{getDictByAliasText(res.priceMode)}}</span>
              </div>
            </div>
            <div v-else>
              <div v-if="item.priceMode == 0">
                <span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(res.price)}}</span><span
                class="price-x theme_font_red">.{{getDecimals(res.price)}}</span>
              </div>
              <div v-else>
                <span class="price-x theme_font_red">{{res.price}} {{getDictByAliasText(item.priceMode)}}</span>
              </div>
            </div>
            &nbsp;&nbsp;<img v-if="radio == index" src="../images/icon-选中.png" alt=""><img v-else src="../images/icon-未选中.png" alt="">
          </div>
        </div>
        <span style="display: block;height: 1px;width: 100%;background-color: rgb(232, 232, 232);margin-bottom: 10px;"
              v-if="item.customRule"></span>
        <div class="content" @click='radioChange(item.standardRules.langth, item.customRule)' v-if="item.customRule">
          <div>自定义 <span style="color: #666">(约{{this.customTime}}分钟)</span></div>
          <div>
            <van-stepper v-model="customTime" :min='item.customRule.minTime || 0' :max='item.customRule.maxTime || 0'
                         :step="item.customRule.stepTime || 0" theme="round" button-size="22" disable-input @plus='stepperplus'
                         @minus='stepperminus'/>
          </div>
          <div class="radioBox">
            <div v-if="item.priceMode == 0">
              <span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{integer}}</span><span
              class="price-x theme_font_red">.{{decimals}}</span>
            </div>
            <div v-else>
              <span class="price-x theme_font_red">{{integer}} {{getDictByAliasText(item.priceMode)}}</span>
            </div>
            &nbsp;&nbsp;<img v-if="radio == item.standardRules.langth" src="../images/icon-选中.png" alt=""><img v-else
                                                                                                               src="../images/icon-未选中.png"
                                                                                                               alt="">
          </div>
        </div>
      </div>
      <div class="explain" v-if="item.priceMode == 0">
        <div class="content titer">
          <div>支付信息</div>
        </div>
        <div class="block-div">
          <div class="flex-row" @click="couponEvent">
            <div class="label-middle theme_font_common">优惠券</div>
            <div class="full"></div>
            <div class="theme_font_black right-margin">优惠{{$util.toDecimal2(settleObj.couponAmount)}}元
            </div>
            <div>
              <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
            </div>
          </div>
          <div v-for="(digital, index) in settleObj.digitalList" :key="index" v-if="digital.acctType != 'LimitWallet'">
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
                <img v-if="digital.payDigital > digital.fixedDigital" src="../images/button-开.png"/>
                <img v-if="digital.payDigital <= digital.fixedDigital" src="../images/button-关.png"/>
              </div>
            </div>
          </div>
        </div>
        <span style="display: block;height: 1px;width: 100%;background-color: rgb(232, 232, 232);margin-bottom: 10px;"></span>
        <div class="content" v-for="(res, index) in payWayList" :key="index" @click='radioChangePayWay(index,res)'>
          <div class="payImg">
            <img :src="res.icon" alt="">&nbsp;
            <span>{{res.text}}</span>
          </div>
          <div class="radioBox">
            <img v-if="radioPayWay == index" src="../images/icon-选中.png" alt=""><img v-else src="../images/icon-未选中.png" alt="">
          </div>
        </div>
      </div>
      <div class="explain" v-else>
        <div class="content titer">
          <div>支付信息</div>
        </div>
        <div class="content" v-for="(res, index) in payWayList" :key="index" @click='radioChangePayWay(index,res)'>
          <div class="payImg">
            <img :src="res.icon" alt="">&nbsp;
            <span>{{res.text}}</span>
          </div>
          <div class="radioBox">
            <img v-if="radioPayWay == index" src="../images/icon-选中.png" alt=""><img v-else src="../images/icon-未选中.png" alt="">
          </div>
        </div>
      </div>
    </nav-content>
    <div class="btm-btn" v-if="showDetail" :style="{backgroundColor: iskcjj ? '#0e80ff' : '#ccc' }">
      <div v-if="settleObj.acctTypeCode == 0" class="tab">
        <div v-if="Number(settleObj.payDigital) <= Number(settleObj.payAmount)" @click="submit">支付 <span class="price-z">￥</span><span
          class="price-z-b">{{getInteger(settleObj.payAmount)}}</span><span class="price-z">.{{getDecimals(settleObj.payAmount)}}</span>
        </div>
        <div v-else>{{`${getDictByAliasText(item.priceMode)}余额不足`}}</div>
      </div>
      <div v-else class="tab">
        <div @click="submit" v-if="Number(settleObj.payDigital) <= Number(settleObj.digitalList[0].userBalanceDigital)">支付
          {{settleObj.payDigital}} {{getDictByAliasText(item.priceMode)}}
        </div>
        <div v-else>{{`${getDictByAliasText(item.priceMode)}余额不足`}}</div>
      </div>
    </div>
    <van-popup v-model="distance" class="popupCard" :close-on-click-overlay="false">
      <div class="popupCardText">
        <span>当前设备超过安全距离</span>
        <span>请重新扫描设备！</span>
      </div>
      <div class="popupCardBtn">
        <span @click="returnBtn">返回</span>
      </div>
    </van-popup>
    <van-popup v-model="showLoading" :close-on-popstate='true' :close-on-click-overlay='false' :closeable='false'>
      <div class="Load">
        <div class="Loading" v-if="loading">
          <van-loading type="spinner" color="#1989fa"/>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;支付中...</p>
        </div>
        <div class="Loading" v-else>
          <van-icon name="passed" color="#1989fa" size='30px'/>
          <p>支付完成</p>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
  import dataMergeInterceptor from "@/utils/staticData/dataMergeInterceptor";
  import mixin from "../mixin";
  import {Loading} from 'vant';
  import payHelper from '@/utils/payHelper'
  import icon from '../images/icon-积分.png'
  import Coupon from '@/components/mall2/common/coupon'

  export default {
    name: "payment",
    mixins: [mixin],
    data() {
      return {
        isPayEvent: false,
        loading: true,
        showLoading: false,
        distance: false,
        showDetail: false,
        step: 0,
        integer: 0,
        decimals: 0,
        customTime: 0,
        settleObj: {},
        radio: 0,
        radioPayWay: 0,
        usedCoupons: [],
        payDigitals: [],
        selectedPayWay: {},
        item: {
          standardRules: [],
          customRule: {}
        },
        payment: {
          digitalList: []
        },
        payWayList: [],
        paramsData: {}
      };
    },
    beforeRouteLeave(to, from, next) {
      if (to.path != "/device_management/rules") {
        this.$keepaliveHelper.deleteCache(this)
      }
      next()
    },
    computed: {
      ahDeviceManage() {
        return this.$store.state.globalConfig.ah_device_manage_rule == '1'
        // return true
      },
      iskcjj() {
        if (this.$store.state.globalConfig.is_kcjj_mark1 == 1) {
          if (dataMergeInterceptor.valueData.UserSummary.userWallet.isSpecialMark1 == 1) {
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      }
    },
    activated() {
      this.$bridgefunc.enterForegroundCallBack(() => {
        if (this.isPayEvent) {
          this.isPayEvent = false
          this.$router.push({
            path: '/device_management/paySuccess',
            query: {
              psySuccess: true
            }
          })
        }
      });
    },
    created() {
      let id = this.$route.query.id
      if (id) {
        this.$request.post('/app/json/app_selfservice_device/getDeviceDetail', {
          id: id,
          posx: this.$store.state.currentLocation.posx,
          posy: this.$store.state.currentLocation.posy
        }).then(res => {
          if (res.status == 0) {
            this.item = res.data || {}
            if ((Number(this.$store.state.globalConfig.selfservice_device_limit_range) || 300) < Number(this.item.distance)) {
              this.distance = true
              return
            }
            if (this.ahDeviceManage) {
              if (this.item.standardRules.length) {
                let standArr = []
                this.item.standardRules.forEach((item, index) => {
                  this.item.ruleType = 0
                  this.item.timeSpan = this.item.standardRules[0].timeSpan
                  if (item.rulePrice.length) {
                    item.rulePrice.forEach((sonItem, sonIndex) => {
                      standArr.push({
                        ...item,
                        price: sonItem.price,
                        priceMode: sonItem.priceMode
                      })
                    })
                  }
                })
                this.item.priceMode = standArr[0].priceMode
                this.item.standardRules = standArr
              }
            } else {
              if (this.item.standardRules.length && this.item.customRule) {
                this.item.ruleType = 0
                this.item.timeSpan = this.item.standardRules[0].timeSpan
              } else {
                if (this.item.standardRules.length) {
                  this.item.ruleType = 0
                  this.item.timeSpan = this.item.standardRules[0].timeSpan
                }
                if (this.item.customRule) {
                  this.item.ruleType = 1
                  this.item.timeSpan = this.item.customRule.minTime
                }
              }
            }
            if (this.item.customRule) {
              this.integer = this.getInteger(Number(this.item.customRule.minPrice) + Number(this.item.customRule.perPrice) * Number(this.step))
              this.decimals = this.getDecimals(Number(this.item.customRule.minPrice) + Number(this.item.customRule.perPrice) * Number(this.step))
            }
            this.paramsData = {
              stationOuCode: this.item.stationOuCode,
              deviceCode: this.item.deviceCode,
              timeSpan: this.item.timeSpan,
              ruleType: this.item.ruleType,
              priceMode: this.item.priceMode
            }
            this.settle(this.paramsData, false)
          } else {
            this.$Toast(res.info);
          }
        })
      } else {
        this.$Toast('设备ID不能为空！');
        return
      }
    },
    mounted() {
    },
    methods: {
      settle(obj, status, couNo) {
        obj.couNo = [];
        if (couNo) {
          obj.couNo = couNo
        } else {
          if (status) {
            if (this.usedCoupons.length > 0) {
              for (let i = 0; i < this.usedCoupons.length; i++) {
                obj.couNo.push(this.usedCoupons[i].couNo);
              }
            } else {
              obj.couNo.push("-1");
            }
          }
        }
        // delete obj.priceMode
        this.$request.post('/app/json/app_self_washer_order/settle', obj).then(res => {
          if (res.status == 0) {
            this.settleObj = res.data
            this.payDigitals = res.data.digitalList || []
            // if (this.settleObj.acctTypeCode == 0 && obj.priceMode === 0 && this.settleObj.payAmount > 0) {
            if (this.settleObj.acctTypeCode == 0 && this.settleObj.payAmount > 0) {
              this.setPayWays(res.data.ouCode)
            } else {
              this.payWayList = [{
                icon: icon,
                text: this.getDictByAliasText(this.settleObj.digitalList[0].acctTypeCode),
                acctType: this.settleObj.digitalList[0].acctType,
                userBalanceDigital: this.settleObj.digitalList[0].userBalanceDigital,
                payDigital: this.settleObj.digitalList[0].payDigital
              }]
            }
            this.showDetail = true
            this.initData()
          } else {
            this.$Toast(res.info);
          }
        })
      },
      stepperplus(value, detail) {
        this.step += 1
        this.integer = this.getInteger(Number(this.item.customRule.minPrice) + Number(this.item.customRule.perPrice) * Number(this.step))
        this.decimals = this.getDecimals(Number(this.item.customRule.minPrice) + Number(this.item.customRule.perPrice) * Number(this.step))
      },
      stepperminus(value, detail) {
        this.step -= 1
        this.integer = this.getInteger(Number(this.item.customRule.minPrice) + Number(this.item.customRule.perPrice) * Number(this.step))
        this.getDecimals(Number(this.item.customRule.minPrice) + Number(this.item.customRule.perPrice) * Number(this.step))
        console.log(this.customTime)
      },
      getInteger: function (price) {
        let str = this.$util.toDecimal2(price)
        let arr = str.split('.')
        return arr[0]
      },
      getDecimals: function (price) {
        let str = this.$util.toDecimal2(price)
        let arr = str.split('.')
        return arr[1]
      },
      radioChange(event, row) {
        // userBalanceDigital
        this.radio = event
        this.paramsData = {
          stationOuCode: this.item.stationOuCode,
          deviceCode: this.item.deviceCode,
          timeSpan: row.timeSpan,
          priceMode: row.priceMode || row.priceMode == 0 ? row.priceMode : ''
        }
        console.log(event, row)
        console.log(this.item.standardRules)
        if (event == this.item.standardRules.langth) {
          this.paramsData.timeSpan = this.customTime
          this.paramsData.ruleType = 1
        } else {
          this.paramsData.ruleType = 0
        }
        console.log('this.paramsData', this.paramsData)
        this.settle(this.paramsData, true)
      },
      setPayWays(ouCode) {
        payHelper.getPayWays('200007', ouCode).then(res => {
          this.payWayList = res || []
          console.log(this.payWayList)
        })
      },
      returnBtn() {
        this.distance = false
        this.$router.go(-1)
      },
      backEvent() {
        this.$router.go(-1)
      },
      // ----------
      getDigitalDisplayName: function (acctType) {
        return this.$mallCommon.accTypeToName(acctType, '150001')
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
      couponEvent: function () {
        let canCoupons = []
        for (let i = 0; i < this.settleObj.userCanUseCoupon.length; i++) {
          let couNo1 = this.settleObj.userCanUseCoupon[i].couNo;
          this.settleObj.userCanUseCoupon[i].selected = false;
          for (let j = 0; j < this.usedCoupons.length; j++) {
            let couNo2 = this.usedCoupons[j].couNo;
            if (couNo2 == couNo1) {
              this.settleObj.userCanUseCoupon[i].selected = true;
              break;
            }
          }
          canCoupons.push(this.settleObj.userCanUseCoupon[i])
        }
        Coupon.open({
          initData: {
            listData: [],
            userCanNotUseCoupon: this.settleObj.userCanNotUseCoupon,
            userCanUseCoupon: canCoupons,
            userCanUseWhenNotSelectCoupon: this.settleObj.userCanUseWhenNotSelectCoupon,
            type: "use",
            skuId: "",
            categoryId: "",
            storeOuCode: "",
            token: this.$store.state.login.token,
            payAmount: this.$util.toDecimal2(
              parseFloat(this.settleObj.payAmount) +
              parseFloat(this.settleObj.couponAmount)
            )
          },
          selectedCoupon: couponArr => {
            this.usedCoupons = couponArr;
            this.backReloadCoupon = true
            this.settle(this.paramsData, true)
            Coupon.close();
          }
        });
      },
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
          // 当前是关闭装
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
            } else {
              arr.push({
                acctType: acctType,
                payDigital: digital.fixedDigital
              });
            }
          }
          this.payDigitals = arr;
        }
        this._reSettleCart(null);
      },
      // 重新结算
      _reSettleCart: function () {
        let arr = []
        for (let i = 0; i < this.payDigitals.length; i++) {
          let item = this.payDigitals[i]
          if (item.acctType != 'LimitWallet') {
            arr.push(item)
          }
        }
        let timeSpan = ''
        let ruleType = 0
        if (this.radio == this.item.standardRules.langth) {
          timeSpan = this.customTime
          ruleType = 1
        } else {
          timeSpan = this.item.standardRules[this.radio].timeSpan
          ruleType = 0
        }
        this.paramsData = {
          payDigital: arr,
          stationOuCode: this.item.stationOuCode,
          deviceCode: this.item.deviceCode,
          timeSpan: timeSpan,
          ruleType: ruleType
        }
        let couNo = [];
        if (this.usedCoupons.length > 0) {
          for (let i = 0; i < this.usedCoupons.length; i++) {
            couNo.push(this.usedCoupons[i].couNo);
          }
        } else {
          couNo.push("-1");
        }
        this.settle(this.paramsData, false, couNo)
      },
      radioChangePayWay(index, row) {
        this.selectedPayWay = row
        this.radioPayWay = index
      },
      initData: function () {
        let couNo = this.settleObj.couNo;
        this.usedCoupons = [];
        if (couNo.length > 0) {
          for (let i = 0; i < couNo.length; i++) {
            this.usedCoupons.push({
              couNo: couNo[i]
            });
          }
        }
      },
      submit() {
        if (!this.iskcjj) return
        this.$Loading.open()
        let obj = {
          stationOuCode: this.item.stationOuCode,
          deviceCode: this.item.deviceCode,
          priceMode: this.item.priceMode
        }
        if (this.settleObj.acctTypeCode != 0) {
          obj.payDigital = [{
            acctType: this.payWayList[this.radioPayWay].acctType,
            userBalanceDigital: this.payWayList[this.radioPayWay].userBalanceDigital,
            payDigital: this.payWayList[this.radioPayWay].payDigital
          }]
        } else {
          let arr = []
          for (let i = 0; i < this.payDigitals.length; i++) {
            let item = this.payDigitals[i]
            if (item.acctType != 'LimitWallet') {
              arr.push(item)
            }
          }
          obj.payDigital = arr
        }
        if (!this.payWayList.length) {
          this.$Toast('请添加支付方式');
          return false
        }
        if (this.radio == this.item.standardRules.langth) {
          obj.timeSpan = this.customTime
          obj.ruleType = 1
        } else {
          obj.timeSpan = this.item.standardRules[this.radio].timeSpan
          obj.ruleType = 0
        }
        obj.couNo = [];
        if (this.usedCoupons.length > 0) {
          for (let i = 0; i < this.usedCoupons.length; i++) {
            obj.couNo.push(this.usedCoupons[i].couNo);
          }
        }
        let url = '/app/json/app_self_washer_order/submit'
        if (this.$route.query.addSubmit) {
          url = '/app/json/app_self_washer_order/addSubmit'
        }
        this.$http.post(url, obj).then(res => {
          this.$Loading.close();
          let data = res.data || {}
          if (data.status == 0) {
            if (this.settleObj.acctTypeCode == 0) { // 现金
              if (Number(data.data.payAmount) > 0) {
                this.payEvent(this.payWayList[this.radioPayWay], data.data.orderType, data.data.orderId)
              } else {
                this.$router.push({
                  path: '/device_management/paySuccess',
                  query: {
                    psySuccess: true
                  }
                })
              }
            } else {
              this.$router.push({
                path: '/device_management/paySuccess',
                query: {
                  psySuccess: true
                }
              })
            }
          } else {
            this.$Toast(data.info)
          }
        })
      },
      payEvent: function (payway, orderType, orderId) {
        this.isPayEvent = true
        payHelper.selfWasherPayEvent(payway, orderType, orderId, '/device_management/home').then(() => {
          this.$router.push({
            path: '/device_management/home',
            query: {
              psySuccess: true
            }
          })
        }).catch(() => {
        })
      },
      enterSuccess(orderId, orderType) {
        this.interval = window.setInterval(res => {
          this.getOrderStatus(orderId, orderType)
        }, 2000)
      },
      getOrderStatus(orderId, orderType) {
        this.$http.post('/app/json/app_self_washer_order/detail', {orderId: orderId, orderType: orderType}).then(res => {
          let data = res.data;
          if (data.status == 0) {
            if (data.data.rechargeState !== '') {
              window.clearInterval(this.interval);
              this.loading = false
              setTimeout(res => {
                this.showLoading = false
                this.$router.push({
                  path: '/device_management/home',
                  query: {
                    psySuccess: true
                  }
                })
              }, 500)
            }
          } else {
            window.clearInterval(this.interval);
            this.showLoading = false
            this.loading = true
            this.$Toast(res.info);
          }
        })
      },
      rules(instruction) {
        this.$router.push({
          path: '/device_management/rules',
          query: {
            instruction: instruction
          }
        });
      }
    },
    components: {
      [Loading.name]: Loading
    },
    beforeDestroy() {
      window.clearInterval(this.interval); // 停止
    },
  };
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl'
  @import '~@/common/stylus/mall2.styl'
  @import "./css/price.styl"
  .container {
    background-color #f6f6f6
    position: relative;
    width: 100%;
    // height  100%
    height: calc(100% - 110px);
    padding 10px
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    
    .detail-item {
      padding 10px;
      width 100%
      height 80px;
      border-radius 5px;
      background-color #fff;
      display flex
      
      .left-icon {
        display block;
        width 100px;
        height 80px;
      }
      
      .center-content {
        // margin-left 10px
        width calc(100% - 120px);
        display flex
        flex-direction column
        
        .titer {
          font-size 14px;
          font-weight 600
        }
        
        span {
          width 100%
          height 100%
          overflow hidden
          text-overflow: ellipsis
          white-space: nowrap
          display flex
          align-items center
        }
      }
      
      .right-btn {
        padding 10px 0
        width 160px
        display flex;
        flex-direction column;
        justify-content space-between
        align-items flex-end
        
        img {
          width 20px;
          height 20px;
        }
      }
    }
    
    .explain {
      margin-top 10px
      padding 10px
      background-color #fff
      
      .content {
        color #4d4d4d
        height 36px
        display flex
        align-items center
        justify-content space-between
        
        .payImg {
          font-size 12px
          display flex
          align-items center
          
          img {
            width 18px;
            height 18px;
          }
        }
        
        .radioBox {
          display flex
          align-items center
          
          img {
            width 18px;
            height 18px;
          }
          
          .img {
            width 32px;
            height 31px;
          }
        }
      }
      
      .titer {
        color #333
        font-size: 14px;
        font-weight 800
        
        .right {
          display: flex;
          align-items: center;
        }
      }
    }
    
    .payWayList {
      .payTiter {
        display flex
        align-items center
        
        .icon {
          width 14px
          height 14px
        }
      }
      
    }
  }
  
  .btm-btn {
    position absolute;
    left 0;
    right 0;
    bottom 0;
    height: 50px;
    background-color #0e80ff
    display flex;
    justify-content center
    align-items center
    
    .tab {
      width 100%
      height 100%
      
      > :first-child {
        width 100%
        height 100%
        color #fff
        font-size 16px
        font-weight 500
        display flex;
        align-items center
        justify-content center
      }
    }
  }
  
  .virtual-payment {
    position: relative;
    
    // height: 200px;
    
    .flex-row, .payamount {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
    }
    
    .red {
      color: red;
    }
    
    .payment-title {
      font-size: 14px;
      color: #ccc;
    }
    
    .red-envelopes {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 40px;
      border-bottom: 1px solid #f3eeee;
      
      .red-num {
        display: flex;
        
        span {
          display: inline-block;
        }
        
        .reduce-add {
          width: 25px;
          height: 25px;
          border: 1px solid #ccc;
          text-align: center;
          line-height: 23px;
        }
        
        .red-num-reduce {
          border-radius: 5px 0 0 5px;
        }
        
        .red-num-add {
          border-radius: 0 5px 5px 0;
        }
        
        .red-num-input {
          width: 50px;
          height: 25px;
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
          background: #fff;
          text-align: center;
        }
      }
    }
    
    .coupon {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 40px;
    }
  }
  
  .boxshadow {
    padding: 10px;
    box-shadow: 1px 1px 5px #d9d4d4;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  
  /deep/ .van-tag {
    height 10px
    width 10px
    border-radius 10px
  }
  
  /deep/ .van-icon {
    color: #666;
  }
  
  /deep/ .van-radio-group {
    display inline-block
  }
  
  /deep/ .van-icon {
    color: #fff
  }
  
  .mall2 .block-div {
    padding 4px 8px
    margin 0
    box-shadow: 0 0 0 #efefef;
    
    .flex-row .swith img {
      width 32px;
      height 31px;
    }
  }
  
  /deep/ .van-popup {
    width: 76%;
    font-size: 14px;
    color: #8c8c8c;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .popupCard {
    height: 160px;
    flex-direction: column;
    line-height: 26px;
    
    .popupCardText {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .popupCardBtn {
      width: 100%;
      color: #000;
      height: 50px;
      display: flex;
      justify-content: center;
      font-size 16px
      
      span {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color #fff;
        background-color #0e80ff
      }
    }
  }
  
  .Load {
    width: 120px;
    height: 120px;
    display flex
    // flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .Loading {
      height 60px
      display flex
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>
