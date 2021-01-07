<template>
  <div class="recharge-index">
    <nav-top title="加油卡充值" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="recharge-content">
      <div class="card-information">
        <div class="item-bgcolor-red"></div>

        <div class="card-content">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left" v-if="cardtype == '01' || cardtype == '02'">
                  单位卡({{ispricard == '1' ? '主卡' : '副卡'}})
                </div>
                <div class="left" v-if="cardtype != '01' && cardtype != '02'">
                  个人卡({{ispricard == '1' ? '主卡' : '副卡'}})
                </div>
                <div class="right change-card-btn" @click="changeCardbtn">更换</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">加油卡卡号</div>
                <div class="right">{{cardno}}</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">预留手机号</div>
                <div class="right">{{reservedphone}}</div>
              </div>
            </div>
          </div>
        </div>

        <p class="title">充值方式</p>
        <van-radio-group v-model="payradio">
          <div class="virtual-payment boxshadow"
               v-if="$store.state.globalConfig.oilCardVirtualPayEnabled == 1">
            <div v-for="(item, index) in settleInfo.digitalList || []" :key="index">
              <div class="flex-row" v-if="item.deductionState != 0">
                <div class="label-middle theme_font_common inline_block payment-title">
                  {{getDigitalDisplayName(item.acctType)}}
                </div>
                <template v-if="getDigitalDisplayUnit(item.acctType) == '元'">
                  <div class="right-margin inline_block" v-if="item.userCanUseDigital > 0">
                    余额：{{item.userBalanceDigital}}元，可用{{item.userCanUseDigital}}元
                  </div>
                  <div class="right-margin inline_block" v-else>
                    余额：{{item.userBalanceDigital}}元，{{getCanNotUseStr(item.deductionState)}}，不能使用
                  </div>
                </template>
                <template v-else>
                  <div class="right-margin inline_block" v-if="item.userCanUseDigital > 0">
                                        <span
                                          v-if="item.userBalanceDigital < 10000">共{{item.userBalanceDigital}}个，</span>
                    可用{{item.userCanUseDigital}}个，抵￥{{$util.toDecimal2(item.userCanUseDigitalAmount)}}元
                  </div>
                  <div class="right-margin inline_block" v-else>
                                        <span
                                          v-if="item.userBalanceDigital < 10000">共{{item.userBalanceDigital}}个，</span>
                    {{getCanNotUseStr(item.deductionState)}}，不能使用
                  </div>
                </template>

                <div class="swith inline_block" @click="useDigitalEvent(item)">
                  <img v-if="item.payDigital > item.fixedDigital"
                       src="static/image/mall2/switch-on.png" style="width:25px"/>
                  <img v-if="item.payDigital <= item.fixedDigital"
                       src="static/image/mall2/switch-off.png" style="width:25px"/>
                </div>
              </div>
            </div>
            <div class="coupon">
              <p class="payment-title">优惠券充值</p>
              <div>
                <p>
                  共选择优惠券
                  <span class="red">{{settleInfo.couNo.length}}</span>张,充值金额
                  <span class="red">{{settleInfo.couponAmount.toFixed(2) || 0.00}}</span>元
                </p>
              </div>
              <van-icon name="ellipsis" size="16" @click="moreCoupon"/>
            </div>

            <div class="payamount">
              <p>
                合计可充值金额:
                <span class="red">{{settleInfo.amount && settleInfo.amount.toFixed(2)}}</span>元
              </p>
              <van-radio name="0" checked-color="red"></van-radio>
            </div>
          </div>

          <div class="pay-mode">
            <div class="pay-mode-item boxshadow" v-for="(item,index) in zhilist" :key="index">
              <p>{{item.text}}</p>
              <van-radio :name="index+1" checked-color="red"></van-radio>
            </div>
          </div>
        </van-radio-group>
        <div class="submit-btn" @click="confirmpayment" v-if="payradio == 0">
          立即充值
          <span>({{settleInfo.amount.toFixed(2)}}元)</span>
        </div>
        <div class="submit-btn" v-else @click="confirmpayment">立即充值</div>
      </div>

      <!-- 更换卡 -->
      <div class="change-card" v-if="ischangeCard">
        <div class="change-card-content">
          <div class="modal-title">更换充值卡</div>
          <van-icon name="cross" class="changeCard-close" size="14" @click="ischangeCard = false"/>
          <div class="table-view">
            <div class="table-view-cell" v-for="(item,index) in cardListArr" :key="index">
              <div class="table-view-cell-text">
                <div class="left">{{item.cardno}}</div>
                <div class="right change-card-btn" @click="changeCard(item)">更换</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 确定支付模态框 -->
      <div class="confirm-pay-modal" v-if="isshowcards">
        <div class="modal-content">
          <div class="modal-title">确认支付？</div>
          <div class="firm-two">
            <p>
              <span>加油卡卡号</span>
              <span>{{cardno}}</span>
            </p>
            <p>
              <span>持卡人姓名</span>
              <span>{{cardholder}}</span>
            </p>
            <p>
              <span>持卡人手机号</span>
              <span>{{reservedphone}}</span>
            </p>
            <p>
              <span>支付方式</span>
              <span>{{payradio == 0 ? '虚拟支付' : zhifufang}}</span>
            </p>
            <p v-if="payradio == 0">
              <span>金额</span>
              <span class="theme_font_red">￥{{settleInfo.amount && settleInfo.amount.toFixed(2)}}</span>
            </p>
            <div v-if="payradio == 0">
              <p v-for="(item9, index9) in settleInfo.digitalList || []" v-if="item9.digitalAmount != 0"
                 :key="index9">
                <span>{{getDigitalDisplayName(item9.acctType)}}支付抵扣</span>
                <span>¥{{item9.digitalAmount}}</span>
              </p>
            </div>

            <p v-if="payradio == 0">
              <span>应付金额</span>
              <span
                class="theme_font_red">￥{{settleInfo.payAmount && settleInfo.payAmount.toFixed(2)}}</span>
            </p>
          </div>
          <div class="firm-three">
            <p class="btn cancel-btn" @click="isshowcards = false">否</p>
            <p class="btn" @click="_submit">是</p>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
  import Coupon from '../../components/mall2/common/coupon'
  import DigitalPwd from "../../components/mall2/common/digital-pwd";
  import payHelper from "@/utils/payHelper";
  import wxfunc from "@/utils/wxfunc";
  import logCenter from "@/utils/logCenter";
  import md5String from "@/utils/md5";

  export default {
    data() {
      return {
        settleInfo: {}, // 结算信息
        usedCoupons: [], // 用户选择券
        payDigitals: [],
        cardno: '',
        cardholder: '',
        reservedphone: '',
        payradio: 1,
        dictByAlias: [],
        DigitalPwd: '',
        isshowcards: false,
        ischangeCard: false,
        cardinfo: {},
        mindex: 0,
        cardListArr: [],  // 卡列表

        zhilist: '',
        zhifufang: '',
        zhifudizhi: '',

        cardtype: '',
        ispricard: '',
        backReloadCoupon: false
      }
    },
    created() {
      // this.cardinfo = JSON.parse(this.$route.query.cardinfo)
      this.cardno = this.$route.query.usercard
      this.mindex = this.$route.query.mindex || 0
      // this.cardholder = this.cardinfo.cardholder
      // this.reservedphone = this.cardinfo.reservedphone
      if (this.$store.state.globalConfig.oilCardVirtualPayEnabled && this.$store.state.globalConfig.oilCardVirtualPayEnabled == 1) {
        this.settlement();
        // this.setPayWays(); // 支付方式
        // this.getDictByAlias();
        console.log('虚拟支付')
      }
      console.log('不需要虚拟支付')
    },
    mounted() {
      console.log(this.$store.state.globalConfig.oilCardVirtualPayEnabled)

      this.getCardList()  // 获取卡信息
    },
    methods: {

      getCardList() {
        this.$request.post('/app/json/card/getCardInfoList').then(res => {
          if (res.status == 0) {
            this.cardListArr = res.data.cardAcctList || []
            this.$request.post('/app/json/enterprise_card/getCardInfoList').then(res => {
              if (res.status == 0) {
                let cardList = res.data.cardAcctList || []
                this.cardListArr = this.cardListArr.concat(cardList)
                if (this.cardListArr.length > this.mindex) {
                  this.cardno = this.cardListArr[this.mindex].cardno
                  this.cardholder = this.cardListArr[this.mindex].cardholder
                  this.reservedphone = this.cardListArr[this.mindex].reservedphone
                  this.cardtype = this.cardListArr[this.mindex].cardtype
                  this.ispricard = this.cardListArr[this.mindex].ispricard
                } else {
                  this.cardno = ''
                  this.cardholder = ''
                  this.reservedphone = ''
                  this.cardtype = ''
                  this.ispricard = ''
                }

                // 单独充值入口，需等加载完卡列表，再去请求支付方式
                this.queryPayModeLIst();  // 银联微信快充
              } else {
                // this.$Toast(data.info);
              }
            })
          }
        })
      },

      // 更换卡
      changeCardbtn() {
        this.ischangeCard = !this.ischangeCard
      },
      changeCard(item) {
        console.log(item)
        this.ischangeCard = !this.ischangeCard
        this.cardno = item.cardno
        this.cardholder = item.cardholder
        this.reservedphone = item.reservedphone
        this.cardtype = item.cardtype
        this.ispricard = item.ispricard
        this.payDigitals = []
        this.usedCoupons = []
        this.settlement()
      },

      queryPayModeLIst() {
        this.$Loading.open();
        let _this = this;
        let url = '/app/json/card/getAppPayTextList';

        this.$http.post(url, {
          cardno: this.cardno,
        }).then(
          res => {
            _this.$Loading.close();
            console.log(res);
            console.log(res.data.data);
            this.zhilist = res.data.data || [];
          })
      },

      /* 结算 */
      settlement() {
        let params = {
          cardNo: this.cardno,
          rechargeAmount: '200'
        }
        if (this.payDigitals.length) {
          params.payDigital = this.payDigitals
        }
        if (this.usedCoupons.length) {
          params.couNo = this.usedCoupons
        }
        this.$request.post('/app/json/card/settle', params).then(res => {
          if (res.status == 0) {
            this.settleInfo = res.data
            this.usedCoupons = this.settleInfo.couNo
            const digitalList = res.data.digitalList || []
            for (let item of digitalList) {
              if (item.payDigital > item.fixedDigital) {
                this.payDigitals.push(item)
                break
              }
            }
            this.reloadSelectedCoupon()
          } else {
            this.$Toast(data.info);
            this.reloadSelectedCoupon()
          }
        })
      },

      setHour(d) {
        return d ? this.$util.formatDate(new Date(d), "yyyy-MM-dd hh:mm") : "";
      },
      reloadSelectedCoupon: function () {
        if (this.backReloadCoupon == false) {
          return ;
        }
        this.backReloadCoupon = false
        for (let i = 0; i < this.settleInfo.userCanUseCoupon.length; i++) {
          let couNo1 = this.settleInfo.userCanUseCoupon[i].couNo;
          this.settleInfo.userCanUseCoupon[i].selected = false;
          for (let j = 0; j < this.usedCoupons.length; j++) {
            // let couNo2 = this.usedCoupons[j].couNo;
            console.log(this.usedCoupons[j], couNo1, 88888)
            if (this.usedCoupons[j] == couNo1) {
              console.log(this.settleInfo.userCanUseCoupon[i].selected, '9999')
              this.settleInfo.userCanUseCoupon[i].selected = true;
              break;
            }
          }
        }
        Coupon.reloadSelectedCoupon(this.occurData.userCanUseCoupon)
      },
      moreCoupon() {
        for (let i = 0; i < this.settleInfo.userCanUseCoupon.length; i++) {
          let couNo1 = this.settleInfo.userCanUseCoupon[i].couNo;
          this.settleInfo.userCanUseCoupon[i].selected = false;
          for (let j = 0; j < this.usedCoupons.length; j++) {
            // let couNo2 = this.usedCoupons[j].couNo;
            console.log(this.usedCoupons[j], couNo1, 88888)
            if (this.usedCoupons[j] == couNo1) {
              console.log(this.settleInfo.userCanUseCoupon[i].selected, '9999')
              this.settleInfo.userCanUseCoupon[i].selected = true;
              break;
            }
          }
        }
        Coupon.open({
          initData: {
            listData: [],
            userCanNotUseCoupon: this.settleInfo.userCanNotUseCoupon,
            userCanUseCoupon: this.settleInfo.userCanUseCoupon,
            type: "use",
            skuId: "",
            categoryId: "",
            storeOuCode: "",
            token: this.$store.state.login.token,
            payAmount: this.$util.toDecimal2(
              parseFloat(this.settleInfo.payAmount)
            )
          },
          selectedCoupon: couponArr => {
            let arry = [];
            for (let i = 0; i < couponArr.length; i++) {
              arry.push(couponArr[i].couNo);
            }
            if (arry.length == 0) {
              arry.push('-1');
            }
            this.usedCoupons = arry;
            this.backReloadCoupon = true
            //            this._reSettleCart(null);
            this.settlement();
            // Coupon.close();
          }
        });
      },

      setPayWays: function () {
        payHelper.getPayWays("100005", this.$route.query.ouCode).then(res => {
          this.payWay = res || [];
          this.selectedPayWay = this.payWay[0];
        });
      },

      /* 虚拟支付 */
      // 1.先从字典库查询所有的值存在本地
      // getDictByAlias: function () {
      //   let Url = "/app/json/app_dict/getDictByAlias";
      //   let paramsData = {
      //     token: this.$store.state.login.token,
      //     alias: "rewards_group"
      //   };
      //   this.$http.post(Url, params).then(res => {
      //     let data = res.data;
      //     console.log(res, "字典", data);
      //     if (data.status == 0 && data.data.length != 0) {
      //       this.dictByAlias = data.data;
      //     }
      //   });
      // },
      // // 2.页面显示的时候先匹配字典库存的子账户名称,如果有就使用,如果没有就调用公共的虚拟支付名称
      //
      // setDisplayName(datainfo) {
      //   console.log(datainfo)
      //   var acctType = datainfo;
      //   var dictValue = "";
      //   console.log(this.dictByAlias)
      //   if (this.dictByAlias.length != 0) {
      //     let dictvalueArr = []
      //     for (var i = 0; i < this.dictByAlias.length; i++) {
      //       console.log(this.dictByAlias[i].dictAlias, "this.dictByAlias[i].dictAlias");
      //       if (this.dictByAlias[i].dictAlias == 150001) {
      //         dictValue = this.dictByAlias[i].dictValue;
      //         console.log(this.dictByAlias[i].dictValue);
      //         return dictValue;
      //       }
      //     }
      //   }
      //   if (dictValue == "" || dictValue == null) {
      //     console.log(acctType, "22222222");
      //     var dictValue_displayName = this.getDigitalDisplayName(acctType);
      //     console.log(dictValue_displayName, "dictValue_displayName");
      //     return dictValue_displayName;
      //   }
      // },
      // 3. 匹配公共的虚拟支付名称
      getDigitalDisplayName: function (acctType) {
        return this.$mallCommon.accTypeToName(acctType, '150001')
        // let arr = this.$store.state.globalConfig.acctList;
        // console.log(arr, "getDigitalDisplayName");
        // for (let i = 0; i < arr.length; i++) {
        //   let item = arr[i];
        //   if (item.acctType == acctType) {
        //     return item.displayName;
        //   }
        // }
        // return "积分";
      },
      // 3. 匹配公共的虚拟支付单位
      getDigitalDisplayUnit: function (acctType) {
        let arr = this.$store.state.globalConfig.acctList;
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          if (item.acctType == acctType) {
            return item.displayUnit
          }
        }
        // return "积分";
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
      useDigitalEvent: function (digital) {
        if (this.payradio != 0) {
          this.$Toast("只有虚拟支付才可使用!!");
          return
        }
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
          console.log(this.payDigitals, "99991");
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
          console.log(this.payDigitals, "99992");
        }
        this.settlement();
      },

      submitBill() {
        // 加油订单提交接口
        // this.$Loading.open();
        let url = "/app/json/card/submit";
        let paramsData = {};
        paramsData.token = this.$store.state.login.token;
        // paramsData.ouCode = this.ouCode;
        // paramsData.uniCode = this.uniCode;
        // paramsData.recordId = this.recordId;
        paramsData.cardNo = this.cardno
        paramsData.rechargeAmount = this.settleInfo.amount
        paramsData.couNo = this.usedCoupons || [];
        if (this.payDigitals.length) {
          paramsData.payDigital = this.payDigitals; // 虚拟支付
        } // 虚拟支付

        if (this.digitalPWD != "") {
          paramsData.payPwd = md5String(this.digitalPWD);
        }
        console.log(paramsData)
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            console.log(res.data, "第一步res.data");
            let data = res.data;
            if (data.status == 0) {
              this.$Toast("充值成功")
              this.isshowcards = !this.isshowcards
              this.$router.go(-1)
              // this.payBill(data.data);
            } else {
              this.$Toast(data.info || "提交订单失败！");
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast("请求数据失败！");
          }
        );
      },
      payBill(payData) {
        // 加油订单提交接口
        /*  let payData = {
           "orderType":"100011",
           "orderId":719,
           "shoppingOrderId":771,
           "tradeNo":"20190108048353478999",
           "payAmount":94.996,
           "freightAmount":0
           }
           */

        if (this.selectedPayWay == null) {
          this.$Toast("请选择支付方式！")
          return;
        }
        payHelper.refuelPayEvent(this.selectedPayWay, payData.orderType, payData.orderId).then(() => {
          this.resultHand("1", payData);
        }).catch(() => {
          this.resultHand("0", payData);
        })
        // this.$Loading.open();
        // let url = "/app/json/refuel_center/pay";
        //
        // let params = {
        //   token: this.$store.state.login.token,
        //   orderType: payData.orderType,
        //   orderId: payData.orderId,
        //   payMode: this.selectedPayWay.payMode,
        //   payModeSub: this.selectedPayWay.payModeSub
        // };
        // if (this.selectedPayWay.payMode == "200") {
        //   // 支付宝支付加入ouCode 和 油站编码 uniCode
        //   params.ouCode = this.$route.query.ouCode;
        //   params.occurOuCode = this.$route.query.uniCode;
        // }
        // this.$http.post(url, params).then(
        //   res => {
        //     let data = res.data;
        //     this.$Loading.close();
        //     if (data.status == 0) {
        //       this.showModal = false;
        //       logCenter.addLog("支付信息", payData);
        //       if (this.selectedPayWay.payMode == "210") {
        //         // 微信支付
        //         let payInfo = JSON.parse(data.data.payInfo);
        //         if (this.$store.state.webtype == 2) {
        //           let dataPay = {
        //             timestamp: payInfo.timestamp,
        //             nonceStr: payInfo.noncestr, // 支付签名随机串，不长于 32 位
        //             package: payInfo.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        //             signType: "MD5", // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        //             paySign: payInfo.paySign // 支付签名
        //           };
        //           wxfunc.wxPay(
        //             dataPay,
        //             () => {
        //               this.resultHand("1", payData);
        //             },
        //             () => {
        //               this.resultHand("0", payData);
        //             }
        //           );
        //         } else {
        //           this.$bridgefunc.wxPay(payInfo, result => {
        //             this.resultHand(result, payData);
        //           });
        //         }
        //       } else {
        //         this.$bridgefunc.aliPay(data.data.payInfo, result => {
        //           this.resultHand(result, payData);
        //         });
        //       }
        //     } else {
        //       this.$Toast(data.info);
        //     }
        //   },
        //   error => {
        //     this.$Loading.close();
        //     this.$Toast("请求数据失败！");
        //   }
        // );
      },
      resultHand(result, payData) {
        this.$Loading.close();
        logCenter.addLog("支付结果", result ? "成功" : "失败");
        if (result == "1") {
          this.$router.replace({
            path: "/firmDetail",
            query: {
              orderType: payData.orderType,
              orderId: payData.orderId,
              fromPage: 1
            }
          });
        } else {
          let cancelUrl = "/app/json/refuel_center/cancelOrder";
          let paramsData2 = {
            token: this.$store.state.login.token,
            orderType: payData.orderType,
            orderId: payData.orderId
          };
          this.$http.post(cancelUrl, paramsData2).then(res => {
            let data2 = res.data;
            if (data2.status == 0) {
              this.$Toast("支付已取消");
            } else {
              this.$Toast(data2.info);
            }
          });
        }
      },

      checkNeedPwd() {
        // needPayPwd: false, // 是否需要支付密码
        // payPwdState: 0, // 支付密码状态 0 未设置支付密码 1 支付密码已锁定 2 已设置支付密码
        this.digitalPWD = "";
        if (this.settleInfo.needPayPwd) {
          // 是否需要支付密码
          let hasDigitail = true;
          // for (let i = 0; i < this.payDigitals.length; i++) {
          //   let d = this.payDigitals[i]
          //   if (d.payDigital > 0) {
          //     hasDigitail = true
          //     break ;
          //   }
          // }
          if (hasDigitail) {
            // 是否需要虚拟支付
            if (this.settleInfo.payPwdState == "1") {
              this.$Toast("支付密码已锁定，请稍后再试！");
              return;
            }
            DigitalPwd.open({
              initData: {
                payPwdState: this.settleInfo.payPwdState
              },
              toSettingPwd: () => {
                this.$router.push({
                  path: "/usercenter/nosetpwd",
                  query: {
                    isSet: 0
                  }
                });
                DigitalPwd.close();
              },
              inputFinished: value => {
                this.digitalPWD = value;
                this.submitBill();
                DigitalPwd.close();
              }
            });
          } else {
            this.submitBill();
          }
        } else {
          this.submitBill();
        }
      },

      /* 充值 */
      _submit() {
        if (this.payradio != 0) {
          this.rendermode2()
        } else {
          for (let i = 0; i < this.payDigitals.length; i++) {
            let d = this.payDigitals[i];
            if (d.payDigital > 0 && d.payDigital > d.userBalanceDigital) {
              let str = this.getDigitalDisplayName(d.acctType);
              str += "余额不足！";
              this.$Toast(str);
              this.settlement();
              return;
            }
          }
          this.checkNeedPwd();
        }

      },
      confirmpayment() {
        if (this.payradio) {
          if (this.payradio == 0) {
            let curTime = this.$store.state.severTime.currentTime
            let cDate = new Date(curTime * 1000);
            let h = cDate.getHours()
            if (h == 23 || h > 23 || h < 2) {
              this.$Toast('23:00~02:00不可进行虚拟支付!')
              return
            } else {
              this.isshowcards = !this.isshowcards
            }
          } else {
            this.zhifufang = this.zhilist[this.payradio * 1 - 1].text; //默认充值方式
            this.zhifudizhi = this.zhilist[this.payradio * 1 - 1].href; //默认充值地址
            this.isshowcards = !this.isshowcards
          }
        } else {
          this.$Toast('请选择支付方式!')
        }
      },
      rendermode2() {
        console.log(this.payradio * 1 - 1)
        console.log(this.$store.state.login.wxOpenid)
        this.$Loading.open();
        let _this = this;
        let url = '/app/json/card/getAppPayTextList';

        this.$http.post(url, {
          token: _this.$store.state.login.token,
          cardno: this.cardno,
        }).then(
          res => {
            _this.$Loading.close();
            console.log(res);
            console.log(res.data.data);
            this.zhilist = res.data.data;
            this.zhifufang = res.data.data[this.payradio * 1 - 1].text; //默认充值方式
            this.zhifudizhi = res.data.data[this.payradio * 1 - 1].href;  //充值充值地址
            if (this.zhifufang == '微信快充') {
              if (this.$store.state.webtype == '2') {
                this.zhifudizhi = this.zhifudizhi.includes('?') ? `${this.zhifudizhi}&openId=${this.$store.state.login.wxOpenid}` : `${this.zhifudizhi}?openId=${this.$store.state.login.wxOpenid}`
              }
            }
            console.log(this.payradio * 1 - 1, this.zhifufang, this.zhifudizhi);
            // window.location.href=this.zhifudizhi

            this.$bridgefunc.customPush({
              path: this.zhifudizhi,
              isnativetop: '1',
              superback: 1
            })

          })
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';

  .recharge-content {
    padding: 10px;

    .card-information {
      .item-bgcolor-red {
        background-color: #ff001a;
        height: 30px;
        border-radius: 10px;
        width: 100%;
        z-index: 1;
      }

      .card-content {
        box-shadow: 1px 3px 5px #f8f8f8;
        border-radius: 10px;
        z-index: 2;
        margin-top: -25px;

        .table-view-cell-text {
          height: 20px;
        }
      }

      .title {
        margin: 15px 0;
        font-size: 14px;
        font-weight: bold;
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

      .submit-btn {
        position: fixed;
        bottom: 10px;
        left: 10px;
        right: 10px;
        height: 40px;
        border-radius: 20px;
        background-color: red;
        color: #fff;
        font-size: 16px;
        text-align: center;
        line-height: 40px;
      }

      .boxshadow {
        padding: 10px;
        box-shadow: 1px 1px 5px #d9d4d4;
        border-radius: 5px;
        margin-bottom: 10px;
      }

      .pay-mode {
        .pay-mode-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
        }
      }
    }

    .couponList {
      margin-bottom: 52px;

      li {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin: 20px auto 0 auto;

        .div {
          margin: auto;
        }

        .div:nth-child(1) {
          width: 100px;

          img {
            width: 100%;
          }
        }

        .div:nth-child(2) {
          p:nth-child(1) {
            padding: 12px 0px;
          }
        }
      }
    }

    .answer {
      position: fixed;
      bottom: 20px;
      left: 2%;
      width: 96%;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      color: white;
      text-align: center;
      font-size: 16px;
      background-color: red;
    }

    .firm-two {
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
      padding: 10px 15px;
      position: relative;
      margin-top: 8px;
    }

    .firm-two p {
      color: #333;
      font-size: 14px;
      padding: 10px 0;
    }

    .firm-two p span:nth-of-type(2) {
      float: right;
    }

    .firm-two p:last-of-type {
      margin-bottom: 0;
    }

    .firm-two p:last-of-type .oilHui {
      display: block;
      padding: 0 0 0 0.26rem;
      margin-top: 0.45rem;
      color: #666;
      /* font-size: 0.3rem; */
    }

    .firm-three {
      padding: 20px;
    }

    .firm-three .tip {
      text-align: center;
      color: #333;
      font-size: 16px;
      font-weight: 700;
    }

    .firm-three .btn {
      background-color: #f02c2d;
      color: #fff;
      font-size: 0.4rem;
      padding: 0.3rem 0;
      border-radius: 50px;
      margin-top: 10px;
      box-shadow: 0 3px 10px 1px rgba(240, 44, 45, 0.5);
      text-align: center;
    }

    .firm-two {
      .coupon-item {
        padding-right: 22px;
        position: relative;

        .iconfont {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }
      }
    }

    .confirm-pay-modal {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
      background: rgba(0, 0, 0, 0.6);

      .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        width: 80%;
        background: #fff;
        border-radius: 4px;

        .modal-title {
          padding: 15px;
          text-align: center;
          font-size: 15px;
          font-weight: 600;
        }

        .firm-two {
          margin-top: 0;
        }

        .firm-three {
          position: static;
          margin: 0 auto;
          transform: translate3d(0, 0, 0);
          left: auto;
          overflow: hidden;

          .btn {
            width: 45%;
            float: right;
            box-shadow: none;
          }

          .cancel-btn {
            float: left;
            background: #ccc;
          }
        }
      }
    }

    .change-card {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
      background: rgba(0, 0, 0, 0.6);

      .change-card-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        width: 80%;
        background: #fff;
        border-radius: 4px;
        padding-bottom: 15px;

        .changeCard-close {
          position: absolute;
          top: 10px;
          right: 10px;
        }

        .modal-title {
          padding: 15px;
          text-align: center;
          font-size: 15px;
          font-weight: 600;
        }
      }
    }

    .change-card-btn {
      color: #ff0000;
    }
  }
</style>
