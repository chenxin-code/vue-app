<template>
  <div class="pay-div">
    <van-checkbox v-model="isChecked" checked-color="#f80f16" icon-size="18px"></van-checkbox>
    <div class="pay">
      <p class="pr">合计<span>￥0.00</span></p>
      <div class="btn"><p>去结算</p></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isChecked: false
    }
  }
}
</script>

<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';
.pay-div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 52px;
  line-height: 52px;
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  padding: 0 14px;
  .pay {
    display: flex;
    justify-content: flex-end;
    align-items: center;
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
      p {
        font-weight: 500;
        color: #FFFFFF;
        font-size: 14px;
        position: relative;
        top: -1px;
      }
    }
  }
}
</style>