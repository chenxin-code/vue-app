<template>
  <!-- // created by hjc 订单详情 -->
  <div class="orderDetail">
    <nav-top @backEvent="$router.go(-1)" title="订单详情"></nav-top>
  </div>
</template>

<script>
export default {
  name: "orderDetail",
  props: {},
  data() {
    return {};
  },
  created() {},
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
</style>

