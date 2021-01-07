<template>
  <div class="confirm-pay-modal" v-if="showModal">
    <div class="modal-content">
      <div class="modal-title">确认支付？</div>
      <div class="content">
        <div class="item" v-if="payData.payMode">
          <span>支付方式</span>
          <span>{{payTypeStr(payData.payMode)}}</span>
        </div>
        <div class="item" v-else-if="isOfflineScan">
          <span>支付方式</span>
          <span>{{payStyle.text}}</span>
        </div>
        <div class="item" v-else-if="!isOfflineScan">
          <pay-mode style="width: 100%; margin-top: 0;" ref="payModeRef" @setPayWay="setPayWays"></pay-mode>
        </div>
        <div class="item">
          <span v-if="isOfflineScan">支付时间</span>
          <span v-else>加油时间</span>
          <span>{{payData.createTime}}</span>
        </div>
        <div class="item" v-if="!isOfflineScan">
          <span>加油升数</span>
          <span>{{payData.refuelLiter}}L</span>
        </div>
        <div class="item">
          <span>{{isOfflineScan ? '支付金额' : '金额'}}</span>
          <span class="theme_font_red">￥{{payData.totalAmount.toFixed(2)}}</span>
        </div>
      </div>
      <div class="btns">
        <p class="btn cancel-btn" @click="showModal = false">否</p>
        <p class="btn" @click="payBill(payData)">是</p>
      </div>
    </div>
  </div>
</template>

<script>
  import payHelper from "@/utils/payHelper";
  import logCenter from "@/utils/logCenter";
  import PayMode from './pay-mode'

  export default {
    props: {
      isScan: {
        type: Boolean,
        default: false
      },
      isOfflineScan: {
        type: Boolean,
        default: false
      },
      payStyle: {
        type: Object
      }
    },
    components: {
      PayMode
    },
    data() {
      return {
        showModal: false,
        payData: {},
        selectedPayWay: null
      }
    },
    mounted() {
    },
    methods: {
      open(payData) {
        this.payData = payData
        this.showModal = true
        // 支付方式没有的情况重新获取
        if (!payData.payMode && !this.isOfflineScan) {
          this.$nextTick(() => {
            this.$refs.payModeRef.init(payData.orderType.slice(0, payData.orderType.length - 3), payData.storeOuCode)
          })
        }
      },
      setPayWays(payWay) {
        this.selectedPayWay = Object.assign({}, payWay)
      },
      payBill(payData) {
        console.log(payData)
        let way = this.selectedPayWay
        if (!this.selectedPayWay) {
          way = this.payStyle
        }
        let fn = 'refuelPayEvent'
        if (payData.orderType == 100002002) { // 扫码加油
          fn = 'refuelScanPayEvent'
        } else if (payData.orderType == 200401002) {
          fn = 'refuelOfflinePayEvent'
        }
        let params = Object.assign({}, payData)
        if (!payData.payMode) {
          params = Object.assign({}, params, way)
        }
        payHelper[fn](params, payData.orderType, payData.id).then(() => {
          this.resultHand("1", payData);
        }).catch(() => {
          this.resultHand("0", payData);
        })
        // if (this.$store.state.webtype != 1) {
        //   this.checkPayResult()
        // }
      },
      payTypeStr(payMode) {
        console.log(payMode, 'payMode')
        return payHelper.getPayWayStr(payMode)
      },
      resultHand(result, payData) {
        this.$Loading.close();
        logCenter.addLog("支付结果", result ? "成功" : "失败");
        let path = '/firmDetail'
        let source = ''
        if (this.isScan) {
          path = '/firmScanDetail'
        }
        if (this.isOfflineScan) {
          path = '/offline_payment/pay_success'
          source = 1
        }
        if (result == "1") {
          this.$router.replace({
            path: path,
            query: {
              orderType: this.payData.orderType,
              orderId: this.payData.id,
              fromPage: 1,
              source: source
            }
          });
        } else {
          this.cancelOrder(payData)
        }
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
        if (this.isOfflineScan) {
          url = "/app/json/shopping_scan_code/cancelOrder";
        }
        this.$http.post(url, paramsData2).then(res => {
          let data2 = res.data;
          if (data2.status == 0) {
            this.$Toast("支付已取消");
            this.$emit("queryOrder")
          } else {
            this.$Toast(data2.info);
          }
        });
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
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
