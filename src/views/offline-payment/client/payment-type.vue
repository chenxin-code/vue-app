<template>
  <div class="payment-type">
    <nav-top title="支付类型" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="payment-type-content">
      <div class="tabs" @click="goPayType(0)">加油支付</div>
      <div class="tabs goods-pay" @click="goPayType(1)">商品支付</div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
      goPayType(type) {
        let codeObj = this.$route.query.codeObj
        if (type == 0) {
          // 0 加油支付 1 商品支付
          // this.$router.push({path: '/offline_payment/oil_pay'})
          this.$router.push({path: '/scan_refuel', query: {codeObj: codeObj, source: 'offline'}})
        } else {
          this.$router.push({path: '/offline_payment/goods_pay', query: {codeObj: codeObj}})
        }
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .payment-type {
    .payment-type-content {
      padding: 11px 15px
      .tabs {
        padding: 20px 30px
        line-height 50px
        color: #fff
        font-size 18px
        border-radius 6px
        background url("../image/oil-pay.png")
        background-size 100% 100%
        &.tabs {
          margin-bottom 10px
        }
      }
      .goods-pay {
        background url("../image/goods-pay.png")
        background-size 100% 100%
      }
    }
  }
</style>
