<template>
  <div class="movietickerorder">
    <nav-top title="填写订单" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="movieTicket-order">
      <div class="movieTicket-order-content">
        <div class="order-infomation">
          <div class="order-item">
            <p class="title">商品名称</p>
            <p class="item-right">{{params.skuName}}</p>
          </div>
          <div class="order-item">
            <p class="title">商品单价</p>
            <p>{{settleInfo.amount}} 元
              <span v-if="fromPointsShop"> +
                {{pointsShopData ? pointsShopData.fixedDigital : ''}} 积分</span>
            </p>
          </div>
        </div>

        <div class="sales-promotion" v-if="saleShow">
          <div class="order-item">
            <p class="title">促销活动</p>
            <div class="right">
              <span>{{salesTypeName}}</span>
              <van-icon name="ellipsis" size="16" @click="saleCouponHandle"/>
            </div>
          </div>
        </div>

        <!-- 虚拟支付 -->
        <div class="fictitious-pay">
          <!-- <div class="fictitious-pay"> -->
          <div class="virtual-payment boxshadow">
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
                    <span v-if="item.userBalanceDigital < 10000">共{{item.userBalanceDigital}}个，</span>
                    可用{{item.userCanUseDigital}}个，抵￥{{$util.toDecimal2(item.userCanUseDigitalAmount)}}元
                  </div>
                  <div class="right-margin inline_block" v-else>
                    <span v-if="item.userBalanceDigital < 10000">共{{item.userBalanceDigital}}个，</span>
                    {{getCanNotUseStr(item.deductionState)}}，不能使用
                  </div>
                </template>

                <div class="swith inline_block" @click="useDigitalEvent(item)">
                  <img v-if="item.payDigital > item.fixedDigital" src="static/image/mall2/switch-on.png" style="width:30px"/>
                  <img v-if="item.payDigital <= item.fixedDigital" src="static/image/mall2/switch-off.png" style="width:30px"/>
                </div>
              </div>
            </div>
            <div class="coupon">
              <p class="payment-title">优惠券充值</p>
              <div>
                <p>
                  共选择优惠券
                  <span class="red">{{settleInfo.couNo ? (settleInfo.couNo).length : 0}}</span>张,充值金额
                  <span class="red">{{settleInfo.couponAmount ? settleInfo.couponAmount.toFixed(2) : 0.00}}</span>元
                </p>
              </div>
              <van-icon name="ellipsis" size="16" @click="moreCoupon"/>
            </div>
          </div>
        </div>

        <div class="price-infomation">
          <div class="order-item">
            <p class="title">商品金额</p>
            <p>¥{{settleInfo.amount}}</p>
          </div>
          <div class="order-item" v-if="fromPointsShop">
            <p class="title">商品积分</p>
            <p>{{pointsShopData ? pointsShopData.fixedDigital : ''}} 积分</p>
          </div>
          <div class="order-item">
            <p class="title">立减</p>
            <!-- <p class="red">- ¥{{settleInfo.amount-settleInfo.payAmount || 0}}</p> -->
            <p class="red">- ¥{{settleInfo.couponAmount}}</p>
          </div>
          <div class="order-item" v-if="fromPointsShop">
            <p class="title">账户积分</p>
            <p>{{userPoints}} 积分</p>
          </div>
        </div>

        <div class="order-user-info" v-if="$route.query.orderType != 'videoRecharge'">
          <div class="order-item">
            <p class="title">{{this.params.productType == 510 ? '充值账号' : '接收手机号'}}</p>
            <div class="inp">
              <input type="text" :placeholder="phonePlaceholder()" v-model="userPhone"/>
            </div>
          </div>
        </div>

      </div>
      <div class="order-submit">
        <p class="price">
          ¥
          <span>{{settleInfo.payAmount}}</span>
          <span v-if="fromPointsShop"> +
            {{pointsShopData ? pointsShopData.fixedDigital : ''}}积分</span>
        </p>
        <button :class="flag ? 'sub-btn' : 'sub-btn sub-btn-color'" @click="handleSubmit">提交订单</button>
      </div>
      <van-action-sheet v-model="showRecharg" title="确认付款">
        <div class="recharge-popup">
          <div class="num">
            ￥<span class="text">{{settleInfo.payAmount}}</span>
          </div>
          <div class="info">
            <div class="details">
              <span class="title">支付方式</span>
              <span class="content">{{`${payStyle.text || '--'}支付`}}</span>
            </div>
            <van-radio-group v-model="radio">
              <van-cell-group>
                <van-cell v-for="(item, index) in selectedPayWay" :key="index" clickable @click="changeStyle(item, index)">
                  <div slot="title" class="pay-label">
                    <img class="pay-icon" v-if="item.payMode == '210'" src="../../../../../static/image/mall2/weixin.png" alt="">
                    <img class="pay-icon" v-else src="../../../../../static/image/mall2/zhifubao.png" alt="">
                    {{item.text}}支付
                  </div>
                  <van-radio @click="changeStyle(item, index)" :name="index" checked-color="#F80F16"/>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
        </div>
        <div class="re-btn" @click="nowPay">立即支付</div>
      </van-action-sheet>

      <!-- <van-popup v-model="saleTypePopup" round position="bottom" :style="{ height: '40%' }">
          <div class="card-type">
              <p class="title">温馨提示:</p>
              <div class="type-list">
                  <span v-for="(item, index) in saleTypeList" :key="index"
                      @click="handleSaleType(item)">{{item.mktActivityType}}</span>
              </div>
          </div>
      </van-popup> -->
      <van-dialog class="type-dialog" v-model="saleTypePopup" title="温馨提示" show-cancel-button :beforeClose="saleDialogOk">
        <p>当前商品支持以下促销活动,可以选择其中一种活动进行参与</p>
        <div class="type-list">
          <span :class="saleIndex == index ? 'active' : ''" v-for="(item, index) in saleTypeList" :key="index"
                @click="handleSaleType(item, index)">{{item.mktActivityType}}</span>
        </div>
      </van-dialog>
    </nav-content>
  </div>
