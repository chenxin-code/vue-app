<template>
  <!-- // created by hjc 订单列表 -->
  <div class="orderList">
    <nav-top @backEvent="$router.go(-1)" title="订单列表"></nav-top>
  </div>
</template>

<script>
export default {
  name: "orderList",
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

