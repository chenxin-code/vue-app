<template>
  <div class="subscribe-container">
    <nav-top @backEvent="$router.go(-1)" :bgImg="'1'" :navTopStyle="{background: 'transparent'}" title="预约报价"></nav-top>
    <nav-content class="container">
      <img class="success" src="./images/icon.png" alt="">
      <div class="title">预约报价成功！</div>
      <div class="sub-title">我们将尽快与你取得联系</div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'success',
    data() {
      return {}
    },
    mounted() {
    },
    methods: {},
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .subscribe-container {
    background: url('./images/bg.png') no-repeat
    background-size: 100% 100%;

    .container{
      text-align center
    }
    .success {
      width 100px;
      margin 80px auto 20px;
      display block
    }

    .title{
      font-size:24px;
      padding 15px;
      color #fff
    }
    .sub-title{
      font-size:18px;
      color #fff
    }
  }
</style>
