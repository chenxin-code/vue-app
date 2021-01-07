<template>
  <div class="bill-details">
    <nav-top title="账单明细" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="bill-details-container">
      <div class="top">
        <div class="img">
          <img src="../image/icon4@2x.png" alt="">
        </div>
        <div class="money">￥<span class="num">{{details.amountUnit}}</span></div>
      </div>
      <div class="bottom">
        <div class="table-view">
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left" v-if="details.payType == 300">退款状态</div>
              <div class="left" v-else>当前状态</div>
              <div class="right">已完成</div>
            </div>
          </div>
          <div class="table-view-cell" v-if="details.payType == 200">
            <div class="table-view-cell-text">
              <div class="left">商户全称</div>
              <div class="right">{{details.occurOuName}}</div>
            </div>
          </div>
          <div class="table-view-cell" v-if="details.payType == 100 || details.payType == 800">
            <div class="table-view-cell-text">
              <div class="left" v-if="details.payType == 100">充值金额</div>
              <div class="left" v-else>退款金额</div>
              <div class="right">￥{{details.amountUnit}}</div>
            </div>
          </div>
          <div class="table-view-cell" v-if="details.payType == 800">
            <div class="table-view-cell-text">
              <div class="left">申请时间</div>
              <div class="right">{{details.traidtime}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left" v-if="details.payType == 100">充值时间</div>
              <div class="left" v-else-if="details.payType == 200">支付时间</div>
              <div class="left" v-else-if="details.payType == 300">退款时间</div>
              <div class="left" v-else-if="details.payType == 800">到账时间</div>
              <div class="right">{{details.paidTime}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left" v-if="details.payType == 300 || details.payType == 800">退款方式</div>
              <div class="left" v-else>支付方式</div>
              <div class="right">{{details.payModeName}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left" v-if="details.payType == 300 || details.payType == 800">退款单号</div>
              <div class="left" v-else>交易单号</div>
              <div class="right">{{details.orderNo}}</div>
            </div>
          </div>
          <div class="table-view-cell">
            <div class="table-view-cell-text">
              <div class="left" v-if="details.payType == 300 || details.payType == 800">退款备注</div>
              <div class="left" v-else-if="details.payType == 100">充值备注</div>
              <div class="left" v-else-if="details.payType == 100">交易备注</div>
              <div class="right">{{details.remark}}</div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    /**
     * payType 类型
     * 钱包充值100、钱包消费200、钱包退款300、申请退款800
     */
    data() {
      return {
        id: '', // 订单id
        details: ''
      }
    },
    mounted() {
      if (this.$route.query.id) {
        this.id = JSON.parse(this.$route.query.id)
      }
      this.queryPaymentInfo()
    },
    methods: {
      queryPaymentInfo() {
        // 电子钱包状态
        this.$request.post('/app/json/acct/queryPaymentInfo', {
          acctType: 1,
          id: this.id
        }).then(res => {
          if (res.status === 0) {
            this.details = res.data
          } else {
            this.$Toast(res.info ? res.info : '获取信息失败')
          }
        })
      },
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .bill-details {
    .bill-details-container {
      padding: 11px 15px
      .top {
        text-align center
        .img {
          img {
            width: 60px
          }
        }
        .money {
          padding: 20px 0
          .num {
            font-size 28px
          }
        }
      }
      .bottom {
        box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
        border-radius 6px
        padding: 0 5px
        margin: 10px 0
        .table-view-cell {
          padding: 15px 5px
          .left {
            color: $color-text-d
          }
        }
      }
    }
  }
</style>
