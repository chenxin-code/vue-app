<template>
  <div class="nav-top">
    <i class="icon"><</i>
    <span class="title">我的订单</span>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  }
}
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
.nav-top {
  padding: 16px;
  .icon {
    display: inline-block;
    margin-right: 12px;
  }
  .title {
    font-size: 24px;
    color: #121212;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
  }
}
</style>