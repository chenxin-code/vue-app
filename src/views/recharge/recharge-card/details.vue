<template>
  <div class="reset-bg">
    <nav-top @backEvent="$router.go(-1)" title="详情"></nav-top>
    <!-- 内容区域 -->
    <nav-content>
      <div class="container">
        <div class="result-c">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">充值金额</div>
                <div class="right">+{{tradeInfo.amount}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="info">
          <div class="table-view">
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">类型</div>
                <div class="right">{{tradeInfo.payTypeName}}</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">实际支付金额</div>
                <div class="right money">￥{{tradeInfo.payAmount}}</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">充值订单号</div>
                <div class="right">{{tradeInfo.tradeNo}}</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">支付时间</div>
                <div class="right">{{tradeInfo.tradeTime}}</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">到账时间</div>
                <div class="right">{{tradeInfo.arrivalTime}}</div>
              </div>
            </div>
            <div class="table-view-cell">
              <div class="table-view-cell-text">
                <div class="left">支付方式</div>
                <div class="right">{{tradeInfo.payModeName}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import Clipboard from '../assets/utils/copy.js'
  import {Toast} from 'vant'

  export default {
    name: 'recharge-result',
    data() {
      return {
        tradeInfo: '' // 详情
      }
    },
    mounted() {
      this.detailsType = this.$route.query.detailsType
      this.tradeDetails()
      this.dealType()
    },
    methods: {
      tradeDetails() {
        // 获取交易详情
        let paramsData = {
          token: this.$store.state.login.token,
          orderId: this.$route.query.orderNo
        }
        this.$request.post('/app/json/app_user_easy_card/tradeDetails', paramsData).then(res => {
          if (res.status == 0) {
            this.tradeInfo = res.data
          } else {
            this.$Toast(res.info)
          }
        })
      },
      // 复制
      copyHandler() {
        Clipboard(this.rechargeResult.orderNumber + '', function (isCopy) {
          if (isCopy) {
            Toast('复制成功！')
          } else {
            Toast('复制失败！')
          }
        })
      },
      dealType() {
        if (this.detailsType == 1) {
          this.typeName = '充值'
          this.orderNumName = '充值订单号'
          this.timeName = '支付时间'
        } else if (this.detailsType == 2) {
          this.typeName = '商城消费'
          this.orderNumName = '消费订单号'
          this.timeName = '消费时间'
        } else if (this.detailsType == 3) {
          this.typeName = '商城退款'
          this.orderNumName = '退款订单号'
          this.timeName = '退款时间'
        }
      }
    },
    computed: {},
    components: {
      Toast
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl'
  @import '~@/common/stylus/mixin.styl'
  .reset-bg {
    background-color #F6F6F6 !important
  }

  .container {
    height 100%
    overflow-y auto
    padding-bottom 80px

    .result-c {
      margin-bottom: 10px
      background #fff
      padding: 0 10px
      line-height 20px
      font-size: 16px

      .right {
        color: $color-theme-r
        font-size: 20px
      }
    }

    .info {
      background #fff
      padding: 0 10px
      line-height 20px
      font-size: 14px

      .left {
        color: $color-text-d
      }
      .money {
        color: $color-theme-r
      }
    }
  }
</style>
