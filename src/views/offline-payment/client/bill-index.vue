<template>
  <div class="payment-type">
    <nav-top title="离线支付凭证" @backEvent="$router.go(-1)"></nav-top>
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
        // 0 加油支付 1 商品支付
        if (type == 0) {
          this.$router.push({
            path: "/firmScanOrder",
            query: {source: 'offline'}
          });
        } else {
          this.$router.push({path: "/firmScanOfflineOrder"});
        }

        // this.$router.push({path: "/firmScanOfflineOrder", query: {type: type}});
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
        background url("../image/oil2.png")
        background-size 100% 100%
        &.tabs {
          margin-bottom 10px
        }
      }
      .goods-pay {
        background url("../image/goods.png")
        background-size 100% 100%
      }
    }
  }
</style>
