<template>
  <div class="firmdetail">
    <nav-top :title="isOfflineScan ? '商品支付凭证详情' : '加油支付凭证详情'" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="firmdetail-recharge-details">
      <template v-if="orderDetail">
        <div class="top-show">
          <div class="title">
            <div class="num">¥{{orderDetail.payAmount.toFixed(2)}}</div>
            <div class="img">
              <img src="./images/icon.png" alt="">{{ orderDetail.storeName }}
            </div>
          </div>
          <div class="card" v-if="isOfflineScan">
            <div class="table-view">
              <div class="table-view-cell" v-if="isOfflineScan">
                <div class="table-view-cell-text">
                  <div class="left">便利店编码</div>
                  <div class="right">{{orderDetail.storeStandCode}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">员工编号</div>
                  <div class="right">{{orderDetail.refuelCashierId}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">员工姓名</div>
                  <div class="right name">{{orderDetail.refuelCashierName}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">员工手机号</div>
                  <div class="right">{{orderDetail.mobile}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="card" v-if="isOfflineScan">
            <div class="table-view">
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">支付方式</div>
                  <div class="right">{{payTypeStr}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">商品付款类型</div>
                  <div class="right">{{orderDetail.payBody}}</div>
                </div>
              </div>
              <div class="table-view-cell" v-if="isOfflineScan">
                <div class="table-view-cell-text">
                  <div class="left">创建时间</div>
                  <div class="right">{{orderDetail.createTime}}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="card" v-if="!isOfflineScan">
            <div class="table-view">
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">支付方式</div>
                  <div class="right">{{payTypeStr}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">油品名称</div>
                  <div class="right">{{orderDetail.refuelOilName}}</div>
                </div>
              </div>
              <div class="table-view-cell" v-if="$store.state.globalConfig.appOilPayDetailHideFefuelLiter != 1">
                <div class="table-view-cell-text">
                  <div class="left">加油升数</div>
                  <div class="right">{{orderDetail.refuelLiter || 0}}L</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">创建时间</div>
                  <div class="right">{{orderDetail.createTime}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="card" v-if="!isOfflineScan">
            <div class="table-view">
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">油站编码</div>
                  <div class="right">{{ orderDetail.refuelOuCode}}</div>
                </div>
              </div>
              <div class="table-view-cell" v-if="!isScan">
                <div class="table-view-cell-text">
                  <div class="left">TTC</div>
                  <div class="right">{{ orderDetail.refuelPosTtc}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">员工姓名</div>
                  <div class="right">{{orderDetail.refuelCashierName}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">asn加油卡序列号</div>
                  <div class="right">{{orderDetail.refuelCardNo}}</div>
                </div>
              </div>
              <div class="table-view-cell" >
                <div class="table-view-cell-text">
                  <div class="left">员工卡后六位</div>
                  <div class="right special">{{refuelCardNo}}</div>
                </div>
              </div>
              <div class="table-view-cell" >
                <div class="table-view-cell-text">
                  <div class="left">油枪编号</div>
                  <div class="right">{{orderDetail.refuelGunNo}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="table-view">
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">订单编号</div>
                  <div class="right">{{orderDetail.tradeNo}}</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">交易总金额</div>
                  <div class="right">￥{{orderDetail.realAmount.toFixed(2)}}</div>
                </div>
              </div>
              <div class="table-view-cell" v-if="isOfflineScan && orderDetail.state == 3">
                <div class="table-view-cell-text">
                  <div class="left">支付完成时间</div>
                  <div class="right">{{orderDetail.paidTime}}</div>
                </div>
              </div>
              <div class="table-view-cell" v-if="isOfflineScan && orderDetail.state == 7">
                <div class="table-view-cell-text">
                  <div class="left">支付取消时间</div>
                  <div class="right">{{orderDetail.cancelTime}}</div>
                </div>
              </div>
              <div class="table-view-cell" v-if="!isOfflineScan">
                <div class="table-view-cell-text">
                  <div class="left">优惠抵扣</div>
                  <div class="right">¥{{ discountAmountCom }}</div>
                </div>
              </div>
              <div class="table-view-cell" v-if="!isOfflineScan">
                <div class="table-view-cell-text">
                  <div class="left">油点抵扣</div>
                  <div class="right">{{orderDetail.deductionRewards}}</div>
                </div>
              </div>
              <div class="table-view-cell" v-if="!isOfflineScan && settleMobelAmount(orderDetail.thirdDiscountAmount,orderDetail.thirdDiscountAmount2)">
                <div class="table-view-cell-text">
                  <div class="left">移动优惠金额</div>
                  <div class="right">￥{{settleMobelAmount(orderDetail.thirdDiscountAmount,orderDetail.thirdDiscountAmount2)}}</div>
                </div>
              </div>
              <div class="table-view-cell" v-if="!isOfflineScan">
                <div class="table-view-cell-text">
                  <div class="left">开票状态</div>
                  <div class="right theme_font_red">{{invoiceUse(orderDetail.invoiceUse)}}</div>
                </div>
              </div>

            </div>

          </div>
          <div class="pay-btn" v-if="orderDetail.state == 1">
              <div class="con wait-pay" style="margin-right:15px" @click="cancelOrderHandler(orderDetail)">取消订单</div>
              <div class="con wait-pay" @click="repayment(orderDetail)">重新支付</div>
          </div>
        </div>
        <div class="state">
          <img class="icon" v-if="orderDetail.state == 3" src="./images/order-complete.png" alt="">
          <img class="icon" v-else-if="orderDetail.state == 1" src="./images/order-unpay.png" alt="">
          <img class="icon" v-else src="./images/order-cancel.png" alt="">
        </div>
        <div class="query-state" v-if="orderDetail.state == 1 && !isOfflineScan" @click="queryHandle">
          <span>刷新状态</span>
        </div>
      </template>
     <div v-if="$store.state.globalConfig.oil_appraise_type == 1 && !isOfflineScan">
       <p class="evaluate">加油评价</p>
       <div class="question" v-if="!detailView">
         <subject :firmdetailSubject="firmdetailSubject" :orderIds="orderId" :ouCode="ouCode" @firmData="firmData"></subject>
       </div>
       <div class="question" v-if="detailView">
         <subjectDetail :firmdetailSubject="firmdetailSubject" :orderIds="orderId"></subjectDetail>
       </div>
     </div>
    </nav-content>
    <repayments @queryOrder="queryHandle" :isScan="isScan" :isOfflineScan="isOfflineScan" ref="repay"></repayments>
  </div>
</template>
<script>
  import Hobby from '@/components/hobby/index'
  import subject from "@/components/mall2/game/service-question/subject.vue";
  import subjectDetail from "@/components/mall2/game/service-question/questionDetail.vue";
  import payHelper from "@/utils/payHelper";
  import checkPayResult from "./mixins/checkPayResult";
  import repayments from "./components/repayments.vue";
  export default {
    components: {
      repayments,
      subject,
      subjectDetail
    },
    data() {
      return {
        month: "",
        day: "",
        hour: "",
        min: "",
        second: "",
        millisecond: "",
        orderDetail: null,
        fromPage: "",
        firmdetailSubject: '加油凭证',
        orderId: '',
        ouCode: '',
        detailView: false
      };
    },
    mixins: [checkPayResult],
    filters: {
      formatState(state) {
        let str = ''
        if (state == 1) {
          str = '待支付'
        } else if (state == 3) {
          str = '已支付'
        } else if (state == 7 || state == 8) {
          str = '已取消'
        }
        return str
      }
    },
    computed: {
      discountAmountCom() {
        let couponAmount = Number(this.orderDetail.couponAmount) || 0;
        let pointsAmount = Number(this.orderDetail.pointsAmount) || 0;
        let discountAmount = Number(this.orderDetail.discountAmount) || 0;
        let rewardsAmount = Number(this.orderDetail.rewardsAmount) || 0;
        let empRewardsAmount = Number(this.orderDetail.empRewardsAmount) || 0;
        let enterpriseAmount = Number(this.orderDetail.enterpriseAmount) || 0;
        let randomDeductionAmount = Number(this.orderDetail.randomDeductionAmount) || 0;
        return couponAmount + pointsAmount + discountAmount + rewardsAmount + empRewardsAmount + enterpriseAmount + randomDeductionAmount;
      },
      refuelCardNo() {
        let num = this.orderDetail ? this.orderDetail.refuelCardNo : "";
        return num.slice(-6) || "";
      },
      isScan() { // 是否是扫码过来的
        return this.$route.path === '/firmHistoryScanDetail'
      },
      isOfflineScan() { // 是否是离线支付过来的
        return this.$route.path === '/firmOfflineScanDetail'
      },
      payTypeStr() {
        const payMode = this.orderDetail.payMode
        return payHelper.getPayWayStr(payMode)
      }
    },
    created() {
      console.log(11,this.$route)
      this.orderType = this.$route.query.orderType;
      this.orderId = this.$route.query.orderId;
      this.fromPage = this.$route.query.fromPage;
      // this.fromPage = 1;
      if (this.fromPage == 1) {
        // 支付时展示时间
        this.counttime();
      }
      /* this.orderDetail = {
          payAmount: 12,
          totalAmount: 12,
          refuelPosTtc: 'qweqwewqeqwe',
          submitTime: '2018-12-12',
          refuelGunNo: 12,
          refuelOilName: '#92',
          refuelLiter: 12
        }*/
      this._getOrderDetail();
      this.goEvaluation()
    },
    methods: {
      firmData(data) {
       this.detailView = data.pageView
      },
      settleMobelAmount(val1,val2) {
        let num = val1 ? val1 : 0;
        let num2 = val2 ? val2 : 0;
        return num + num2
      },
      goEvaluation() { //进入页面首先判断已经答题的显示详情
        // 去评价按钮
        this.$Loading.open();
        let url = "/app/json/questionaire/getQuestionaireByOrderid";
        let paramsData = {
          token: this.$store.state.login.token,
          orderId: this.orderId
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.detailView = true
            } else {
              this.detailView = false
              // this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast("请求数据失败！");
          }
        )
      },
      queryHandle() {
        this.queryState().then(state => {
          this.$toast('刷新完毕')
          if (state == 1) {
            this._getOrderDetail()
          }
        })
      },
      repayment(item) {
        this.$refs.repay.open(item)
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
        if (payData.orderType == 100002002) {
          url = '/app/json/refuel_scan_code/cancelOrder'
        }
        if (this.isOfflineScan) {
          url = "/app/json/shopping_scan_code/cancelOrder";
        }
        this.$http.post(url, paramsData2).then(res => {
          let data2 = res.data;
          if (data2.status == 0) {
            this.$Toast("支付已取消");
            this._getOrderDetail()
          } else {
            this.$Toast(data2.info);
          }
        });
      },
      // 开票状态 0: 未开票 1: 已开票 2: 开票中
      invoiceUse(type) {
        let str = ''
        if (type === 0) {
          str = '未开票'
        } else if (type === 1) {
          str = '已开票'
        } else if (type === 2) {
          str = '开票中'
        }
        return str
      },
      // nav-top部分
      backEvent: function () {
        this.$router.go(-1);
      },
      counttime() {
        let d = new Date();
        this.month = d.getMonth() + 1;
        this.day = d.getDate();
        this.hour = d.getHours();
        this.min = this.padZero(d.getMinutes());
        this.second = this.padZero(d.getSeconds() + 1);
        this.millisecond = this.padZero(d.getMilliseconds(), 3)
        const that = this;
        clearTimeout(this.timer)
        this.timer = setTimeout(function () {
          that.counttime();
        }, 1);
      },
      _getOrderDetail: function () {
        this.$Loading.open();
        let url = "/app/json/refuel_center/detail";
        if (this.isScan) {
          url = "/app/json/refuel_scan_code/detail";
        }
        if (this.isOfflineScan) {
          url = "/app/json/shopping_scan_code/detail";
        }
        console.log(url)
        let paramsData = {
          token: this.$store.state.login.token,
          orderType: this.orderType,
          orderId: this.orderId
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.orderDetail = data.data || {};
              this.payData = data.data || {};
              this.ouCode = data.data.storeOuCode
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast("请求数据失败！");
          }
        )
      },
      padZero(num, len = 2) {
        let str = num + ''
        return ('0000'.substr(0, len) + str).substr(str.length)
      }
    }
  };
</script>
<style lang="stylus" scoped ref="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .pay-btn {
    bdr-t()
    color: #f02c2d
    display flex
    justify-content flex-end
    .con {
      font-size: 14px;
      border: 1px solid #f02c2d;
      padding: 0.186rem 0.26rem;
      border-radius: 0.4rem;
    }
  }
  .firmdetail-recharge-details {
    padding: 11px 15px
    overflow-y auto
    -webkit-overflow-scrolling touch

    .top-show {
      .title {
        margin-bottom: 20px
        text-align center
        font-size 16px
        position: relative;

        .num {
          padding-bottom: 8px;
          font-size: 20px;
        }

        .img {
          display flex
          justify-content center
          align-items center

          img {
            width 20px
            margin-right: 10px
          }
        }

        .state {
          z-index 10;
          display flex
          align-items center
          justify-content center
          padding-bottom: 10px;

          &.success {
            color #0ca237
          }

          &.fail {
            color #f61f3d
          }

          .icon {
            font-size: 30px;
          }

          .text {
            padding-left 8px;
            font-size: 20px
          }
        }
      }

      .card {
        margin-bottom: 10px
        box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
        background: #fff
        border-radius 6px
        padding: 0 15px

        .left {
          color: $color-text-d
        }

        .table-view-cell {
          padding-right 0;
          padding-left: 0
        }
        .name {
          font-size 16px
          font-weight bold
        }
      }
    }
  }

  .state {
    position: absolute;
    top: 50%;
    left 50%;
    transform translate3d(-50%, -50%, 0)

    .icon {
      width 250px;
      opacity 0.5
    }
  }

  .query-state {
    position: absolute;
    right: 0;
    top: 10px;
    background: rgba(0, 0, 0, 0.6)
    padding 8px 15px;
    border-radius 30px 0 0 30px;
    color: #fff;
  }

  .firmdetail {
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow-y: auto;
  }

  .header {
    padding-top: 20px;
  }

  .header-top {
    line-height: 44px;
    color: #000;
  }

  .header-top .backmall {
    font-size: 20px;
    margin-left: 10px;
    color: #000;
  }

  .header-top span {
    display: inline-block;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    width: 80%;
  }

  .detailstation, .detailmon, .detailli {
    border-radius: 5px;
    margin: 0.24rem 15px;
    box-shadow: -1px 0 3px -2px #c2c2c2, 0 -1px 3px -2px #c2c2c2, 0 1px 3px -2px #c2c2c2, 1px 0 3px -2px #c2c2c2;
  }

  .detailstation, .detailmon, .detailli .special {
    font-weight bold
  }

  .detailstation {
    padding: 11px 0;
    font-size: 22px;
    font-weight: 600;
    color: #333;
    text-align: center;
    margin-top: 0.24rem;
    margin-bottom: 0.24rem;
  }

  .detailmon {
    padding: 0.4rem 0.26rem 0.26rem 0.26rem;
  }

  .detailmon {
    margin-top: 0.24rem;
    margin-bottom: 0.24rem;
  }

  .detailmon p {
    font-size: 14px;
    color: #333;
  }

  .detailmon p:last-of-type {
    padding-top: 0.13rem;
    text-align: center;
  }

  .detailmon p:last-of-type span {
    font-size: 30px;
  }

  .detailli ul li {
    margin: 0 0.26rem;
    padding: 0.4rem 0;
    font-size: 16px;
    color: #666;
    border-bottom: 1px solid #dcdddd;
  }

  .detailli ul li:last-of-type {
    border: none;
  }

  .detailli ul li span:last-of-type {
    font-size: 18px;
    color: #333;
    float: right;
  }

  .headerTime .time .millisecond {
    font-size: 16px !important;
  }

  .ttc-content {
    display: flex;

    .item {
      flex 1
      text-align: center
      display flex
      align-items center
      justify-content center
    }

    .label {
      font-size: 14px;
      vertical-align middle
    }

    .con {
      font-size: 30px;
      vertical-align middle

      .num {
        vertical-align: middle
      }

      .suffix {
        font-size: 24px;
        vertical-align middle
      }
    }
  }
  .evaluate {
    padding: 14px 0;
    font-size: 16px;
  }
  /deep/ .question .nav-content {
    position static !important
  }
</style>
