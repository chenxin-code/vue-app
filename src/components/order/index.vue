<template>
  <div class="order-box">
    <nav-top></nav-top>
  </div>
</template>

<script>
import navTop from '@/components/order/nav-top/nav-top'
import orderItem from '@/components/order/order-item/order-item'
export default {
  data() {
    return {
       active: 2
    }
  },
  components: {
    navTop,
    orderItem
  }
}
</script>


<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
#app .router_class.order-box {
  background: #F9F9F9;
}
.van-tab__pane, .van-tab__pane-wrapper {
  padding-top: 10px;
}
</style>