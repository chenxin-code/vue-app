<template>
  <div class="container">
    <nav-top @backEvent="$router.go(-1)" :noBack="true"></nav-top>
    <nav-content>
      <img src="../image/icon-uccess.png" alt="" class="icon-success">
      <p class="state-text">支付成功!</p>
      <van-button type="danger" class="success-btn" round @click="viewPackageDetail">查看套餐详情</van-button>
      <p class="tip-title">温馨提示：</p>
      <p class="tip-content">您已成功购买{{ $route.query.bundleName }}套餐合约商品，享受{{ $route.query.rebateNum }}元待激活油滴返利，可前往合约套餐页面查看返利详情</p>
    </nav-content>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    viewPackageDetail() {
      this.$router.push({
        path: '/contract-package-detail',
        query: {
          packageRefuelOrderId: this.$route.query.packageRefuelOrderId
        }
      })
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  @import '~@/common/stylus/mixin.styl';
  .container {
    .icon-success {
      display block;
      width 60px;
      height 60px;
      margin 70px auto 0;
    }
    .state-text {
      font-size 15px;
      font-weight 500;
      text-align center;
      padding 11px 0;
    }
    .success-btn {
      display block;
      width 200px;
      height 40px;
      margin 75px auto 0;
    }
    .tip-title {
      font-size 15px;
      line-height 18px;
      font-weight 500;
      padding 0 10px;
      margin-top 30px;
    }
    .tip-content {
      font-size 13px;
      line-height 30px;
      color #333333;
      padding 0 10px;
      margin-top 10px;
    }
  }
</style>