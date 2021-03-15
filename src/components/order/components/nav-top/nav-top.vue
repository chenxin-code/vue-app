<template>
  <div class="nav-top">
    <i class="icon"></i>
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
  background: #fff;
  .icon {
    display: inline-block;
    width:20px;
    height: 20px;
    background: url("../../img/back.png") no-repeat;
    background-size: 20px auto;
    position relative;
    top: 2px;
  }
  .title {
    font-size: 24px;
    color: #121212;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
  }
}
</style>