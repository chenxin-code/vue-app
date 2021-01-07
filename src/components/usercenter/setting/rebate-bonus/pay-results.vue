<template>
  <div class="reset-bg">
    <nav-top @backEvent="$router.go(-1)" title="支付成功"></nav-top>
    <!-- 内容区域 -->
    <nav-content>
      <div class="container">
        <div class="result-c">
          <img class="result-img" src="../../../../views/recharge/assets/image/result.png" alt="">
          <p class="result-text">支付成功</p>
        </div>
        <van-cell-group class="res-details">
          <van-field
            input-align="right"
            :readonly="true"
            v-model="payMode"
            label="支付方式"/>
          <van-field
            :readonly="true"
            input-align="right"
            v-model="useNum"
            label="使用数量"/>
          <van-field
            :readonly="true"
            input-align="right"
            v-model="payAmount"
            label="抵扣金额"/>
        </van-cell-group>
      </div>
      <div class="submit-btn" @click="goBack">返回</div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import { Toast } from 'vant'
  export default {
    name: 'recharge-result',
    data() {
      return {
        payMode: '', // 支付方式 120: 积分  121: 奖励金  122: 员工奖励金 123: 企业奖励金
        useNum: '', // 使用数量
        payAmount: '', // 抵扣金额
        payInfo: '' // 支付成功信息
      }
    },
    mounted() {
      if (this.$route.query.payInfo) {
        this.payInfo = JSON.parse(this.$route.query.payInfo)
        console.log(this.payInfo)
        const rewards = this.$store.state.globalConfig.acctList.find(item => item.acctType === 'Rewards')
        this.useNum = this.payInfo.payUnit ? this.payInfo.payUnit : 0 + rewards ? rewards.displayUnit : ''
        this.payAmount = (this.payInfo.payAmount ? this.payInfo.payAmount : 0) + '元'
        if (this.payInfo.payMode == 120) {
          this.payMode = '积分'
        } else if (this.payInfo.payMode == 121) {
          this.payMode = '奖励金'
        } else if (this.payInfo.payMode == 122) {
          this.payMode = '员工奖励金'
        } else if (this.payInfo.payMode == 123) {
          this.payMode = '企业奖励金'
        } else if (this.payInfo.payMode == 110) {
          this.payMode = '电子账户'
        }
      }
    },
    methods: {
      // 返回按钮
      goBack() {
        this.$router.go(-1)
      }
    },
    components: {
      Toast
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl'
  @import '~@/common/stylus/mixin.styl'
  .reset-bg {
    background-color #F6F6F6 !important
  }
  .container {
    height 100%
    overflow-y auto
    padding-bottom 80px
  }
  .result-c {
    overflow hidden
    height 200px
    background-color #fff
    .result-img {
      display block
      width 50px
      margin 60px auto 0
    }
    .result-text {
      font-size 17px
      text-align center
      margin-top 25px
    }
  }
  .res-details {
    margin-top 10px
    /deep/ .van-field__label {
      color #676767
    }
  }
  .submit-btn {
    background-color: #f02c2d;
    color: #fff;
    text-align: center;
    padding: 0.32rem 0;
    border-radius: 50px;
    position: fixed;
    bottom: 20px;
    left: 0
    right: 0
    width: 90%;
    margin: 0 auto
    box-shadow: 0 3px 10px 1px rgba(240, 44, 45, 0.5);
  }
</style>
