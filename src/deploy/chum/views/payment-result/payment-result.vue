<template>
  <div>
    <div class="result-container">
      <div class="icon">
        <i class="iconfont mall-gou"></i>
      </div>
      <p class="result-text" v-if="entryType == 0 || entryType == 3">订单支付成功</p>
      <p class="result-text" v-else-if="entryType == 1">核销成功</p>
      <p class="result-text" v-else-if="entryType == 2">您已成功提交，请耐心等待审核</p>
    </div>
    <div class="order-info" v-if="entryType == 0 || entryType == 3">
      <p class="text">订单编号<span>{{ payResult.tradeNo }}</span></p>
      <p class="text">支付时间<span>{{ payResult.paidTime ? payResult.paidTime : payResult.payTime }}</span></p>
      <p class="text">支付金额<span>¥{{ dealWithPrice(payResult.payAmount)[2] }}</span></p>
    </div>
    <div class="order-info" v-else-if="entryType == 1 && $route.query.storeName">
      <p class="text">核销门店<span>{{ $route.query.storeName }}</span></p>
      <p class="text">核销时间<span>{{ $route.query.tradeTime }}</span></p>
      <p class="text" v-if="$route.query.sumCheckAmount">金额<span>¥{{ dealWithPrice($route.query.sumCheckAmount)[2] }}</span></p>
    </div>
    <div class="order-info" v-else-if="entryType == 2">
      <p class="text">服务单号<span>{{ $route.query.id }}</span></p>
      <p class="text">服务类型<span>退货</span></p>
      <p class="text">退款金额<span>¥{{ dealWithPrice($route.query.price)[2] }}</span></p>
      <p class="text">申请时间<span>{{ $route.query.createTime }}</span></p>
    </div>
    <div class="chum-public-btn to-coupon-btn">
      <van-button
        round
        block
        type="info"
        color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
        @click="goToCoupon"
        v-if="entryType == 0">到【服务券】查看</van-button>
      <van-button
        round
        block
        type="info"
        color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
        @click="backToHome"
        v-else-if="entryType == 1">回首页</van-button>
      <van-button
        round
        block
        type="info"
        color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
        @click="$router.go(-1)"
        v-else-if="entryType == 2">返回</van-button>
      <van-button
        round
        block
        type="info"
        color="linear-gradient(270deg,rgba(49,49,49,1) 0%,rgba(84,84,84,1) 51%,rgba(49,49,49,1) 100%)"
        @click="entryCardPackage"
        v-else-if="entryType == 3">到【我的卡包】查看</van-button>
    </div>
  </div>
</template>
<script>
import utils from '../../assets/utils/tools'
export default {
  mixins: [utils],
  data() {
    return {
      entryType: this.$route.query.entryType, // 0 订单支付成功 1 核销成功 2 退款成功 3 权益卡购买成功
      payResult: {},
    }
  },
  mounted() {
    if (this.$route.query.entryType == 0 || this.$route.query.entryType == 3) {
      this.initPayResult();
    }
  },
  methods: {
    // 到电子券
    goToCoupon() {
      this.$router.replace({
        path: '/coupon_service',
        query: {
          noBack: 1,
        }
      })
    },
    // 到我的卡包
    entryCardPackage() {
      this.$router.replace({
        path: '/my_card_case',
        query: {
          noBack: 1,
        }
      })
    },
    backToHome() {
      this.$router.replace('/common');
    },
    initPayResult() {
      this.$http.post('/app/json/app_shopping_order/detail', {
        orderType: this.$route.query.orderType,
        orderId: this.$route.query.orderId,
      }).then(res => {
        let data = res.data;
        if (data.status == 0) {
          this.payResult = data.data;
        } else {
          this.$Toast(data.info);
        }
      }).catch(err => {
        this.$Toast(`detail err ${err}`);
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/deploy/chum/assets/stylus/chum-public.styl';
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.result-container {
  margin-top 40px;
  .icon {
    width 40px;
    height 40px;
    border-radius 50%;
    background-color #49B972;
    line-height 40px;
    text-align center;
    margin 0 auto;
    .iconfont {
      color #fff;
      font-size 28px;
      font-weight 700;
    }
  }
  .result-text {
    font-size 14px;
    text-align center;
    margin-top 6px;
  }
}
.order-info {
  margin 33px 20px 0;
  padding 15px 10px;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
  border-radius 5px;
  .text {
    display flex;
    justify-content space-between;
    font-size 14px;
    margin-top 10px;
    span {
      color #9FA0A0;
    }
    &:first-child {
      margin-top 0;
    }
  }
}
.to-coupon-btn {
  position absolute
  left 20px;
  right 20px;
  bottom 10px;

}
</style>
