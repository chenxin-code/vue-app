<template>
  <div class="order-item">
    <div class="title">
      <i class="icon"></i>
      <span>邻里选星</span>
    </div>
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
.order-item {
  width: 359px;
  height 200px;
  background: #FFFFFF;
  margin: 0 auto;
  border-radius: 16px;
  padding: 16px;
  .title {
    .icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      // background: url("@/assets/order/icon.png");
    }
    span {
      font-size: 16px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #121212;
    }
  }
}
</style>