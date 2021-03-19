<template>
  <div class="pay-div">
    <div>
      <div class="pay-box" v-show="isShow">
        <van-checkbox v-model="isChecked" checked-color="#f80f16" @click="checkEvent($event)" icon-size="18px"></van-checkbox>
        <div class="text">
          <p class="p1">全选</p>
          <p class="p2">(仅可全选{{type}}类订单)</p>
        </div>
      </div>
    </div>
    <div class="pay">
      <p class="pr">合计<span>￥0.00</span></p>
      <div class="btn" @click="mergePay"><p>去结算</p></div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'checkData',
  ],
  data() {
    return {
      isChecked: false,
      isShow: false,
      type: ''
    }
  },
  methods: {
    checkEvent(event) {
      let arr = Array.from(this.checkData)
      if (arr.length == 0) return
      let data = {}
      data.type = arr[0].type
      data.checked = this.isChecked
      data.checkAll = true
      this.$emit('checkEvent', data)
    },
    mergePay(){
      this.$emit('mergePay')
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
  padding: 0 10px;
  .pay-box {
    display: flex;
    .text {
      p {
        padding-left: 4px;
      }
      .p1 {
        font-size: 16px;
        font-family: SourceHanSansCN-Normal, SourceHanSansCN;
        font-weight: 400;
        color: #121212;
        line-height: 16px;
      }
      .p2 {
        font-size: 10px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 16px;
      }
    }
  }
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
      margin-left: 6px;
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