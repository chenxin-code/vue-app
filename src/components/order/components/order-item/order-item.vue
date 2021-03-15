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
    height: 30px;
    line-height: 30px;
    .icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url("../../img/icon1.png") no-repeat;
      background-size: 20px 20px;
      position relative;
      top: 5px;
    }
    span {
      font-size: 16px;
      padding-left: 6px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #121212;
    }
  }
}
</style>