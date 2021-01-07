<template>
  <div class="firmdetail">
    <nav-top title="凭证详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="firmdetail-recharge-details">
      <template>
        <div class="top-show">
          <div class="title">
            <div class="num">¥234</div>
            <div class="img">
              <img src="../image/bld.png" alt="">加油站
            </div>
          </div>
          <div class="card">
            <div class="table-view">
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">便利店编码</div>
                  <div class="right">123123</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">员工编号</div>
                  <div class="right">23423</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">员工姓名</div>
                  <div class="right">12312</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">员工手机号</div>
                  <div class="right">23423</div>
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="table-view">
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">支付方式</div>
                  <div class="right">234234</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">{{source == 2 ? '商品付款类型' : '油品名称'}}</div>
                  <div class="right">12312</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">创建时间</div>
                  <div class="right">234</div>
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="table-view">
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">订单编号</div>
                  <div class="right">123123</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">交易总金额</div>
                  <div class="right">¥213123</div>
                </div>
              </div>
              <div class="table-view-cell">
                <div class="table-view-cell-text">
                  <div class="left">支付完成时间</div>
                  <div class="right">¥213123</div>
                </div>
              </div>
<!--              <div class="table-view-cell">-->
<!--                <div class="table-view-cell-text">-->
<!--                  <div class="left">支付取消时间</div>-->
<!--                  <div class="right">¥213123</div>-->
<!--                </div>-->
<!--              </div>-->
            </div>

          </div>
          <div class="pay-btn">
            <div class="con wait-pay" style="margin-right:15px" @click="cancelOrderHandler(orderDetail)">取消订单</div>
            <div class="con wait-pay" @click="repayment(orderDetail)">重新支付</div>
          </div>
        </div>
        <div class="state">
          <img class="icon" src="../image/dzf.png" alt="">
<!--          <img class="icon" src="../image/wancheng.png" alt="">-->
<!--          <img class="icon" src="../image/quxaio.png" alt="">-->
        </div>
      </template>
    </nav-content>
  </div>
</template>
<script>
  export default {
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
        detailView: false,
        source: 0 // 默认0  1是加油支付里的支付凭证入口  2是商品支付入口
      };
    },
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
      payTypeStr() {
        const payMode = this.orderDetail.payMode
        return payHelper.getPayWayStr(payMode)
      }
    },
    created() {
      this.source = this.$route.query.source
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
      // this._getOrderDetail();
      // this.goEvaluation()
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
        // this.$refs.repay.open(item)
        this.$router.push({path: '/offline_payment/confirm_bill', query:{source: 1}})
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
  .firmdetail {
    overflow-y auto
    -webkit-overflow-scrolling touch
  }
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
          padding-bottom: 15px;
          font-size: 28px;
          font-weight bold
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
</style>