</template>
<script>
  import Coupon from '../../../../components/mall2/common/coupon'
  import DigitalPwd from "../../../../components/mall2/common/digital-pwd"
  import payHelper from '@/utils/payHelper'
  import md5String from "@/utils/md5";

  export default {
    data() {
      return {

        skuId: '',
        storeOuCode: '',
        settleInfo: {}, // 结算信息
        usedCoupons: [], // 用户选择券
        payDigitals: [],

        ticketFileNumber: 1,
        checked: true,
        params: {},
        userPhone: '',

        DigitalPwd: '',

        showRecharg: false, // 充值页面弹框
        selectedPayWay: [], // 支付方式
        payStyle: {}, // 支付方式
        radio: '',

        fromPointsShop: true, // 积分商城进入为true   电影票进入为false
        pointsShopData: {},
        flag: true,
        userPoints: 0, // 用户积分

        activityId: '', // 活动ID
        numberDisabled: false,

        saleShow: false,
        salesTypeName: '', // 促销活动名称
        saleTypePopup: false,
        saleTypeList: [],
        saleIndex: null,
        backReloadCoupon: false,

        placeUserPhoneState: false // skuid配置项中存在的情况下 只可输入手机号
      }
    },
    mounted() {
      console.log(this.$route.query)
      console.log(this.$route)
      this.activityId = this.$route.query.activityId
      let id = this.$route.query.id
      let skuId = this.$route.query.skuId ? this.$route.query.skuId : ""
      if (id && id != '') {
        this._getDateSkuSaleDetail(id)
      } else {
        this._getDateSkuSaleDetailBySkuId(skuId)
      }

      if (this.$route.query.name != '首页') {
        this.saleShow = true
      } else {
        this.saleShow = false
      }
    },
    methods: {
      _getDateSkuSaleDetailBySkuId(skuId) {
        this.$request.post('/app/json/product/getAppProDetail', {
          skuId: skuId,
          pickupStoreOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
          deliverType: 2
        }).then(res => {
          if (res.status === 0) {
            this.params = res.data
            this.skuId = res.data.skuId
            this.storeOuCode = res.data.storeOuCode
            this.settlement()
            // this.movieTicketList = res.data.featureList
          } else {
            this.$Toast(res.info)
          }
        })
      },
      _getDateSkuSaleDetail(id) {
        this.$request.post('/app/json/product/getAppProDetail', {
          id: id,
          // pickupStoreOuCode: this.$store.state.globalConfig.trafficStoreOuCode,
          // deliverType: 2
        }).then(res => {
          if (res.status === 0) {
            this.params = res.data
            this.skuId = res.data.skuId
            this.storeOuCode = res.data.storeOuCode
            this.settlement()
            // this.movieTicketList = res.data.featureList
          } else {
            this.$Toast(res.info)
          }
        })
      },
      phonePlaceholder() {
        let SkuIdArr = []
        let txt = '请输入'
        if (this.$store.state.globalConfig.jxOrderRechargePlaceholder) {
          // xx:1,2,3/xx:1,2,3
          SkuIdArr = this.$store.state.globalConfig.jxOrderRechargePlaceholder.split('/')
          }
        if (this.params.productType == 510) {
          SkuIdArr.forEach(item => {
            if (item.split(':')[0] == this.skuId) {
              let txtArr = []
              txtArr = item.split(':')[1]
              txt += txtArr.indexOf('1') != -1 ? '手机号/' : ''
              txt += txtArr.indexOf('2') != -1 ? 'QQ号/' : ''
              txt += txtArr.indexOf('3') != -1 ? '邮箱/' : ''
            } else {
              txt = '请输入手机号/QQ号/邮箱'
            }
          })
        } else {
          txt = '请输入接收手机号'
        }

        return txt

        // let skuIdArr = []
        // let txt = ''
        // if (this.$store.state.globalConfig.jxOrderRechargePlaceholder) {
        //   skuIdArr = this.$store.state.globalConfig.jxOrderRechargePlaceholder.split(',')
        // }
        // if(this.params.productType == 510){
        //   txt = '请输入手机号/QQ号/邮箱'
        //   skuIdArr.forEach(item => {
        //     if(item == this.skuId){
        //       txt = '请输入充值手机号'
        //       this.placeUserPhoneState = true
        //     }
        //   })
        // }else{
        //   txt = '请输入接收手机号'
        // }
        // return txt
      },
      // 商品数量
      handleNumberChange(val) {
        this.settlement(val)
      },
      /** 虚拟支付 */
      settlement(number = 1) {
        let params = {
          deliveryType: '2',
          carts: [
            {
              number: number,
              skuId: this.skuId,
              storeOuCode: this.storeOuCode,
              checked: 1,
              selfActivityId: this.activityId
            }
          ]
        }
        if (this.payDigitals.length) {
          params.payDigital = this.payDigitals
        }
        if (this.usedCoupons.length) {
          params.couNo = this.usedCoupons
        }
        this.$request.post('/app/json/fee_life_order/settle', params).then(res => {
          if (res.status == 0) {
            this.settleInfo = res.data.occur[0]
            this.usedCoupons = this.settleInfo.couNo
            this.settleInfo.digitalList.forEach(item => {
              if (item.acctType == 'Points') {
                this.userPoints = item.userBalanceDigital
              }
            });

            if (this.settleInfo.store[0].noActivityCart[0].productType == 510) {
              this.numberDisabled = true
            }

            let selfActivityList = this.settleInfo.store[0].noActivityCart[0].selfActivity

            if (selfActivityList) {
              this.saleShow = true
              this.saleTypeList = []
              selfActivityList.forEach(item => {
                this.saleTypeList.push({
                  mktActivityType: item.currentSelfActivity.mktActivityType,
                  mktActivityId: item.currentSelfActivity.mktActivityId,
                })
              });
            } else {
              this.saleShow = false
            }

            if (this.settleInfo.store[0].noActivityCart[0].currentSelfActivity) {
              this.fromPointsShop = true
              this.pointsShopData = this.settleInfo.store[0].noActivityCart[0]
              this.settleInfo.amount = this.pointsShopData.price
              // this.settleInfo.payAmount = this.pointsShopData.amount - this.settleInfo.couponAmount
              if (this.userPoints >= this.pointsShopData.fixedDigital) {
                this.flag = true
              } else {
                this.flag = false
                this.$Toast('积分不足')
              }
            } else {
              this.fromPointsShop = false
            }
            this.reloadSelectedCoupon()

          } else {
            this.$Toast(res.info);
            this.reloadSelectedCoupon()
          }
        })
        // this.$request.post('/app/json/fee_life_order/settle', params).then(res => {
        //     if (res.status == 0) {
        //         this.settleInfo = res.data.occur[0]
        //         this.usedCoupons = this.settleInfo.couNo
        //         this.settleInfo.digitalList.forEach(item => {
        //             if (item.acctType == 'Points') {
        //                 this.userPoints = item.userBalanceDigital
        //             }
        //         });

        //         if (this.settleInfo.store[0].noActivityCart[0].selfActivity) {
        //             this.fromPointsShop = true
        //             this.pointsShopData = this.settleInfo.store[0].noActivityCart[0].selfActivity[0]
        //             this.settleInfo.amount = this.pointsShopData.price
        //             // this.settleInfo.payAmount = this.pointsShopData.amount - this.settleInfo.couponAmount
        //             if (this.userPoints >= this.pointsShopData.fixedDigital) {
        //                 this.flag = true
        //             } else {
        //                 this.flag = false
        //                 this.$Toast('积分不足')
        //             }
        //         } else {
        //             this.fromPointsShop = false
        //         }

        //     } else {
        //         this.$Toast(res.info);
        //     }
        // })
      },
      reloadSelectedCoupon: function () {
        if (this.backReloadCoupon == false) {
          return;
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
            // let selfActivityId = this.settleInfo.store[0].noActivityCart[0].selfActivity ? this.pointsShopData.currentSelfActivity.mktActivityId : ''
            // console.log(selfActivityId)
            this.settlement(1);
            //Coupon.close();
          }
        });
      },
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
      // 虚拟支付
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
            payDigital: digital.userCanUseDigital + digital.fixedDigital,
            userBalanceDigital: digital.userBalanceDigital
          });
          console.log(this.payDigitals, "99991");
        } else {
          let arr = [];
          for (let i = 0; i < this.payDigitals.length; i++) {
            if (this.payDigitals[i].acctType != acctType) {
              arr.push(this.payDigitals[i]);
            }
          }
          this.payDigitals = arr;
          console.log(this.payDigitals, "99992");
        }
        this.settlement();
      },
      handleSubmit() {
        if (this.flag) {
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
      submitBill() {
        // 加油订单提交接口
        if(this.$route.query.orderType != 'videoRecharge'){
          if (this.params.productType != 510 || this.placeUserPhoneState) {
            if (!this.userPhone || this.userPhone == '') {
              this.$Toast('手机号不能为空');
              return;
            }
            if (!this.$util.checkMobile(this.userPhone)) {
              this.$Toast('请填写正确手机号')
              return
            }
          }
        }


        this.$Loading.open();
        let params = {
          deliveryType: '2',
          carts: [
            {
              number: this.ticketFileNumber,
              skuId: this.skuId,
              storeOuCode: this.storeOuCode,
              checked: 1,
              selfActivityId: this.pointsShopData.currentSelfActivity ? this.pointsShopData.currentSelfActivity.mktActivityId : ''
            }
          ],
          payDigital: [],
          virtualUserPhone: this.userPhone
        }
        if(this.$route.query.orderType == 'videoRecharge'){
          params.virtualUserPhone = this.$route.query.billrecharge
        }
        if (this.payDigitals.length) {
          params.payDigital = this.payDigitals; // 虚拟支付
        } // 虚拟支付
        if (this.digitalPWD != "") {
          params.payPwd = md5String(this.digitalPWD);
        }
        // params.couNo = this.usedCoupons || [];
        console.log(params)
        if (this.pointsShopData.acctType && this.pointsShopData.fixedDigital > 0) {
          params.payDigital.push({
            acctType: this.pointsShopData.acctType,
            userBalanceDigital: this.userPoints,
            payDigital: this.pointsShopData.fixedDigital
          })
        }

        if (this.params.productType == 510) {
          params = {
            deliveryType: '2',
            virtualUserPhone: this.userPhone,
            carts: [{
              skuId: this.params.skuId,
              storeOuCode: this.params.storeOuCode,
              number: 1
            }]
          }
        }
        params.couNo = this.usedCoupons || [];
        console.log(this.params)
        this.$request.post('/app/json/fee_life_order/submit', params).then(res => {
          if (res.status === 0) {
            this.submitInfo = res.data
            if (res.data.payAmount > 0) {
              this.showRecharg = true
            } else {
              this.$Toast('支付成功')
              this.$router.go(-1)
            }
          } else {
            this.$Toast(res.info)
          }
          this.$Loading.close();
        })
        this.setPayWays()
      },
      setPayWays() {
        this.selectedPayWay = []
        payHelper.getPayWays('205001', this.storeOuCode).then(res => {
          this.selectedPayWay = res || []
          if (this.selectedPayWay.length > 0) {
            this.radio = 0
            this.payStyle = this.selectedPayWay[0];
          }
        })
      },
      nowPay() {
        if (this.radio !== '') {
          this.pay()
        } else {
          this.$Toast('请选择支付方式')
        }
      },
      pay() {
        if (this.payStyle == null) {
          this.$Toast("请选择支付方式！")
          return;
        }
        payHelper.trafficPayEvent(this.payStyle, this.submitInfo.orderType, this.submitInfo.orderId).then(() => {
          this.enterSuccess()
        }).catch(() => {
        })
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
      changeStyle(item, index) {
        // 选择支付方式
        this.radio = index
        this.payStyle = item
      },

      // 选择促销活动
      saleCouponHandle() {
        this.saleTypePopup = true
      },
      handleSaleType(item, index) {
        this.saleIndex = index
        this.salesTypeName = item.mktActivityType
        this.activityId = item.mktActivityId
      },
      saleDialogOk(action, done) {
        if (action === 'confirm') {
          done()
        } else if (action === 'cancel') {
          this.saleIndex = null
          this.salesTypeName = ''
          this.activityId = ''
          done()
        }
        this.settlement()
        // this.saleTypePopup = false
      }
    },
  }
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  @import '~@/common/stylus/variable.styl';
  @import '../asset/recharge.styl';

  .movietickerorder {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .movieTicket-order {
      .recharge-popup {
        padding: 11px 15px;
        height: 350px;

        .num {
          text-align: center;
          font-weight: bold;
          padding: 20px 0;

          .text {
            font-weight: bold;
            font-size: 34px;
          }
        }

        .info {
          .details {
            padding: 15px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            border-bottom: 0.5px solid #ecebeb;

            .title {
              color: $color-text-l;
            }
          }
        }
      }

      .movieTicket-order-content {
        position: absolute;
        top: 0px;
        right: 0px;
        left: 0px;
        bottom: 50px;
        padding: 10px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;

        .red {
          color: red;
        }

        .order-item {
          display: flex;
          // height: 30px;
          padding: 5px 0;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;

          // line-height: 35px;

          .title {
            width: 30%;
          }

          .item-right {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex: 1;
            line-height: 20px;

            p {
              padding-right: 10px;
            }
          }

          .inp {
            flex: 1;
            width: 100%;

            input {
              width: 100%;
              line-height: 25px;
              background-color: #fff;
            }
          }
        }

        .order-infomation, .price-infomation, .order-user-info, .sales-promotion {
          box-shadow: 0 0px 5px #ccc;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        .sales-promotion {
          .order-item {
            .right {
              display: flex;
              align-items: center;

              span {
                margin-right: 10px;
              }
            }
          }
        }

        .fictitious-pay {
          box-shadow: 0 0px 5px #ccc;
          border-radius: 5px;
          margin-bottom: 20px;

          .virtual-payment {
            position: relative;

            // height: 200px;

            .flex-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 30px;
              padding: 0 10px;

              .right-margin {
                color: #515151;
              }
            }

            .red {
              color: red;
            }

            .payment-title {
              font-size: 14px;
              width: 26%;
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
              padding: 0 10px;
            }
          }
        }
      }

      .order-submit {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        box-shadow: 0 0 2px #ede9e9;
        background: #fff;

        .price {
          line-height: 50px;
          padding-left: 10%;
          color: red;

          span {
            font-size: 16px;
          }
        }

        .sub-btn {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 30%;
          border: none;
          background: #ec4646;
          color: #fff;
          font-size: 14px;
        }

        .sub-btn-color {
          background: #ccc;
        }
      }
    }
  }

  /deep/ .van-action-sheet--withtitle {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .pay-label {
    display: flex;
    align-items: center;

    .pay-icon {
      width: 25px;
      margin-right: 10px;
    }
  }

  /deep/ .van-radio {
    display: inline-block;
  }

  .van-hairline--top-bottom::after {
    display: none;
  }

  input:disabled {
    background: #fff;
  }

  .re-btn {
    text-align: center;
    background: $color-theme-r;
    color: #fff;
    font-size: 16px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    height: 44px;
    line-height: 44px;
  }

  .tips {
    .title {
      font-size: 14px;
      padding-bottom: 10px;
    }

    .content {
      font-size: 12px;
      line-height: 22px;
      color: $color-text-d;
    }
  }

  .type-dialog {
    .type-list {
      text-align: center;
      margin-top: 20px;

      span {
        border: 1px solid #ccc;
        padding: 7px 45px;
        border-radius: 10px;
        display: inline-block;
        font-size: 14px;
        margin-bottom: 20px;
        width: 51%;
      }

      .active {
        border-color: red;
        color: red;
      }
    }
  }

  /deep/ .van-dialog__content {
    padding: 20px 10px;
  }
</style>
