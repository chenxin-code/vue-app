<template>
  <div class="firmorder">
    <!-- header -->
    <nav-top title="确认账单" @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="firm" v-if="settleInfo">
        <div class="firm-one">
          <p>
            <img src="./images/icon_GasStation.png" alt/>
            <span>{{oilName}}</span>
          </p>
          <p v-if="!$route.query.comeFromPage">
            <img src="./images/icon_OilGun.png" alt/>
            <span>{{settleInfo.refuelGunNo}}号油枪</span>
          </p>
          <p>
            <img src="./images/icon_oil.png" alt/>
            <span>{{tankOilName}}</span>
          </p>
        </div>
        <div class="firm-two">
            <p v-if="!$route.query.comeFromPage">
              <span>TTC</span>
              <span>{{$route.query.posTtc}}</span>
            </p>
            <p v-if="!$route.query.comeFromPage">
              <span>加油时间</span>
              <span>{{settleInfo.refuelTakeDate}}</span>
            </p>
            <p v-if="!$route.query.comeFromPage">
              <span>加油升数</span>
              <span>{{settleInfo.refuelLiter}}L</span>
            </p>
        </div>
        <div class="firm-two">
          
          <p>
            <span>加油金额</span>
            <span v-if="$route.query.comeFromPage">￥{{ $route.query.amount }}</span>
            <span v-else>￥{{settleInfo.amount && settleInfo.amount.toFixed(2)}}</span>
          </p>
          <!-- <p class='qy-pay' v-if='showQyPay' >
            <span>企业加油</span>
            <van-switch active-color="#f02c2d" @change='changeQyPay' size="20px" v-model="supportCompany" />
          </p> -->
          <p v-if="!source" class="coupon-item" @click="chooseCoupon">
            <template v-if="settleInfo">
              <span>加油券</span>
              <span v-if="settleInfo.couponAmount != 0">￥{{settleInfo.couponAmount || 0}}</span>
              <span v-if="settleInfo.couponAmount == 0 && settleInfo.userCanUseCoupon.length != 0">有可用券</span>
              <span v-if="settleInfo.couponAmount == 0 && settleInfo.userCanUseCoupon.length == 0">无可用券</span>
              <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
            </template>
          </p>
          <p v-if='settleMobelAmount(settleInfo.thirdDiscountAmount,settleInfo.thirdDiscountAmount2)'>
            <span>移动优惠金额</span>
            <span>￥{{settleMobelAmount(settleInfo.thirdDiscountAmount,settleInfo.thirdDiscountAmount2)}}</span>
          </p>
          <!-- 虚拟支付 start -->
          <!--digitalList 虚拟支付列表-->
          <div v-for="(item, index) in digitalListFinal" :key="index">
            <!--deductionState 抵扣状态，为0是不可用，不需要展示,acctType为Enterprise是虚拟支付不需要展示-->
            <div class="flex-row" v-if="item.deductionState != 0 && item.acctType !== 'Enterprise'">
              <div class="label-middle theme_font_common inline_block">{{getDigitalDisplayName(item.acctType)}}</div>
              <template v-if="getDigitalDisplayUnit(item.acctType) == '元'">
                <!--                是否能够使用虚拟支付  用户能够使用的虚拟支付额度userCanUseDigital-->
                <!--                userBalanceDigital 用户拥有的额度-->
                <div class="right-margin inline_block" v-if="item.userCanUseDigital > 0">
                  余额：{{item.userBalanceDigital}}元，可用{{item.userCanUseDigital}}元
                </div>
                <div class="right-margin inline_block" v-else>
                  余额：{{item.userBalanceDigital}}元，{{getCanNotUseStr(item.deductionState)}}，不能使用
                </div>
              </template>
              <!-- 单位不一样，展示效果不同-->
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
                <img v-if="item.payDigital > item.fixedDigital" src="static/image/mall2/switch-on.png"
                     style="width:25px"/>
                <img v-if="item.payDigital <= item.fixedDigital" src="static/image/mall2/switch-off.png"
                     style="width:25px"/>
              </div>
            </div>
          </div>
          <!--         isMeetCondition = 1 满足条件  isMeetCondition != 1 不满足活动条件-->
          <div class="flex-row" v-if="activity && activity.isMeetCondition == 1">
            <div class="label-middle theme_font_common inline_block">{{activity.mktActivityTitle}}</div>
            <div class="swith inline_block" @click="openActive()">
              <img v-if="activityId == -1" src="static/image/mall2/switch-off.png"
                   style="width:25px"/>
              <img v-else src="static/image/mall2/switch-on.png"
                   style="width:25px"/>
            </div>
          </div>
          <!-- 虚拟支付 end -->
          <p v-if="settleInfo.discountAmount && settleInfo.discountAmount > 0">
            <span>优惠金额</span>
            <span>- ￥{{settleInfo.discountAmount && settleInfo.discountAmount.toFixed(2)}}</span>
          </p>
          <p v-if='sumAmount(settleInfo.mktMoneyOffModelList)'>
            <span>活动累计加油升数</span>
            <span>{{sumAmount(settleInfo.mktMoneyOffModelList)}}L</span>
          </p>
        </div>
        <div class='cul-tip' v-if='showClu' @click='ruleFlag = true'>
          <span>网约车认证无优惠</span>
          <van-icon name="question-o" />
        </div>
        <!-- 先享卡 -->
        <div class="priority-card" v-if='enjoyCardType == 2'>
          <div class='card-left'>
            <p class='title'>领先享卡立减5元</p>
            <p class='info'>微信支付分|信用优享</p>
          </div>
          <van-button round type="info" color='rgba(240, 44, 45, 1)' size='small' @click='getCard'>立即领卡</van-button>
        </div>
        <div class="priority-card" v-else-if='enjoyCardType == 1'>
          <van-button round type="info" p color='rgba(240, 44, 45, 1)' size='small'>{{item1.state | state}}</van-button>
          <span>已完成{{item1.completeCnt || 0}}次，待完成{{unDone(item1.objectiveCnt,item1.completeCnt)}}次</span>
        </div>
        <!-- 推荐人 -->
        <div class="recommend" v-if="recommendDisabled && !isScan">
          <span class="label">推荐人</span>
          <input type="text" placeholder="请输入推荐码" v-model="referrer" :disabled="!canEditReferrer" class="form-control">
          <img src="static/image/setting/icon-scan.png" @click="scanCodeFunc" class="scan-code"
               v-show="canEditReferrer"/>
        </div>
        <!-- 是否显示企业预付款支付 -->
        <div class='qy' v-if='showQyPay'>
           <van-cell-group :class="{sel:supportCompany }">
              <van-cell
                clickable
                title="企业预付款支付"
                label="企业预付款支付不支持个人支付优惠"
                :value="'余额：￥'+qyAmount"
                @click="toggle"
              >
                <template #right-icon>
                  <van-checkbox v-model="supportCompany"  checked-color="#f02c2d" icon-size='14' ref="checkboxes" />
                </template>
              </van-cell>
            </van-cell-group>
        </div>
        <pay-mode  ref="payModeRef" :supportCompany='supportCompany' @setPayWay="setPayWays"></pay-mode>
        <div class="virtual-tip" v-if="$store.state.globalConfig.oilPayOrderVirtualDes">
          温馨提示：{{$store.state.globalConfig.oilPayOrderVirtualDes}}
        </div>
        <div class="footer">
          <p class="tip">请核对账单进行支付</p>
          <div class="btn-wrapper">
            <span class="price"><i class="unit">￥</i><span class="num">{{supportCompany ? settleQyAmount : settleAmount}}</span></span>
            <span class="btn" @click="submitSel">确认支付</span>
          </div>
          <!--<p class="btn" @click="payBill">确认支付</p>-->
        </div>
      </div>
      <!-- 确认支付账单 -->
      <div class="confirm-pay-modal" v-if="showModal">
        <div class="modal-content">
          <div class="modal-title">确认支付？</div>
          <div class="firm-two">
            <p>
              <span>支付方式</span>
              <span>{{selectedPayWay.text}}</span>
            </p>
            <p>
              <span>金额</span>
              <span>￥{{settleInfo.amount && settleInfo.amount.toFixed(2)}}</span>
            </p>
            <p v-if="!$route.query.comeFromPage">
              <span>加油时间</span>
              <span>{{settleInfo.refuelTakeDate}}</span>
            </p>
            <p v-if="!$route.query.comeFromPage">
              <span>加油升数</span>
              <span>{{settleInfo.refuelLiter}}L</span>
            </p>
        
            <p v-if="settleInfo.couponAmount">
              <span>加油券抵扣</span>
              <span>- ¥{{settleInfo.couponAmount || 0}}</span>
            </p>
            <p
              v-for="(item9, index9) in settleInfo.digitalList"
              :key="index9"
              v-if="item9.digitalAmount != 0"
            >
              <span>{{getDigitalDisplayName(item9.acctType)}}支付抵扣</span>
              <span>- ¥{{item9.digitalAmount}}</span>
            </p>
            <p v-if="settleInfo.discountAmount && settleInfo.discountAmount > 0">
              <span>优惠金额</span>
              <span
                class="theme_font_red"
              >- ￥{{settleInfo.discountAmount && settleInfo.discountAmount.toFixed(2)}}</span>
            </p>
            <p v-if='settleMobelAmount(settleInfo.thirdDiscountAmount,settleInfo.thirdDiscountAmount2)'>
              <span>移动优惠金额</span>
              <span>￥{{settleMobelAmount(settleInfo.thirdDiscountAmount,settleInfo.thirdDiscountAmount2)}}</span>
            </p>
            <p>
              <span>应付金额</span>
              <span
                class="theme_font_red"
              ><span>￥</span>{{settleAmount}}</span>
            </p>
          </div>
          <div class="firm-three">
            <p class="btn cancel-btn" @click="showModal = false">否</p>
            <p class="btn" @click="submitOrder">是</p>
          </div>
        </div>
      </div>
      <!-- 企业支付需要由加油员输入手机号进行验证 -->
      <div class="confirm-pay-modal" v-if='showQyModal'>
        <div class="modal-content">
          <div class="modal-title">请确认车牌号</div>
          <div class="firm-two">
            <p>
              加油车牌号码：
            </p>
            <div class="carNum">
              {{qySettleInfo.plateNumber || '暂无'}}
            </div>
            <p style='font-size: 13px;margin-bottom: 20px;'>
              请核对加油车辆，并输入加油员服务号码
            </p>
            <div class='pwd'>
              <van-password-input
                :value='qyPayValue'
                :length="11"
                :mask='false'
                :focused="showKeyboard"
                @focus="showKeyboard = true"
              />
              
            </div>
          </div>
          <div class="firm-three">
            <p class="btn cancel-btn" @click="showQyModal = false">取消</p>
            <p class="btn" @click='submitOrder'>确认</p>
          </div>
        </div>
      </div>
      <!-- 企业预付款支付弹窗，弹窗内所有逻辑走企业支付相关的结算流程 -->
      <van-popup v-model="showPopup" round  position="bottom" :class="{'two-zindex': showQyModal}" closeable :style="{ height: '40%' }">
        <div class="pop-content">
          <div class="order-title">
            企业预付款支付
          </div>
          <div class="qy-order">
            <p>
              企业预付款支付
            </p>
            <p>
              余额：￥{{qyAmount}}
            </p>
          </div>
          <div class="qy-order"  @click="chooseCoupon">
            <p>
              企业优惠券支付
            </p>
            <p>
              <template v-if="qySettleInfo">
                <span v-if="qySettleInfo.couponAmount != 0">￥{{qySettleInfo.couponAmount || 0}}</span>
                <span v-if="qySettleInfo.couponAmount == 0 && qySettleInfo.userCanUseCoupon.length != 0">有可用券</span>
                <span v-if="qySettleInfo.couponAmount == 0 && qySettleInfo.userCanUseCoupon.length == 0">无可用券</span>
                <i class="iconfont mall-gengduo more-icon theme_font_tint"></i>
              </template>
            </p>
          </div>
        </div>
        <div class="qy-submit">
            <p>
              实付金额：
              <span class="price"><i class="unit">￥</i><span class="num">{{settleQyAmount}}</span></span>
            </p>
          <div @click='showQyModal = true'>确认支付</div>
        </div>
      </van-popup>
      <!-- 输入手机号验证键盘 -->
      <van-number-keyboard
      v-model="qyPayValue"
      @input="inputPhone"
      :show="showKeyboard"
      @blur="showKeyboard = false"
    />
        <!--山西优惠弹窗  -->
      <van-dialog v-model="ruleFlag" confirm-button-text="我知道了" title="网约车加油优惠规则">
        <div class='rule-content' v-html='showCluDom'></div>
      </van-dialog>
    </nav-content>
  </div>
