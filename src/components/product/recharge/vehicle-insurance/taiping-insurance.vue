<template>
  <div class="taiping-insurance">
    <nav-top title="车辆保险" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="taiping-insurance-container">
      <div class="title-img">
        <img src="./image/banner@2x.jpg" alt="">
      </div>
      <div class="tab-list">
        <div class="item" @click="openCarInsurance">
          <div class="img">
            <img src="./image/icon2.png" alt="">
          </div>
          <div class="text">购买车险</div>
        </div>
        <div class="item" @click="openMyInsurancePolicy">
          <div class="img">
            <img src="./image/icon1.png" alt="">
          </div>
          <div class="text">我的保单</div>
        </div>
      </div>
      <div class="buy-info">
        <div class="top-text">中国太平与中石化倾情奉送 投保商业险，中石化送车主大礼包，具体请咨询当地中石化油站员工。</div>
        <div class="title tips">温馨提示</div>
        <div class="content">
          <p class="info">1.商业险是指除交强险，车船税以外的险种。</p>
          <p class="info">2.投保的车辆范围：支持<span class="tips">鄂牌10座及以下非营业车。</span></p>
          <p class="info">3.为了获取最精准的和最实惠的报价，请正确填写车辆型号，可选择同型号中参考价最低的车型进行投保。</p>
          <p class="info">4.为了尽量保障您的权益，第三者责任险建议选择至少50万元保额或以上，无法找到第三方特约险也建议选择。</p>
          <p class="info">5.中国太平客户服务电话：95589</p>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
      openCarInsurance() {
        // 打开车险
        this.$router.push({path: '/vehicle-insurance'})
      },
      openMyInsurancePolicy() {
        // 打开我的保单
        this.$router.push({path: '/my-insurance-policy'})
      }
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .taiping-insurance {
    .taiping-insurance-container {
      background-color #f6f6f6
      .title-img {
        height: 120px
        img {
          width: 100%
          height: 100%
          vertical-align top
        }
      }
      .tab-list {
        display flex
        justify-content space-between
        align-items center
        padding: 20px 0
        background #fff
        .item {
          display flex
          justify-content center
          align-items center
          flex-direction column
          line-height 20px
          flex: 1
          img {
            width: 30px
          }
        }
      }
      .buy-info {
        margin-top: 10px
        background #fff
        line-height 24px
        padding: 11px 15px
        .top-text {
          font-size 12px
          color: $color-text-d
        }
        .tips {
          color: $color-theme-text-d
        }
        .title {
          font-size: 18px
          padding 3px 0
        }
        .content {
          color: $color-text-d
          font-size 12px
        }
      }
    }
  }
</style>
