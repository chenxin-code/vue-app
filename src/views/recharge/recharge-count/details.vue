<template>
  <div class="reset-bg">
    <nav-top @backEvent="$router.go(-1)" title="详情"></nav-top>
    <!-- 内容区域 -->
    <nav-content>
      <div class="container">
        <div class="result-c">
          <img
            v-if="detailsType == 1"
            class="result-img"
            src="../assets/image/details-recharge.png"
            alt="">
          <img
            v-else-if="detailsType == 2"
            class="result-img"
            src="../assets/image/details-consumption.png"
            alt="">
          <p class="result-text">{{ typeName }}</p>
          <p class="service-title">
            <span>服务项目</span>
            <span>次数</span>
          </p>
          <ul class="service-list">
            <li class="service-item">
              <span>汽车保养</span>
              <span>+10</span>
            </li>
            <li class="service-item">
              <span>维修</span>
              <span>+11</span>
            </li>
          </ul>
        </div>
        <van-cell-group class="res-details">
          <van-field
            input-align="right"
            :readonly="true"
            v-model="rechargeResult.orderNumber"
            :label="orderNumName">
            <div
              slot="button"
              class="copy-btn"
              @click="copyHandler">复制</div>
          </van-field>
          <van-field
            :readonly="true"
            input-align="right"
            v-model="rechargeResult.arrivalTime"
            :label="timeName"/>
          <div v-if="detailsType == 1">
            <van-field
              :readonly="true"
              input-align="right"
              v-model="rechargeResult.arrivalTime"
              label="到帐时间"/>
            <van-field
              :readonly="true"
              input-align="right"
              v-model="rechargeResult.payType"
              label="支付方式"/>
            <van-field
              :readonly="true"
              input-align="right"
              v-model="rechargeResult.realPrice"
              label="实际支付金额"/>
          </div>

        </van-cell-group>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import Clipboard from '../assets/utils/copy.js'
  import { Toast } from 'vant'
  export default {
    name: 'recharge-result',
    data() {
      return {
        detailsType: 1, // 1 充值 2 线下消费
        typeName: '充值',
        orderNumName: '充值订单号',
        timeName: '支付时间',
        rechargeResult: {
          orderNumber: 2345543522,
          arrivalTime: '2019-02-28 12:34:00',
          payType: '微信',
          realPrice: '￥99'
        }
      }
    },
    mounted() {
      this.detailsType = this.$route.query.detailsType
      this.dealType()
    },
    methods: {
      // 查看我的卡包
      myCards() {
        console.log('查看我的卡包')
      },
      // 复制
      copyHandler() {
        Clipboard(this.rechargeResult.orderNumber + '', function (isCopy) {
          if (isCopy) {
            Toast('复制成功！')
          } else {
            Toast('复制失败！')
          }
        })
      },
      dealType() {
        if (this.detailsType == 1) {
          this.typeName = '充值'
          this.orderNumName = '充值订单号'
          this.timeName = '支付时间'
        } else if (this.detailsType == 2) {
          this.typeName = '线下消费'
          this.orderNumName = '消费订单号'
          this.timeName = '消费时间'
        }
      }
    },
    computed: {
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
    background-color #fff
    text-align center
    .result-img {
      display block
      width 50px
      margin 30px auto 0
    }
    .result-text {
      font-size 17px
      margin-top 10px
    }
    .service-title {
      display flex
      justify-content space-between
      padding 0 20px
      font-size 15px
      margin-top 20px
      span {
        display block
        width 100%
        text-align center
      }
    }
    .service-list {
      margin 15px 0 0
      font-size 16px
      color #DD4238
      .service-item {
        padding 0 20px
        display flex
        justify-content space-between
        margin-bottom 10px
        span {
          width 100%
          text-align center
        }
      }
    }
  }
  .res-details {
    margin-top 10px
    /deep/ .van-field__label {
      color #676767
    }
    .copy-btn {
      font-size 12px
      color #DD4238
      border 1px solid #DD4238
      height 20px
      line-height 20px
      width 30px
      text-align center
      border-radius 3px
    }
  }
</style>
