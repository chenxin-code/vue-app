<template>
  <div class="order-item">
    <div class="title">
      <van-checkbox v-model="isChecked" :disabled="isDisabled" :name="type" :id="id" @change="checkEvent($event, {name: type, id:id})" checked-color="#f80f16" icon-size="18px"></van-checkbox>
      <i class="icon" :class="iconClass('icon2')"></i>
      <span>邻里星选</span>
    </div>
    <div class="product-box" :class="[isShow ? 'show' : '']">
      <product-item></product-item>
    </div>
    <div class="show-product-btn" @click="switchProductList">
      <p v-show="!isShow">显示剩余1件商品</p>
      <p v-show="isShow">收起商品</p>
      <i class="ico">></i>
    </div>
    <div class="need-pay">
      <p class="time">2020-03-05 22:08:09</p>
      <p class="pr"><i>实付款：</i>￥2289.00</p>
    </div>
    <div class="total">
      <span class="to">共<i>1</i>件商品</span>
      <span class="pr"><i>实付款：</i>￥2289.00</span>
    </div>
    <div class="btn-box">
      <div class="btn"><p>再次购买</p></div>
      <div class="btn default"><p>查看物流</p></div>
      <div class="btn"><p>确认收货</p></div>
    </div>
  </div>
</template>

<script>
import productItem from "@/components/order/components/product-item/product-item";
export default {
  props: [
    'type',
    'id'
  ],
  data() {
    return {
      isChecked: false,
      isDisabled: false,
      isShow: false
    }
  },
  computed: {
    iconClass() {
      return (str) => {
        let sClass = ''
        switch (str) {
          case 'icon1':
            sClass = 'icon1'
          break
          case 'icon2':
            sClass = 'icon2'
          break
          case 'icon3':
            sClass = 'icon3'
          break
          case 'icon4':
            sClass = 'icon4'
          break
          case 'icon5':
            sClass = 'icon5'
          break
          case 'icon6':
            sClass = 'icon6'
          break
          case 'icon7':
            sClass = 'icon7'
          break
          case 'icon8':
            sClass = 'icon8'
          break
        }
        return sClass
      }
    }
  },
  components: {
    productItem
  },
  methods: {
    switchProductList() {
      this.isShow = !this.isShow
    },
    checkEvent(event,data) {
      // console.log(event, data)
      data.checked = event
      this.$emit('checkEvent', data)
    }
  }
};
</script>

<style lang="stylus" scoped type="text/stylus">
@import '~@/common/stylus/variable.styl';
.order-item {
  width: 359px;
  background: #FFFFFF;
  margin: 0 auto;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  .title {
    display: flex;
    height: 30px;
    line-height: 30px;
    .van-checkbox {
       position: relative;
       top: 0px;
       margin-right: 4px;
    }
    .icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url('../../img/icon1.png') no-repeat;
      background-size: 20px 20px;
      position: relative;
      top: 5px;
      &.icon1 {
        background-image: ur('../../img/icon1.png');
      }
      &.icon2 {
        background-image: url('../../img/icon2.png');
      }
      &.icon3 {
        background-image: url('../../img/icon3.png');
      }
      &.icon4 {
        background-image: url('../../img/icon4.png');
      }
      &.icon5 {
        background-image: url('../../img/icon5.png');
      }
      &.icon6 {
        background-image: url('../../img/icon6.png');
      }
      &.icon7 {
        background-image: url('../../img/icon7.png');
      }
      &.icon8 {
        background-image: url('../../img/icon8.png');
      }
    }
    span {
      font-size: 16px;
      padding-left: 6px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #121212;
    }
  }
  .content {
    padding-top: 16px;
    display: flex;
    justify-content: space-between;
    .img {
      display: flex;
      width: 240px;
      img {
        width: 90px;
        height: 90px;
      }
      .text {
        padding-left: 8px;
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #121212;
        line-height: 21px;
      }
      .desc {
        padding-left: 8px;
        strong {
          font-size: 17px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          line-height: 27px;
          color: #121212;
        }
        p {
          font-size: 13px;
          font-family: SourceHanSansCN-Regular, SourceHanSansCN;
          font-weight: 400;
          line-height: 21px;
          color: #D8D8D8;
        }
      }
    }
    .price {
      .pr {
        font-size: 16px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #121212;
        line-height: 24px;
      }
      .am {
        font-size: 13px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #8D8D8D;
        line-height: 20px;
        text-align: right;
      }
    }
  }
  .total {
    padding-top: 16px;
    text-align: right;
    .to {
      font-size: 14px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #8D8D8D;
      line-height: 14px;
      i {
        padding: 0 4px;
        color: #121212;
      }
    }
    .pr {
      font-size: 16px;
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #121212;
      line-height: 24px;
      i {
        color: #8D8D8D;
        font-size: 14px;
      }
    }
  }
  .need-pay {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    .time {
      font-size: 13px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #999999;
    }
    .pr {
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #121212;
      font-size: 16px;
      i {
        font-size: 14px;
        font-family: SourceHanSansCN-Regular, SourceHanSansCN;
        font-weight: 400;
        color: #999999;
      }
    }
  }
  .btn-box {
    display: flex;
    padding-top: 16px;
    justify-content: flex-end;
    .btn {
      width: 108px;
      height: 32px;
      font-size:16px;
      font-weight: bold;
      color: #e8374a;
      text-align: center;
      line-height: 32px;
      border: 1px solid #e8374a;
      border-radius: 20px;
      margin-left: 4px;
      &.default {
        color: #8d8d8d;
        border-color: #8d8d8d;
      }
      p {
        position relative;
        top: -1px;
      }
    }
  }
  .product-box {
    height: 220px;
    overflow: hidden;
    &.show {
      height: auto;
    }
  }
  .show-product-btn {
    display: flex;
    justify-content: space-between;
    width: 120px;
    padding: 10px 0;
    p {
      font-size: 14px;
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #8D8D8D;
      line-height: 14px;
    }
  }
}
</style>