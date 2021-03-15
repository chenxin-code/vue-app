<template>
  <div class="pay-div">
    <p class="pr">合计<span>￥0.00</span></p>
    <div class="btn"><p>去结算</p></div>
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
.pay-div {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 52px;
  line-height: 52px;
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  .pr {
    font-size: 16px;
    font-family: SourceHanSansCN-Normal, SourceHanSansCN;
    font-weight: 400;
    line-height: 52px;
    p {
      color: #2C2C2C;
    }
    span {
      color: #FD3A3A;
    }
  }
  .btn {
    width: 100px;
    height: 40px;
    text-align:center;
    line-height: 40px;
    background: linear-gradient(270deg, #FD3A3A 0%, #FF755B 100%);
    border-radius: 20px;
    margin-left: 10px;
    margin-right: 14px;
    p {
      font-weight: 500;
      color: #FFFFFF;
      font-size: 14px;
      position: relative;
      top: -1px;
    }
  }
}
</style>