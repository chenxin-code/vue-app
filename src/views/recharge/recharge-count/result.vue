<template>
  <div class="reset-bg">
    <nav-top @backEvent="$router.go(-1)" title="充值"></nav-top>
    <!-- 内容区域 -->
    <nav-content>
      <div class="container">
        <div class="result-c">
          <img class="result-img" src="../assets/image/result.png" alt="">
          <p class="result-text">充值成功！</p>
        </div>
        <van-cell-group class="res-details">
          <van-field
            input-align="right"
            :readonly="true"
            v-model="rechargeResult.orderNumber"
            label="充值订单号"/>
          <div class="service-area">
            <p class="label">服务范围</p>
            <ul class="service-list">
              <li class="ser-item">洗车 10次</li>
              <li class="ser-item">汽车保养 5次</li>
            </ul>
          </div>
          <van-field
            :readonly="true"
            input-align="right"
            v-model="rechargeResult.arrivalTime"
            label="到帐时间"/>
        </van-cell-group>
      </div>
      <public-submit @click="myCards">查看我的卡包</public-submit>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import { Toast } from 'vant'
  import PublicSubmit from '../components/public-submit.vue'
  export default {
    name: 'recharge-result',
    data() {
      return {
        rechargeResult: {
          orderNumber: 2345543522,
          price: '￥100',
          arrivalTime: '2019-02-28 12:34:00'
        }
      }
    },
    methods: {
      // 查看我的卡包
      myCards() {
        console.log('查看我的卡包')
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
    .service-area {
      display flex
      justify-content space-between
      align-items center
      margin-left 15px
      padding 10px 15px 10px 0
      bdr-b()
      .label {
        color #676767
      }
      .service-list {
        .ser-item {
          margin-top 8px
          &:first-child {
            margin-top 0
          }
        }
      }
    }
  }
</style>
