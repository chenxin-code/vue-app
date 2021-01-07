<template>
  <div class="firmdetail">
    <nav-top title="凭证详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="firmdetail-recharge-details">
      <template>
        <div class="top-show">
          <div class="top">
            <div class="title">
              <div class="num">￥{{detail.realAmount.toFixed(2)}}</div>
              <div class="img">
                <img src="../image/bld.png" alt="">{{detail.storeName}}
              </div>
            </div>
            <div class="card">
              <div class="table-view">
                <div class="table-view-cell">
                  <div class="table-view-cell-text">
                    <div class="left">会员编码</div>
                    <div class="right">{{detail.refuelCashierId}}</div>
                  </div>
                </div>
                <div class="table-view-cell">
                  <div class="table-view-cell-text">
                    <div class="left">会员姓名</div>
                    <div class="right">{{detail.refuelCashierName}}</div>
                  </div>
                </div>
                <div class="table-view-cell">
                  <div class="table-view-cell-text">
                    <div class="left">会员手机号</div>
                    <div class="right">{{detail.mobile}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="table-view">
                <div class="table-view-cell">
                  <div class="table-view-cell-text">
                    <div class="left">支付方式</div>
                    <div class="right">{{payStyle}}</div>
                  </div>
                </div>
                <div class="table-view-cell">
                  <div class="table-view-cell-text">
                    <div class="left">{{source == 1 ? '商品付款类型' : '油品名称'}}</div>
                    <div class="right">{{source == 1 ? detail.payBody : detail.refuelOilName}}</div>
                  </div>
                </div>
                <div class="table-view-cell">
                  <div class="table-view-cell-text">
                    <div class="left">创建时间</div>
                    <div class="right">{{detail.createTime}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="table-view">
                <div class="table-view-cell">
                  <div class="table-view-cell-text">
                    <div class="left">{{source == 1 ? '便利店编码' : '油站编码'}}</div>
                    <div class="right">{{source == 1 ? detail.storeStandCode : detail.refuelOuCode}}</div>
                  </div>
                </div>
                <div class="table-view-cell">
                  <div class="table-view-cell-text">
                    <div class="left">员工编号</div>
                    <div class="right">{{detail.refuelCashierId}}</div>
                  </div>
                </div>
                <div class="table-view-cell">
                  <div class="table-view-cell-text">
                    <div class="left">员工姓名</div>
                    <div class="right">{{detail.refuelCashierName}}</div>
                  </div>
                </div>
                <div class="table-view-cell" v-if="source != 1">
                  <div class="table-view-cell-text">
                    <div class="left">员工手机号</div>
                    <div class="right">{{detail.mobile}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="table-view">
                <div class="table-view-cell">
                  <div class="table-view-cell-text">
                    <div class="left">订单编号</div>
                    <div class="right">{{detail.tradeNo}}</div>
                  </div>
                </div>
                <div class="table-view-cell">
                  <div class="table-view-cell-text">
                    <div class="left">交易总金额</div>
                    <div class="right">￥{{detail.realAmount.toFixed(2)}}</div>
                  </div>
                </div>
                <div class="table-view-cell" v-if="detail.state == 7">
                  <div class="table-view-cell-text">
                    <div class="left">支付取消时间</div>
                    <div class="right">{{detail.cancelTime}}</div>
                  </div>
                </div>
                <div class="table-view-cell" v-if="detail.state == 3">
                  <div class="table-view-cell-text">
                    <div class="left">支付完成时间</div>
                    <div class="right">{{detail.paidTime}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card" v-if="detail.state == 3">
              <div class="table-view">
                <div class="table-view-cell">
                  <div class="table-view-cell-text special">
                    <div class="left">加油交易备注</div>
                    <div class="right">
                      <textarea cols="20" rows="5" class="textarea-class" ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pay-btn" v-if="detail.state == 3">
            <div class="con" @click="repayment(orderDetail)">提交</div>
          </div>
        </div>
        <div class="state">
          <img class="icon" v-if="detail.state == 1"src="../image/dzf.png" alt="">
          <img class="icon" v-else-if="detail.state == 3" src="../image/wancheng.png" alt="">
          <img class="icon" v-else-if="detail.state == 7 || detail.state == 8" src="../image/quxaio.png" alt="">
        </div>
      </template>
    </nav-content>
  </div>
</template>
<script>
  import payHelper from "@/utils/payHelper";
  export default {
    data() {
      return {
        detail: '',
        source: '',
        payStyle: '' // 支付方式
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
    mounted() {
      this.detail = JSON.parse(this.$route.query.detail)
      this.source = this.$route.query.source
      console.log(this.detail.payMode)
      const payMode = this.detail.payMode
      this.payStyle = payHelper.getPayWayStr(payMode)
    },
    computed: {
    },
    methods: {
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
    background $color-theme-r
    color: #fff
    padding: 11px 0
    text-align center
    font-size 16px
  }
  .firmdetail-recharge-details {
    overflow-y auto
    -webkit-overflow-scrolling touch

    .top-show {
      .top {
        padding: 11px 15px
      }
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
        .special {
          display block
        }

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

  .textarea-class {
    margin-top: 10px
    background $color-background-lll
    width 100%
    border: none
    border-radius 6px
  }
</style>
