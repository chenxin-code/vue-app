<template>
  <div class="container">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="container">
      <div class="block-info">
        <img src="./images/icon-wash.png" alt="" class="icon">
        <p class="store-name">{{ detailInfo.storeName }}</p>
        <span class="price">{{ $util.toDecimal2(detailInfo.payAmount) }}</span>
        <span class="state red" v-if="detailInfo.rechargeState == 40">紧急停止</span>
        <span class="state red" v-else-if="detailInfo.rechargeState == 0">启动失败</span>
        <span class="state green" v-else-if="detailInfo.rechargeState == 5">待使用</span>
        <span class="state red" v-else-if="detailInfo.rechargeState == 10">洗车中</span>
        <span class="state green" v-else-if="detailInfo.rechargeState == 20">洗车完成</span>
        <span class="state gray" v-else-if="detailInfo.rechargeState == 30">暂停超时</span>
        <span class="state gray" v-else>其他</span>
      </div>
      <div class="block-info">
        <div class="item">
          <p class="label">服务名称</p>
          <p class="content">{{ detailInfo.utilityTypeName }}</p>
        </div>
        <div class="item">
          <p class="label">服务价格</p>
          <p class="content">{{ detailInfo.totalAmount }}</p>
        </div>
        <div class="item">
          <p class="label">现金金额</p>
          <p class="content">{{ detailInfo.payAmount }}</p>
        </div>
        <div class="item">
          <p class="label">券抵扣金额</p>
          <p class="content">{{ detailInfo.couponAmount }}</p>
        </div>
      </div>
      <div class="block-info">
        <div class="item">
          <p class="label">订单编号</p>
          <p class="content">{{ detailInfo.tradeNo }}</p>
        </div>
        <div class="item">
          <p class="label">支付时间</p>
          <p class="content">{{ detailInfo.payTime }}</p>
        </div>
        <div class="item">
          <p class="label">支付方式</p>
          <p class="content">{{ detailInfo.payModeStr }}</p>
        </div>
        <div class="item">
          <p class="label">完成时间</p>
          <p class="content">{{ detailInfo.completeTime }}</p>
        </div>
      </div>
      <div class="block-info">
        <div class="item">
          <p class="label">联系商家</p>
          <p class="content">{{ detailInfo.storePhone }}</p>
        </div>
      </div>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {
      detailInfo: {}
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.$Loading.open()
      this.$http.post('/app/json/app_self_car_order/detail', {
        orderType: this.$route.query.orderType,
        orderId: this.$route.query.orderId
      }).then(res => {
        this.$Loading.close()
        let data = res.data
        if (data.status == 0) {
          this.detailInfo = data.data || {}
        } else {
          this.$Toast(data.info)
        }
      }).catch(err => {
        this.$Loading.close()
        this.$Toast(`detail err ${err}`)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';
.container {
  background-color #F5F5F5;
  .block-info {
    background-color #fff;
    margin 10px 15px;
    border-radius 5px;
    padding 15px;
    text-align center;
    .icon {
      display block;
      width 48px;
      height 48px;
      margin 0 auto;
    }
    .store-name {
      font-size 15px;
      font-weight 500;
      margin-top 10px;
    }
    .price {
      font-size 18px;
      font-weight 500;
      color #FF6745;
      margin-top 10px;
      display block;
    }
    .state {
      display block;
      font-size 12px;
      color #666;
      margin-top 10px;
    }
    .item {
      display flex;
      justify-content space-between;
      padding 5px 0;
      .label {
        font-size 12px;
        color #909090;
        line-height 15px;
      }
      .content {
        font-size 12px;
        color #333;
        line-height 15px;
      }
    }
  }
}
</style>