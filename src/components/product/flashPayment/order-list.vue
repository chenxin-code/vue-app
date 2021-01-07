<template>
  <div class="order-list-container">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="order-list">
        <div class="order-item" v-for="(item, index) in orderList" :key="index">
          <div class="item">
            <span class="label">油站</span>
            <span class="content">{{item.ouName}}</span>
          </div>
          <div class="item" v-if="$route.query.enterPage != 'scan'">
            <span class="label">油枪</span>
            <span class="content">{{item.refuelGunNo}}号</span>
          </div>
          <div class="item">
            <span class="label">油品</span>
            <span class="content">{{item.refuelOilName}}</span>
          </div>
          <div class="item">
            <span class="label">加油时间</span>
            <span class="content">{{item.refuelTakeDate}}</span>
          </div>
          <div class="item" v-if="$route.query.enterPage != 'scan'">
            <span class="label">加油升数</span>
            <span class="content">{{item.refuelLiter}}L</span>
          </div>
          <div class="item" v-if="settleMobelAmount(item.thirdDiscountAmount,item.thirdDiscountAmount2)">
            <span class="label">移动优惠金额</span>
            <span class="content">￥{{settleMobelAmount(item.thirdDiscountAmount,item.thirdDiscountAmount2)}}</span>
          </div>
          <div class="item">
            <span class="label">金额</span>
            <span class="theme_font_red">￥{{item.payAmount.toFixed(2)}}</span>
          </div>
          <div class="btn-group">
            <div class="btns">
              <div class="btn" @click="cancelOrderHandler(item)">取消订单</div>
              <div class="btn pay-btn" @click="payOrder(item)">继续支付</div>
            </div>
          </div>
        </div>
      </div>
      <div class="no-data" v-show="!orderList.length">暂无订单~</div>
    </nav-content>
    <div class="confirm-pay-modal" v-if="showModal">
      <div class="modal-content">
        <div class="modal-title">确认支付？</div>
        <div class="content">
          <div class="item" v-if="payData.payMode">
            <span>支付方式</span>
            <span>{{payTypeStr(payData.payMode)}}</span>
          </div>
          <div class="item" v-else>
            <pay-mode style="width: 100%; margin-top: 0;" ref="payModeRef" @setPayWay="setPayWays"></pay-mode>
          </div>
          <div class="item">
            <span>加油时间</span>
            <span>{{payData.createTime}}</span>
          </div>
          <div class="item">
            <span>加油升数</span>
            <span>{{payData.refuelLiter}}L</span>
          </div>
          <div class="item" v-if="settleMobelAmount(payData.thirdDiscountAmount,payData.thirdDiscountAmount2)">
            <span class="label">移动优惠金额</span>
            <span class="content">￥{{settleMobelAmount(payData.thirdDiscountAmount,payData.thirdDiscountAmount2)}}</span>
          </div>
          <div class="item">
            <span>金额</span>
            <span class="theme_font_red">￥{{payData.totalAmount.toFixed(2)}}</span>
          </div>
        </div>
        <div class="btns">
          <p class="btn cancel-btn" @click="showModal = false">否</p>
          <p class="btn" @click="payBill(payData)">是</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import wxfunc from "@/utils/wxfunc";
  import logCenter from "@/utils/logCenter";
  import payHelper from "@/utils/payHelper";
  import {mapGetters} from 'vuex'
  import PayMode from './components/pay-mode'
  import checkPayResult from "./mixins/checkPayResult";

  export default {
    mixins: [checkPayResult],
    data() {
      return {
        showModal: false,
        payData: {},
        selectedPayWay: null
      }
    },
    created() {
      this.queryOrder()
    },
    computed: {
      isScan() {
        return this.$route.query.enterPage == 'scan'
      },
      ...mapGetters({orderList: 'oilPayOrderList'})
    },
    methods: {
      setPayWays(payWay) {
        this.selectedPayWay = Object.assign({}, payWay)
      },
      settleMobelAmount(val1,val2) {
        let num = val1 ? val1 : 0;
        let num2 = val2 ? val2 : 0;
        return num + num2
      },
      payTypeStr(payMode) {
        return payHelper.getPayWayStr(payMode)
      },
      cancelOrderHandler(item) {
        this.$dialog.confirm({message: '确定取消当前订单吗？'}).then(() => {
          this.cancelOrder(item)
        })
      },
      cancelOrder(payData) {
        let paramsData2 = {
          token: this.$store.state.login.token,
          orderType: payData.orderType,
          orderId: payData.id
        };
        let url = '/app/json/refuel_center/cancelOrder'
        if (this.isScan) {
          url = '/app/json/refuel_scan_code/cancelOrder'
        }
        this.$http.post(url, paramsData2).then(res => {
          let data2 = res.data;
          if (data2.status == 0) {
            this.$Toast("支付已取消");
            this.queryOrder()
          } else {
            this.$Toast(data2.info);
          }
        });
      },
      payOrder(item) {
        this.payData = item
        this.showModal = true
        // 支付方式没有的情况重新获取
        if (!this.payData.payMode) {
          this.$nextTick(() => {
            this.$refs.payModeRef.init(item.orderType.slice(0, item.orderType.length - 3), item.storeOuCode)
          })
        }
      },
      queryOrder() {
        let url = '/app/json/refuel_center/queryOrder'
        if (this.isScan) {
          url = '/app/json/refuel_scan_code/queryOrder'
        }
        this.$request.post(url, {state: 1}).then(res => {
          if (res.status === 0) {
            this.$store.state.oilPayOrderList = res.data.orderList
            if (res.data.orderList.length === 0) {
              this.$router.go(-1)
            }
          } else {
            this.$Toast("订单请求失败！");
          }
        })
      },
      payBill(payData) {
        const fn = this.isScan ? 'refuelScanPayEvent' : 'refuelPayEvent'
        let params = Object.assign({}, payData)
        if (!payData.payMode) {
          params = Object.assign({}, params, this.selectedPayWay)
        }
        this.hasToPay = true
        this.payTime = (new Date()).getTime()
        payHelper[fn](params, payData.orderType, payData.id).then(() => {
          this.resultHand("1", payData);
        }).catch(() => {
          this.resultHand("0", payData);
        })
        // if (this.$store.state.webtype != 1) {
        //   this.checkPayResult()
        // }
      },
      resultHand(result, payData) {
        console.log(999987)
        this.$Loading.close();
        logCenter.addLog("支付结果", result ? "成功" : "失败");
        if (result == "1") {
          this.$router.replace({
            path: this.isScan ? '/firmScanDetail' : '/firmDetail',
            query: {
              orderType: this.payData.orderType,
              orderId: this.payData.id,
              fromPage: 1
            }
          });
        } else {
          this.cancelOrder(payData)
        }
      },
      formatTime(time) {
        return this.$util.formatDate(new Date(time), 'yyyy-MM-dd hh:mm:ss')
      }
    },
    components: {PayMode}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/mixin.styl"
  .order-list {
    padding 10px;
    height: 100%;
    overflow-y: auto;

    .order-item {
      padding 8px 0
      border-radius 4px;
      box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);

      .item {
        display flex
        justify-content space-between
        padding 8px 11px;
      }

      & + .item {
        margin-top: 8px;
      }

      .btn-group {
        margin-top: 8px;
        bdr-t()
        overflow hidden

        .btns {
          float: right
          padding 16px 11px 8px;

          .btn {
            display inline-block
            color #999
          }

          .pay-btn {
            color: #ff4444
            padding-left 15px;
          }
        }
      }
    }
  }

  .confirm-pay-modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10000;
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

      .content {
        padding 8px 0

        .item {
          display flex
          justify-content space-between
          padding 8px 11px;
        }
      }


      .btns {
        display flex
        align-items center
        padding 11px 15px;
        justify-content space-around

        .btn {
          width 40%
          background-color: #f02c2d;
          color: #fff;
          font-size: 0.4rem;
          padding: 0.3rem 0;
          border-radius: 50px;
          margin-top: 10px;
          text-align: center;
        }

        .cancel-btn {
          margin-right: 15px;
          background: #ccc;
        }
      }
    }
  }
</style>
