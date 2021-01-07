<template>
  <div>
    <nav-top title="加油详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="order-container">
      <div class="order-list">
        <div class="order-item">
          <div class="info">
            <div class="cell">
              <span class="label">员工</span>
              <span class="con">{{detail.refuelCashierName}}</span>
            </div>
            <div class="cell">
              <span class="label">加油时间</span>
              <span class="con">{{detail.submitTime}}</span>
            </div>
            <div class="cell">
              <span class="label">加油油品</span>
              <span class="con">{{detail.refuelOilName}}</span>
            </div>
            <div class="cell" v-if="detail.refuelLiter">
              <span class="label">加油升数</span>
              <span class="con">{{detail.refuelLiter}}L</span>
            </div>
          </div>
          <div class="status" @click="detailHandle(detail)">
            <template v-if="detail.state == 1">
              <img class="icon" src="../images/icon-pending.png" alt="">
              <div class="text">待支付</div>
            </template>
            <template v-else-if="detail.state == 3">
              <img class="icon" src="../images/icon-complete.png" alt="">
              <div class="text dark">已支付</div>
            </template>
            <template v-else-if="detail.state == 7 || detail.state == 8">
              <img class="icon" src="../images/icon-cancel.png" alt="">
              <div class="text dark">已取消</div>
            </template>
          </div>
        </div>
        <div class="order-item">
          <div class="info">
            <div class="cell between">
              <span class="label">订单金额</span>
              <span class="con">￥{{detail.realAmount}}</span>
            </div>
            <div class="cell between">
              <span class="label">油点抵扣</span>
              <span class="con">-￥{{detail.rewardsAmount}}</span>
            </div>
            <div class="cell between">
              <span class="label">加油券抵扣</span>
              <span class="con">-￥{{detail.couponAmount - detail.corpCouponAmount}}</span>
            </div>
            <div class="cell between">
              <span class="label">营联券抵扣</span>
              <span class="con">-￥{{detail.corpCouponAmount}}</span>
            </div>
            <div class="cell between price">
              <span class="label">实付</span>
              <span class="con">￥{{detail.payAmount}}</span>
            </div>
          </div>
        </div>
        <div class="order-item">
          <div class="info">
            <div class="cell between">
              <span class="label">加油人手机号</span>
              <span class="con">{{detail.userName}}</span>
            </div>
            <div class="cell between">
              <span class="label">订单编码</span>
              <span class="con">{{detail.tradeNo}}</span>
            </div>
            <div class="cell between">
              <span class="label">支付方式</span>
              <span class="con">{{detail.orderType | orderType}}</span>
            </div>
            <div class="cell between">
              <span class="label">油站编码</span>
              <span class="con">{{detail.storeStandCode}}</span>
            </div>
            <div class="cell between">
              <span class="label">油站名称</span>
              <span class="con">{{detail.storeName}}</span>
            </div>
            <div class="cell between">
              <span class="label">油枪编号</span>
              <span class="con">{{detail.refuelGunNo}}</span>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'list',
    data() {
      return {
        detail: null
      }
    },
    created() {
      this.detail = this.$route.params.detail
      if (!this.detail) {
        this.$router.back()
      }
    },
    methods: {},
    filters: {
      orderType(val) { // 100011：APP闪付  100002002：扫码支付   100027002：无感支付
        let type = ''
        if (val == 100011) {
          type = 'APP闪付'
        } else if (val == 100002002) {
          type = '扫码支付'
        } else if (val == 100027002) {
          type = '无感支付'
        }
        return type
      }
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/mixin.styl"
  .order-container {
    .order-list {
      background: #f3f3f3
      height 100%

      .order-item {
        padding 15px 11px;
        background: #fff;
        display flex
        align-items center

        .info {
          padding-right 5px;
          flex 1
        }

        & + .order-item {
          margin-top: 10px
        }

        .cell {
          font-size: 14px;

          &.between {
            display flex
            justify-content space-between
          }

          &.price {
            margin-top: 10px;
            bdr-t()
            font-size: 16px;

            .label {
              color #333
            }

            .con {
              color #bb313d
            }
          }

          & + .cell {
            padding-top: 14px;
          }

          .label {
            color #727272
            display inline-block
            padding-right: 10px;
          }
        }

        .status {
          flex-shrink 0
          text-align center
          padding-left 10px
          bdr-l()

          .icon {
            width 24px;
          }

          .text {
            font-size: 16px;
            color #bb313d
            padding 6px 0;
          }

          .dark {
            color #727272
          }

          .detail {
            color #727272
          }
        }
      }
    }
  }
</style>
