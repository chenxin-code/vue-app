<template>
  <div class="reset-bg">
    <nav-top @backEvent="$router.go(-1)" title="支付成功"></nav-top>
    <!-- 内容区域 -->
    <nav-content>
      <div v-if="complete">
        <div class="container">
          <div class="result-c">
            <img class="result-img" src="../assets/image/result.png" alt="">
            <p class="result-text">{{rechargeResult.haveEasyCard == true ? '充值' : '开卡并充值'}}成功!</p>
          </div>
          <van-cell-group class="res-details">
            <van-field
              input-align="right"
              :readonly="true"
              v-model="rechargeResult.tradeNo"
              label="充值订单号"/>
            <van-field
              :readonly="true"
              input-align="right"
              v-model="rechargeResult.amount"
              label="到帐金额"/>
            <van-field
              :readonly="true"
              input-align="right"
              v-model="rechargeResult.arrivalTime"
              label="到帐时间"/>
          </van-cell-group>
        </div>
        <public-submit @click="myCards">查看我的卡包</public-submit>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import {Toast} from 'vant'
  import PublicSubmit from '../components/public-submit.vue'

  export default {
    name: 'recharge-result',
    data() {
      return {
        rechargeResult: '', // 支付成功信息
        complete: false
      }
    },
    mounted() {
      this.rechargeDetails()
    },
    methods: {
      myCards() {
        // 查看我的卡包
        this.$router.push({path: '/recharge/my-card'})
      },
      rechargeDetails() {
        // 支付详情
        let paramsData = {
          token: this.$store.state.login.token,
          orderType: this.$route.query.orderType,
          // orderType: '200015',
          orderId: this.$route.query.shoppingOrderId
          // orderId: 1396
        }
        this.$request.post('/app/json/app_user_easy_card/rechargeDetails', paramsData).then(res => {
          if (res.status == 0) {
            this.complete = true
            this.rechargeResult = res.data
          } else {
            this.$Toast(res.info)
          }
        })
      }
    },
    components: {
      PublicSubmit,
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
    height 140px; /*no*/
    background-color #fff
    padding-top: 25px
    display: flex
    justify-content: center
    align-items: center
    flex-direction: column
  }

  .result-img {
    display block
    width 50px
  }

  .result-text {
    font-size 17px
    margin-top 20px
  }

  .res-details {
    margin-top 10px

    /deep/ .van-field__label {
      color #676767
    }
  }
</style>
