<template>
<!-- 
  billType: 
  dataList: [ 商品数组
    {
      billType: 订单类型
      billName: 订单名称
      billAmount: 订单金额
      billNum: 订单数量
    }
  ]
  surplusCommodity: 剩余商品
  amount: 金额
  submitTime: 提交时间

 -->
  <div class="order-item">
    <div class="title">
      <van-checkbox v-if="isWaitPay" v-model="isChecked" :disabled="isDisabled" @change="checkEvent($event, {type: type, id:id})" checked-color="#f80f16" icon-size="18px"></van-checkbox>
      <i class="icon" :class="iconClass"></i>
      <span>{{billTypeName}}</span>
    </div>
    <div class="product-box" :class="[isShow ? 'show' : '']">
      <product-item v-for="(item,index) in dataList" :key="index" :productItem="item"></product-item>
    </div>
    <div class="show-product-btn" @click="switchProductList" v-if="dataList.length > 2">
      <p v-show="!isShow">显示剩余{{dataList.length - 2}}件商品</p>
      <p v-show="isShow">收起商品</p>
      <i class="ico">></i>
    </div>
    <div class="need-pay" v-if="billType!=11">
      <p class="time">{{submitTime}}</p>
      <p class="pr"><i>实付款：</i>￥{{amount}}</p>
    </div>
    <div class="total" v-if="billType==11">
      <span class="to">共<i>{{dataList.length}}</i>件商品</span>
      <span class="pr"><i>实付款：</i>￥{{amount}}</span>
    </div>
    <div class="btn-box">
      <div class="btn default" v-if="isBuyAgain"><p>再次购买</p></div>
      <div class="btn default" v-if="isViewLogistics"><p>查看物流</p></div>
      <div class="btn" v-if="isWaitTakeDelivery"><p>确认收货</p></div>
      <div class="btn" v-if="isEvalute"><p>立即评价</p></div>
      <div class="btn" v-if="isFinish"><p>已完成</p></div>
    </div>
  </div>
</template>

<script>
import productItem from "@/components/order/components/product-item/product-item";
export default {
  props: [
    'pageType',
    'amount',
    'billType',
    'submitTime',
    'dataList'
  ],
  data() {
    return {
      isChecked: false,
      isDisabled: false,
      isShow: false
    }
  },
  computed: {
    isEvalute() { //评价
      return this.pageType == 'finish'
    },
    isBuyAgain() { //再次购买
      return (this.pageType == 'waitDelivery' || this.pageType == 'cancel' || this.pageType == 'finish') && this.billType == 11
    },
    isFinish() { //已完成
      return this.pageType=='finish' && this.billType != 11
    },
    isViewLogistics() { //查看物流
      return this.pageType=='waitTakeDelivery' && this.billType == 11
    },
    isWaitTakeDelivery() { //确认收货
       return this.pageType=='waitTakeDelivery' && this.billType == 11
    },
    isWaitPay() { //支付页
      return this.pageType == 'waitPay' ? true : false
    },
    billTypeName() {
      let billName = ''
      switch(this.billType) {
      case 11:
        billName = '邻里星选'
        break;
      case 1:
        billName = '物业缴费'
        break;
      case 2:
         billName = '月保续费'
         break;
      case 3:
         billName = '临停缴费'
         break;
      case 6:
         billName = '预缴费'
         break;
      case 4:
         billName = '临时缴费'
         break;
      case 7:
         billName = '旅游'
         break;
      case 8:
         billName = '家政'
         break;
      case 9:
         billName = '拎包'
         break;
      case 10:
         billName = '押金'
         break; 
     }
     return billName
    },
    iconClass() {
      let sClass = ''
      switch (this.billType) {
        case 11:
          sClass = 'icon1'
        break
        case 1:
          sClass = 'icon7'
        break
        case 2:
          sClass = 'icon8'
        break
        case 3:
          sClass = 'icon5'
        break
        case 6:
          sClass = 'icon4'
        break
        case 4:
          sClass = 'icon4'
        break
        case 7:
          sClass = 'icon6'
        break
        case 8:
          sClass = 'icon2'
        break
        case 9:
          sClass = 'icon3'
        break
        case 10:
          sClass = 'icon4'
        break
      }
      return sClass
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
      console.log(this.orderItem)
    }
  },
  created() {
    console.log('3333333333', this.submitTime)
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