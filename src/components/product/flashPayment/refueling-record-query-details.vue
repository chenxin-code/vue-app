<template>
  <div class="refueling-record-query-details">
    <nav-top title="加油订单详情" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="refueling-record-query-details-container">
      <div class="title">
        <div class="left">
          <img src="./images/icon_oil.png" alt="">
        </div>
        <div class="right">{{details.storeOuName}}</div>
      </div>
      <ul class="list">
        <li class="item">
          <div class="time">订单信息</div>
          <div class="main">
            <div class="text">
              <div class="name">订单编号</div>
              <div class="info">{{details.tradeNo}}</div>
            </div>
            <div class="text">
              <div class="name">订单总金额</div>
              <div class="info">{{accMul(details.oilLitre, details.price)}}元</div>
            </div>
            <div class="text">
              <div class="name">实付金额</div>
              <div class="info">{{details.amount || 0.00}}元</div>
            </div>
          </div>
        </li>
      </ul>
      <ul class="list">
        <li class="item">
          <div class="time">油品信息</div>
          <div class="main">
            <div class="text">
              <div class="name">油品名称</div>
              <div class="info">{{details.productName}}</div>
            </div>
            <div class="text">
              <div class="name">油品数量</div>
              <div class="info">{{details.oilLitre || 0}}L</div>
            </div>
            <div class="text">
              <div class="name">油品单价</div>
              <div class="info">{{details.price || 0.00}}元/L</div>
            </div>
          </div>
        </li>
      </ul>
      <ul class="list">
        <li class="item">
          <div class="time">支付信息</div>
          <div class="main">
            <div class="text">
              <div class="name">支付方式</div>
              <div class="info">{{details.payModeName}}</div>
            </div>
            <div class="text">
              <div class="name">支付时间</div>
              <div class="info">{{time}}</div>
            </div>
          </div>
        </li>
      </ul>
      <ul class="list">
        <li class="item">
          <div class="time">加油奖励</div>
          <div class="main">
            <div class="text">
              <div class="name">积分</div>
              <div class="info">积分</div>
            </div>
            <div class="text">
              <div class="name">优惠券</div>
              <div class="info"></div>
            </div>
          </div>
        </li>
      </ul>
    </nav-content>
  </div>
</template>

<script>
  import util from '@/utils/util'

  export default {
    data() {
      return {
        details: '', // 详情
        time: ''
      }
    },
    mounted() {
      this.details = JSON.parse(this.$route.query.details)
      this.time = util.getPreTime(this.details.tradeTime)
    },
    methods: {
      accMul(arg1,arg2) {
        // 解决js数字相乘精确度问题
        if (arg1 && arg2) {
          let m = 0, s1 = arg1.toString(), s2 = arg2.toString()
          try {
            m += s1.split('.')[1].length
          } catch(e) {}
          try {
            m += s2.split('.')[1].length
          } catch(e) {}
          return (Number(s1.replace('.','')) * Number(s2.replace('.','')) / Math.pow(10,m)).toFixed(2)
        }
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .refueling-record-query-details {
    .refueling-record-query-details-container {
      overflow-y auto
      -webkit-overflow-scrolling touch
      padding: 11px 15px
      .title {
        text-align center
        line-height 20px
        .left {
          img {
            width: 50px
          }
        }
        .right {

        }
      }
      .list {
        .item {
          .time {
            color: $color-text-d
            padding: 10px 0
          }

          .main {
            box-shadow: 0 0 15px 0 rgba(197, 197, 197, 0.5)
            background: #fff
            border-radius 6px
            padding: 11px

            .text {
              display flex
              justify-content space-between
              align-items center
              line-height 26px

              .name {
                color: $color-text-d
                padding-right: 15px
              }

              .info {
                color: $color-text
              }
            }
          }
        }
      }
    }
  }
</style>