</template>
<script>
  import Coupon from "../../mall2/common/coupon";
  import wxfunc from "@/utils/wxfunc";
  import logCenter from "@/utils/logCenter";
  import payHelper from "@/utils/payHelper";
  import DigitalPwd from "../../mall2/common/digital-pwd";
  import md5String from "@/utils/md5";
  import checkPayResult from "./mixins/checkPayResult";
  import PayMode from './components/pay-mode'
  import {Dialog} from 'vant';

  export default {
    mixins: [checkPayResult],
    data() {
      return {
        settleInfo: null, // 结算信息
        isMutex: false, // 是否互斥
        digitalList: [], // 展示使用
        showModal: false,
        usedCoupons: [], // 用户选择的券
        supportCompany: false, //企业支付
        showQyPay: false, //是否显示企业支付
        showQyModal: false, // 是否显示加油员服务码弹窗
        showKeyboard: false, //企业支付输入框
        
        couponList: [],
        tankOilName: "",
        oilName: "",
        selectedPayWay: null,
        payWay: [],
        payDigitals: [],
        digitalPWD: "",
        referrer: '',
        canEditReferrer: true,
        mutexChecked: false, // 互斥的时候选择券还是虚拟支付，true 选择券
        promote_is_mutex: false, // 促销与虚拟支付方式是否互斥  默认互斥
        activityId: '', // -1代表不参加
        activity: null, // 活动
        backReloadCoupon: false,
        hasToPay: false,
        sumPay: 0,
        clusterIds: '',
        enjoyCardType: null,
        item2: {},  //先享卡领卡显示逻辑-未领卡状态
        item1: {}, //先享卡领卡显示逻辑-已领卡状态
        ruleFlag: false, //是否显示山西网约车优惠规则弹窗
        showCluDom: '', // 山西网约车优惠规则文本
        qyAmount: 0, //企业余额
        qyDialog: true, //企业弹窗默认为true
        showPopup: false, //拉起企业支付弹窗
        orderCategory: 0, // 必传参数，0为第三方支付，3为企业支付
        qyPayAmount: 0, //企业支付金额
        source: '', // offline 云南离线支付入口
        payData: {}, // 提交订单后的预支付信息
        qySettleInfo:{}, // 企业订单相关信息
        qyDigitalList: [], // 企业支付信息，展示用
        qyPayDigital: [], //企业支付信息
        qyUsedCoupons: [], //用户选择的企业券
        qyPayValue: '', //企业支付匹配手机号
      };
    },
    components: {
      Coupon,
      PayMode
    },
    computed: {
      // 虚拟支付展示效果，前提条件为互斥情况，并且选择了券，显示this.digitalList，如果当前选择的是虚拟支付，则正常显示this.settleInfo.digitalList
      digitalListFinal() {
        //互斥的情况并且虚拟支付为空
        const f = (this.isMutex && this.mutexChecked)
        return f ? this.digitalList : (this.settleInfo ? this.settleInfo.digitalList : [])
      },
      recommendDisabled() {
        return this.$store.state.globalConfig.recommendRefuelDisabled != 1
      },
      // 是否展示山西促销活动优惠规则，专门为山西
      showClu() {
        let flag = true;
        let clusterIds
        if (Array.isArray(this.clusterIds)) {
          clusterIds = this.clusterIds
        } else {
          console.log(this.clusterIds,'cluds')
          clusterIds = this.clusterIds ? this.clusterIds.split(",") : "";
        }
        let onlinecar = this.$store.state.globalConfig.onlinecar_hailingprotocol
        let occupation = this.$store.state.globalConfig.occupation_group_id;
        if(!clusterIds.includes(occupation) || (onlinecar == 0) || (this.settleInfo.discountAmount !== 0)) {
          flag = false;
        }
        return flag;
      },
      isScan() {
        return !!this.$route.query.comeFromPage
      },
      // 支付金额
      settleAmount() {
        if(this.settleInfo) {
          return this.settleInfo.payAmount ? this.settleInfo.payAmount.toFixed(2) : 0;
        }
      },
      // 企业支付金额
      settleQyAmount() {
        return this.qyPayAmount ? this.qyPayAmount.toFixed(2) : 0;
      }
    },
    created() {
      // 填写默认推荐人(相对时间内)
      this.initPage = false
      // 通过接口获取推荐人， login.js
      if (this.$store.state.globalConfig.rfrCodeType && this.$store.state.rfrCodeMap) {
        // bindCardReferrer;//绑卡推荐人  orderReferrer;//订单推荐人 regReferrer;//注册推荐人 lastReferrer;//最后的推荐人
        this.referrer = this.$store.state.rfrCodeMap[this.$store.state.globalConfig.rfrCodeType]
      }

      this.canEditReferrer = this.$store.state.globalConfig.appCanEditReferrer == 1 || !this.referrer
      // 山西网约车优惠文案
      this.$http.post("/app/json/news/getNewsList?values=73").then(res=>{
        let data = res.data;
        if(data.status == 0) {
          if(data.data[0]){
            this.showCluDom = data.data[0].content;
          }
        } else {
          this.$toast(res.info)
        }
      })
      // 先享卡跳转小程序领卡页面，接口
      if(this.$store.state.globalConfig.wx_discount_card_display == 1) {
        this.collectCard()
      }
      
    },
    mounted() {
      this.$userCenter._getUserBehalf((data)=>{
        this.clusterIds = data.clusterIds || "";
      })
      this.source = this.$route.query.source
      this.gunNo = this.$route.query.gunNo;
      this.ouCode = this.$route.query.ouCode;
      this.uniCode = this.$route.query.uniCode;
      this.recordId = this.$route.query.recordId;
      this.tankOilName = this.$route.query.tankOilName;
      this.oilName = this.$route.query.oilName;
      this.isMutex = this.$store.state.globalConfig.order_refuel_virtual_pay_is_mutex != 'false'
      this.promote_is_mutex = this.$store.state.globalConfig.order_refuel_promote_virtual_pay_is_mutex != 'false'
      this.settlement();
      // 互斥条件下默认选择券，导致虚拟支付不展示，需要再次调用结算接口展示虚拟支付
      if (this.isMutex) {
        this.settlement(1)
      }
      this.orderType = '100005';
      if (this.$route.query.comeFromPage) {
        this.orderType = '100002'
      }
      if (this.source == 'offline') {
        this.orderType = '200001010'
      }
      // if (this.promote_is_mutex) this.settlement(2)// this.getDictByAlias();
      if (this.$store.state.webtype == 2) {
        let recommend = sessionStorage.getItem("recommendPhone");
        if (recommend && recommend.length) {
          this.referrer = recommend;
          this.canEditReferrer = false;
        }
      }
    },
    methods: {
      checkCouponPrice: function (callback) {
        if (this.settleInfo.cashCouponFaceValue > this.settleInfo.cashCouponAmount) {
          this.$MessageBox.confirm('您的优惠券金额比订单金额大，确定使用吗？', '提示', {confirmButtonText: '确定'}).then(action => {
            callback()
          }).catch(action => {
          });
        } else {
          callback()
        }
      },
      // 先享卡完成次数
      unDone(un = 0,done = 0) {
        let unNum = un || 0;
        let doneNum = done || 0;
        return unNum - doneNum;
      },
      openActive() {
        this.activityId = this.activityId == -1 ? '' : -1
        this.orderCategory = 0;
        this.settlement()
      },
      // 判断是否显示先享卡
      collectCard() {
        let obj = {
          token: this.$store.state.login.token,
          orderType: 100005
        }
        this.$http.post("/app/json/wx_discount_card/getOrderEndDisplay",obj).then(res=>{
          console.log(res,'res')
          let data = res.data;
          if(data.status == 0) {
            if(data.data.item1) {
              this.enjoyCardType = 1;
              this.item1 = data.data.item1 || {}
            } else if(Array.isArray(data.data.item2) && data.data.item2.length) {
              this.enjoyCardType = 2
              this.item2 = data.data.item2[0] || {}
            }
          }
        })
        
      },
      getCard() {
        // 跳转先享卡的入口
        let obj = {
          discountCardId: this.item2.id
        }
        this.$http.post("/system/json/wx_discount_card/applyDiscountCard",obj).then(res=>{
          let data = res.data;
          if(data.status == 0) {
            if(data.data && data.data.prepare_card_token) {
                wx.navigateToMiniProgram({
                  appId: 'wxcc2e4fbc5887661e',
                  path: `/pages/get-card/get-card?prepare_card_token=${data.data.prepare_card_token}`
                })
            } else {
              this.$toast("未获取到先享卡分享地址token")
            }
          } else {
            this.$toast(data.info)
          }
        })
        
      },
      changeQyPay() {
        this.settlement()
      },
      inputPhone(val) {
        this.$nextTick(()=>{
          
         if(this.qyPayValue.length == 11) {
           this.showKeyboard = false
         }
        })
      },
      qyPayOrder() {
        if(!this.$util.checkMobile(this.qyPayValue)){
          this.$toast('请输入正确的手机号码');
          this.qyPayValue = ''
          return;
        }
        this.showQyModal = false;
        this.showPopup = true;
      },
      toggle(val) {
        if(this.qyAmount < this.settleInfo.payAmount) {
          this.$toast("企业余额不足，请选择其他支付方式")
          return;
        }
        this.$refs.checkboxes.toggle();
        this.$nextTick(() => {
          this.$refs.payModeRef.init(this.orderType, this.ouCode)
        })
          
      },
      settleMobelAmount(val1, val2) {
        let num = val1 ? val1 : 0;
        let num2 = val2 ? val2 : 0;
        return num + num2
      },
      confirmPay() {
        // 是否是企业支付
        if (!this.supportCompany) {
          // 如果没有选择支付方式
          if(!this.selectedPayWay) {
            this.$Toast("请选择支付方式！");
            return;
          }
          this.showModal = true;
        } else {
          this.showPopup = true
        }
      },
      sumAmount(arr) {
        let litre = 0;
        if (Array.isArray(arr) && arr.length) {
          if (arr[0].sumOilLiter) {
            litre = Math.round(arr[0].sumOilLiter)
          }
        }

        return litre
      },
      backEvent: function () {
        this.$router.go(-1);
      },
      settlement(state) {
        /*
          state状态：1为非企业支付的结算状态，只是为了显示用，2为企业支付状态
        */
        this.$Loading.open();
        let url = "/app/json/refuel_center/settle";
        let p = {};

        if (this.$route.query.comeFromPage) { // 扫码支付进入 1
          url = '/app/json/refuel_scan_code/settle'
          p = {
            token: this.$store.state.login.token,
            tankOilNo: this.$route.query.tankOilNo,
            amount: this.$route.query.amount,
            kshopOrgid: this.$route.query.kshopOrgid || '',
            kshopGasoilno: this.$route.query.kshopGasoilno || '',
            rfrCode: this.$route.query.rfrCode || '',
          }
        } else {
          p = {
            token: this.$store.state.login.token,
            ouCode: this.ouCode,
            uniCode: this.uniCode,
            recordId: this.recordId,
            gunNo: this.gunNo
          }
        }
        // 企业支付切换
        p.orderCategory = this.orderCategory
        if (state == 1) { // 单独加载虚拟支付
          p.payDigital = [
            {"acctType": "Points", "payDigital": 0},
            {"acctType": "Rewards", "payDigital": 0},
            {"acctType": "EmpRewards", "payDigital": 0},
            {"acctType": "LimitWallet", "payDigital": 0},
            {"acctType": "Enterprise", "payDigital": 0},
            {"acctType": "Elec", "payDigital": 0}
          ]
          p.couNo = ['-1']
          p.activityId = -1
        } else if(state == 2){ // 企业支付结算
          p.payDigital = this.qyPayDigital
          // 企业支付使用券
          if(this.qyUsedCoupons.length) {
            p.couNo = this.qyUsedCoupons;
          } else {
            p.couNo = ['-1']
          }
          
          p.activityId = -1
        }else {
          if (this.activityId == -1) { // 不参加活动
            p.activityId = -1
          } else if (this.activityId == '' && this.activity && this.activity.isMeetCondition == 1) { // 参加活动，活动存在并且满足条件
            if (this.promote_is_mutex) { // 互斥的情况
              this.usedCoupons = [] // 初始化清空券状态
              this.payDigitals = []
            }
          }
          if (this.usedCoupons.length && !this.usedCoupons.includes('-1')) { // 选择券的情况
            if (this.isMutex) { // 如果互斥并选择了券，那么虚拟支付清空
              this.payDigitals = []
            }
          }
          p.payDigital = this.payDigitals
          p.couNo = this.usedCoupons;
        }

        this.$http.post(url, p).then(res => {
          let data = res.data;
          
          if (data.status == 0) {
           
            if (state == 1) {
              this.digitalList = data.data.digitalList // 展示用
            } else if(state == 2){ //企业支付逻辑
              this.qySettleInfo = data.data;
              this.qyDigitalList = data.data.digitalList // 展示用
              // 是否有企业券
              if (this.qySettleInfo.couNo && this.qySettleInfo.couNo.length) {
                this.qyUsedCoupons = this.qySettleInfo.couNo;
              }
              // this.reloadSelectedCoupon()
            } else {
              
              this.settleInfo = data.data;
              this.occurOuCode = data.data.ouCode;
              // 是否支持企业支付
              this.showQyPay = data.data.supportCompany
              
              if (this.settleInfo.couNo && this.settleInfo.couNo.length) {
                this.usedCoupons = this.settleInfo.couNo;
              }
              if (!this.initPage) { // 赋值一次
                this.initPage = true
                this.activity = data.data.activity && data.data.activity[0]
                // 初始化时结算的虚拟支付
                const digitalList = data.data.digitalList || []
                
                for (let item of digitalList) {
                  if (item.payDigital > item.fixedDigital) {
                    this.payDigitals.push(item)
                    break
                  }
                }
              }
              if (data.data.activity && data.data.activity.length && this.promote_is_mutex) {
                // this.settlement(2)
              }
              this.mutexChecked = !!(this.usedCoupons.length && !this.usedCoupons.includes('-1'));

              if (!this.selectedPayWay) {
                const ouCode = this.$route.query.comeFromPage ? this.occurOuCode : this.ouCode
                this.$nextTick(() => {
                  this.$refs.payModeRef.init(this.orderType, this.ouCode)
                })
              }
              // 企业支付功能
              
            }
            // 判断支持企业支付需要再次调用一次结算
            if(data.data.supportCompany && this.sumPay == 0 && data.data.digitalList.length) {         
              this.sumPay = 1;
              // orderCategory 为3代表企业支付结算
              this.orderCategory = 3;
               this.settlement(2)
            }
            // 下面分支是判断初始企业支付逻辑的，supportCompany如果为true则代表支持企业支付，digitalList是企业支付具体逻辑，state如果为2则代表当前这次结算专门针对企业支付
            if(data.data.supportCompany && data.data.digitalList.length && state == 2) {
              // 如果当前是企业支付逻辑还再次需要判读当前的企业金额是否大于支付订单金额，如果大于则处于企业支付状态，否则再次回到普通支付状态
                data.data.digitalList.forEach(item=>{
                  if(item.acctType == 'Enterprise') {
                    // 企业余额
                    this.qyAmount = item.userBalanceDigital;
                    // 企业支付的订单金额
                    this.qyPayAmount = item.userCanUseDigital;
                    // 企业支付金额
                    this.qyPayDigital = [{"acctType": item.acctType, "payDigital": item.userCanUseDigital}]
                  }
                })
                // 如果企业余额小于可支付订单金额，并且payAmount不为0，则不能支付
                
                if(!this.qyAmount || (this.qyAmount < this.qyPayAmount) || data.data.payAmount) {
                  this.orderCategory = 0;
                  // 关闭企业支付入口
                  this.supportCompany = false;
                } else {
                  // 支持企业支付，默认打开企业支付
                  this.supportCompany = true;
                  // 置空第三方支付
                  this.$nextTick(() => {
                    this.$refs.payModeRef.init(this.orderType, this.ouCode)
                  })
                }
            }
          } else {
            this.$Toast(data.info);
          }
          this.$Loading.close();
          this.reloadSelectedCoupon()
        });
      },
      submitBill() {
        this.showPopup = false;
        this.showQyModal = false;
        // 加油订单提交接口
        this.$Loading.open();
        let url = "/app/json/refuel_center/submit";
        let paramsData = {};
        if (this.$route.query.comeFromPage) { // 扫码支付进入 1
          url = '/app/json/refuel_scan_code/submit';
          paramsData = {
            token: this.$store.state.login.token,
            tankOilNo: this.$route.query.tankOilNo,
            amount: this.$route.query.amount,
          }
        } else {
          paramsData.token = this.$store.state.login.token;
          paramsData.ouCode = this.ouCode;
          paramsData.uniCode = this.uniCode;
          paramsData.recordId = this.recordId;
          paramsData.activityId = this.activityId;
          paramsData.gunNo = this.gunNo;
          //推荐人
          if (this.referrer && this.referrer.length) {
            paramsData["rfrCode"] = this.referrer;
            // 1 手动输入  2扫一扫
            if (this.referrer == this.scanCode) {
              paramsData["rfrCodeType"] = 2;
            } else {
              paramsData["rfrCodeType"] = 1;
            }
          }
        }

        // 如果是企业支付，需要添加字段
          if (this.showQyPay &&this.supportCompany) {
            paramsData.orderCategory = 3
            paramsData.empPhone = this.qyPayValue;
          } else {
            paramsData.orderCategory = 0
          }
        

        paramsData.kshopOrgid = this.$route.query.kshopOrgid || ''
        paramsData.kshopGasoilno = this.$route.query.kshopGasoilno || ''
        if (this.$route.query.rfrCode) {
          paramsData.rfrCode = this.$route.query.rfrCode
        }
        paramsData.couNo = this.usedCoupons.includes('-1') ? [] : this.usedCoupons;
        if(this.supportCompany) {
          paramsData.couNo = this.qyUsedCoupons.includes('-1') ? [] : this.qyUsedCoupons;
        }
        paramsData.activityId = this.activityId
        paramsData.orderScene = payHelper.queryOrderScene() // 下单场景

        if (this.payDigitals.length) {
          paramsData.payDigital = this.payDigitals; // 虚拟支付
        } // 虚拟支付

        // 企业企业虚拟支付
        if(this.showQyPay &&this.supportCompany) {
          paramsData.payDigital = this.qyPayDigital
        }
        if (this.digitalPWD != "") {
          paramsData.payPwd = md5String(this.digitalPWD);
        }

        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            console.log(res.data, "第一步res.data");
            let data = res.data;
            if (data.status == 0) {
              this.hasToPay = true
              this.payTime = (new Date()).getTime()
              this.payData = data.data || {}
              this.payBill(data.data);
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
        console.log(payData,'098')
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
        if (payData.payAmount == 0) { // 虚拟支付完 实付金额为0， 直接跳转成功页面
          this.resultHand("1", payData);
          return
        }
        const fn = this.$route.query.comeFromPage ? 'refuelScanPayEvent' : 'refuelPayEvent'
        payHelper[fn](this.selectedPayWay, payData.orderType, payData.orderId).then(() => {
          // app走接口回调的操作
          this.resultHand("1", payData);
        }, () => {
          this.resultHand("0", payData);
        })
        // if (this.$store.state.webtype != 1) {
        //   this.checkPayResult()
        // }
      },
      resultHand(result, payData) {
        this.$Loading.close();
        console.log('加油支付结果', result)
        console.log('comeFromPage', this.$route.query.comeFromPage)
        logCenter.addLog("支付结果", result ? "成功" : "失败");
        if (result == "1") {
          try {
            this.$router.replace({
              path: this.isScan ? '/firmScanDetail' : '/firmDetail',
              query: {
                orderType: payData.orderType,
                orderId: payData.orderId,
                fromPage: 1,
                source: this.source
              }
            })
          } catch (e) {
            console.log(e)
          }
        } else {
          let cancelUrl = "/app/json/refuel_center/cancelOrder";
          if (this.$route.query.comeFromPage) {
            cancelUrl = '/app/json/refuel_scan_code/cancelOrder'
          }
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
      reloadSelectedCoupon: function () {

        if (this.backReloadCoupon == false) {
          return;
        }
        this.backReloadCoupon = false
        const settleInfo = this.showPopup ? this.qySettleInfo : this.settleInfo;
        const usedCoupons = this.showPopup ? this.qyUsedCoupons : this.usedCoupons;
        for (let i = 0; i < settleInfo.userCanUseCoupon.length; i++) {
          let couNo1 = settleInfo.userCanUseCoupon[i].couNo;
          settleInfo.userCanUseCoupon[i].selected = false;
          for (let j = 0; j < usedCoupons.length; j++) {
            if (usedCoupons[j] == couNo1) {
              settleInfo.userCanUseCoupon[i].selected = true;
            }
          }
        }
        Coupon.reloadSelectedCoupon(settleInfo.userCanUseCoupon, [], settleInfo.userCanUseWhenNotSelectCoupon)
      },
      chooseCoupon() {
        const settleInfo = this.showPopup ? this.qySettleInfo : this.settleInfo;
        const usedCoupons = this.showPopup ? this.qyUsedCoupons : this.usedCoupons;
        for (let i = 0; i < settleInfo.userCanUseCoupon.length; i++) {
          let couNo1 = settleInfo.userCanUseCoupon[i].couNo;
          settleInfo.userCanUseCoupon[i].selected = false;
          for (let j = 0; j < usedCoupons.length; j++) {
            if (usedCoupons[j] == couNo1) {
              settleInfo.userCanUseCoupon[i].selected = true;
            }
          }
        }

        Coupon.open({
          initData:{
              listData: [],
              userCanNotUseCoupon: settleInfo.userCanNotUseCoupon,
              userCanUseCoupon: settleInfo.userCanUseCoupon,
              userCanUseWhenNotSelectCoupon: settleInfo.userCanUseWhenNotSelectCoupon,
              type: "use",
              skuId: "",
              categoryId: "",
              storeOuCode: "",
              token: this.$store.state.login.token,
              payAmount: this.$util.toDecimal2(
                parseFloat(settleInfo.amount)
              )
          },
          selectedCoupon: couponArr => {
            let arry = [];
            for (let i = 0; i < couponArr.length; i++) {
              arry.unshift(couponArr[i].couNo)
            }
            if (arry.length == 0) {
              arry.push('-1');
            }
            if(this.showPopup) {
              this.qyUsedCoupons = arry;
            } else {
              this.usedCoupons = arry;
            }
            this.backReloadCoupon = true
            // 如果拉起了企业支付代表此时为企业支付的结算
            if(this.showPopup) {
              this.orderCategory = 3;
              this.settlement(2);
            } else {
              this.orderCategory = 0;
              this.settlement(3);
            }
            
            //Coupon.close();
          }
        });
      },
      setHour(d) {
        return d ? this.$util.formatDate(new Date(d), "yyyy-MM-dd hh:mm") : "";
      },
      setPayWays(payWay,type='change') {
        // 如果初始化返回了一个空数组，专门针对第三方支付切换到企业支付时，会
        if(!Array.isArray(payWay)) {
          this.selectedPayWay = payWay
          this.supportCompany = false;
        } else {
          // 如果为空数组则表示当前的状态是企业支付，则将第三方支付置空
          this.selectedPayWay = null
        }
      },

      // 虚拟支付
      // 3. 匹配公共的虚拟支付名称
      getDigitalDisplayName: function (acctType) {
        return this.$mallCommon.accTypeToName(acctType, '100')
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

        this.setDigitalList(digital)
        if (this.payDigitals.length) { // 选择虚拟支付的情况
          if (this.isMutex) {// 如果互斥并选择了虚拟支付，那么券清空
            this.usedCoupons = ['-1']
          }
        }

        this.settlement();
      },
      setDigitalList(digital) {
        const acctType = digital.acctType;
        // fixedDigital固定积分，必须要消费的积分数量 // payDigital 用户要使用的积分数量
        // payDigital <= fixedDigital 意味着之前没有使用虚拟支付，那么需要加入该虚拟支付
        const usePayDigital = digital.payDigital <= digital.fixedDigital
        // usePayDigital ? 用户可用的加上必须使用的 : 最低使用的值
        const payDigital = usePayDigital ? digital.userCanUseDigital + digital.fixedDigital : digital.fixedDigital || 0
        // 虚拟支付列表payDigitals是否有当前的虚拟支付
        let hasPayDigital = false
        // 如果有则改变支付值
        this.payDigitals = this.payDigitals.map(item => {
          if (item.acctType === acctType) {
            item.payDigital = payDigital
            hasPayDigital = true
          }
          return item
        })
        // 如果没有则加入该虚拟支付
        if (!hasPayDigital) {
          this.payDigitals.push({
            acctType: acctType,
            payDigital
          })
        }
        console.log('虚拟支付结果： ', this.payDigitals)
      },
      checkNeedPwd: function () {
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
      // 查询用户是否开通免密支付
      queryWechatUserState() {
        return new Promise((resolve, reject) => {
          let params = {
            occurOuCode: this.ouCode,
            orderType: this.orderType,
            openid: this.$store.state.login.thirdUserId // todo
            // openid: 'oVrq55T9Jf9rhmckS2AjKLVRT9uc',
            // authCode: '134609941524428249'
          }
          // returnCode 0-已签约 -1需要签约
          this.$request.post('/app/json/app_pay/queryWechatUserState', params).then(res => {
            if (res.status === 0) {
              if (res.data.returnCode == 0) {
                if (!res.data.path) {
                  this.$Toast(res.data.returnmsg)
                } else {
                  resolve(res.data.path)
                }
              } else {
                reject(res.data.info)
              }
            } else {
              this.$Toast(res.info);
            }
          })
        })
      },
      payScene() {
        if (this.selectedPayWay && this.selectedPayWay.payModeSub == '210009') {
          this.$Loading.open()
          this.queryWechatUserState().then(res => {
            this.$Loading.close()
            this.payFn()
          }, (res => {
            this.$Loading.close()
            wx.miniProgram.navigateTo({url: `/pages/signPay/main?signInfo=${encodeURIComponent(res)}`})
          }))
        } else {
          this.payFn()
        }
      },
      submitSel() {
        if(this.showQyPay && this.supportCompany) {
          this.showModal = false;
          this.showPopup = true;
        } else {
          // this.submitOrder()
          this.showModal = true
        }
      },
      submitOrder() {
        // 因为某些情况造成下单后没能顺利支付，用户点击 确认支付时 直接拉起支付功能
        if (this.payData && Object.keys(this.payData).length > 0) {
          this.payBill(this.payData)
        } else {
          // 企业支付进行区分
          let settleInfo = this.supportCompany ? this.qySettleInfo : this.settleInfo;
          if (settleInfo.cashCouponFaceValue > settleInfo.cashCouponAmount) {
            // 您的优惠券金额比订单金额大，确定使用吗？
            this.$MessageBox.confirm(this.$store.state.globalConfig.appCouponPayTip || '您的优惠券金额比订单金额大，确定使用吗？', '提示', {confirmButtonText: '确定'}).then(action => {
              this.payScene();
            }).catch(action => {
            })
          } else {
            this.payScene()
          }
        }
      },
      payFn() {
        // 先判断虚拟支付的余额情况
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
      },
      // 虚拟支付end
      scanCodeFunc: function () {
        this.$bridgefunc.scanCode(dic => {
          let code = dic.code
          if (code.indexOf('http') > -1) {
            code = this.$util.getUrlParam(code, 'qrCode')
          }
          this.scanCode = code;
          this.referrer = code;
        });
      }
    },
    filters:{
      state(val) {
        console.log(val,'val')
        let str = ''
        switch(val) {
          case 'ONGOING':
            str = '约定进行中'
            break;
          case 'CHECKING':
            str = '到期核对中'
            break;
          case 'FINISHED':
            str = '已完成约定'
            break;
          case 'UNFINISHED':
            str = '未完成约定'
            break;
        }
        return str;
      }
    }
  };
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/mixin.styl';
  @import '~@/common/stylus/variable.styl';
  .rule-content{
    padding: 15px;
  }
  .cul-tip{
    line-height: 35px;
    padding-left: 10px;
    display: flex;
    align-items: center;
    span{
      color: #555;
      margin-right: 5px;
    }
  }
  .flex-row {
    display: flex;
    justify-content: space-between;
    padding: 0.266667rem 0
  }

  .firmorder {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }

  .firm {
    padding: 8px 10px;
    height: 100%;
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
    padding-bottom: 90px;
  }

  .firm-one {
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    padding: 11px 15px;
    position: relative;

    p + p {
      padding-top: 10px;
    }
  }

  .firm-one p img {
    width: 0.6rem;
    vertical-align: middle;
  }

  .firm-one p span {
    padding-left: 0.26rem;
    vertical-align: middle;
  }

  .firm-two {
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    padding: 10px 15px;
    position: relative;
    margin-top: 8px;
    .carNum{
      padding: 15px 0;
      text-align: center;
      color: #f02c2d;
      font-size: 20px;
      font-weight: 600;
      border-radius: 4px;
      box-shadow: 0 0 3px 2px rgba(0,0,0,0.1);
    }
    .pwd{
      padding: 10px 0;
    }
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

  .label-middle {
    font-size: 14px;
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
  .priority-card{
    border-radius: 4px;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    padding: 10px 15px;
    margin-top: 8px;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /deep/ .van-button--small{
      height: 28px !important;
    }
    .card-left{
      .title{
        color:#000000;

      }
      .info{
        color:rgba(0, 0, 0, 0.3);
        
      }
    }
  }
  .recommend {
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    padding: 10px 15px;
    position: relative;
    margin-top: 8px;
    display flex
    align-items center

    .form-control {
      width 100%;
      flex 1;
      margin 0 10px;
    }

    .scan-code {
      width 20px;
    }
  }

  .pay-mode {
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    padding: 10px 15px;
    position: relative;
    margin-top: 8px;

    .title {
      padding: 6px 0;
      font-size: 14px;
    }

    .pay-mode-item {
      display: flex;
      align-items: center;
      padding-top: 8px;

      .icon {
        flex-shrink: 0;

        img {
          width: 24px;
        }
      }

      .text {
        flex: 1;
        padding: 0 8px;
      }

      .selected {
        flex-shrink: 0;
      }

      & + .pay-mode-item {
      }
    }
  }

  .coupon-wrapper {
    width: 100%;

    /deep/ .mint-radio-input:checked + .mint-radio-core {
      background-color: #f02c2d;
      border-color: #f02c2d;
    }
    
    .tit {
      width: 100%;
      box-sizing: border-box;
      height: 44px;
      line-height: 44px;
      position: relative;
      text-align: center;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
      bdr-b();

      .icon {
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        font-size: 18px;
        color: #5b5b5b;
      }
    }

    .coupon-con {
      max-height: 280px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
  .two-zindex{
    z-index: 2 !important;
  }
  /deep/ .van-overlay{
      z-index: 3 !important;
  }
  .confirm-pay-modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 5;
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

  .footer {
    position fixed
    left: 0;
    right 0;
    bottom 0;

    .tip {
      color #f3a033;
      padding 10px 0;
      text-align center
      background: #faf8d9
    }

    .btn-wrapper {
      display flex
      justify-content space-between
      align-items: center;
      padding: 8px 15px;
      background: #fff;
    }

    .btn {
      background-color: #f02c2d;
      color: #fff;
      font-size: 0.4rem;
      padding: 12px 15px;
      border-radius: 50px;
      text-align: center;
    }

    .price {
      color: #f02c2d;
      font-size: 28px;
      font-weight: 500

      .unit {
        font-size: 12px;
        font-style normal
        font-weight 400
        margin-top: -2px;
      }

      .num {
        display inline-block
        margin-left: -3px;
      }
    }
  }
  .pop-content{
    padding: 10px 20px;
    .order-title{
      font-size: 15px;
      line-height: 30px;
      text-align: center;
      margin-bottom: 15px;
    }
    .qy-order{
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      line-height: 26px;
    }
  }
  .qy-submit{
    position: absolute;
    bottom: 0;
    width: 100%;
    box-shadow: 0px 0px 3px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    line-height: 45px;
    p{
      padding-left: 20px;
      .price {
        color: #f02c2d;
        font-size: 28px;
        font-weight: 500

        .unit {
          font-size: 12px;
          font-style normal
          font-weight 400
          margin-top: -2px;
        }

        .num {
          display inline-block
          margin-left: -3px;
        }
      }
    }
    div{
      background-color: #f02c2d;
      color:#fff;
      font-size: 16px;
      padding: 0 30px;
    }
  }
  .qy-pay {
    display: flex;
    justify-content: space-between;
  }

  .qy {
    margin: 10px 0;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    border-radius: 4px;
    overflow: hidden;
    /deep/ .van-icon-success::before{
      font-size: 12px !important;
      transform: scale(0.8) !important;
    }
    /deep/ .van-checkbox{
      margin-left: 15px;
    }
    /deep/ .van-cell__title{
      flex: 2!important;
      -webkit-box-flex: 2!important;
    } 
    /deep/ .van-cell__value{
      flex: 1 !important;
      -webkit-box-flex: 1!important;
      color: #323233!important;
    }
    .sel{
      &/deep/ .van-cell{
        background: #faf8d9 !important;
        color:#f3a033 !important;
      }
      /deep/ .van-cell__value{
        color:#f3a033 !important;
      }
    }
  }

  .virtual-tip {
    padding 11px 0;
    color: #f02c2d;
  }
  &/deep/.van-password-input{
    margin: 0 !important;
  }
</style>
