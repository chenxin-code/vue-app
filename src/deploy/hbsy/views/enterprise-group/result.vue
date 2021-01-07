<template>
  <div class="enterprise-group-result">
    <nav-top title="企业群组"  @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <template v-if="isSuccess">
        <img class="msg" src="./images/success.png" alt="">
        <p class="tip">您已成功加入企业群组~</p>
      </template>
      <template v-else>
        <img class="msg" src="./images/qrcode-fail.png" alt="">
        <p class="tip">二位码已失效~</p>
      </template>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'success',
    data() {
      return {}
    },
    computed: {
      isSuccess() {
        return this.$route.query.type === 'success'
      }
    },
    mounted() {
    },
    methods: {},
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .enterprise-group-result {
    text-align center
    .msg {
      width 40%;
      margin 40px auto
      display block
    }
    .tip{
      text-align center
      font-size:16px;
      padding-top:20px;
    }

    .footer-btn {
      position: absolute;
      bottom 20px;
      left: 15px;
      right 15px;

      .img {
        width 100%
      }
    }
  }
</style>
