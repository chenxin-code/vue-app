<template>
  <div>
    <nav-top title="我的电子券" @backEvent="$router.go(-1)"></nav-top>
    <nav-content class="coupon-detail-container" v-if="$util.objectKeys(couponDedail).length">
      <div class="coupon-content">
        <coupon :index="4" :hasBtn="false" :item="couponDedail"></coupon>
      </div>
      <!--等于0是待激活-->
      <div class="qr-code-wrapper" v-if="couponDedail.isActive !== 0">
        <canvas class="qr-code" id="qrcode"></canvas>
        <p class="qr-code-text">{{ couponDedail.dynamicCode }}</p>
        <div class="refresh-wrapper" @click="getMyCouInfo"><i class="iconfont mall-shuaxin"></i><span
          class="refresh-text">刷新</span></div>
      </div>
      <div class="rule-warpper" v-if="couponDedail.couDesc">
        <div class="title">使用说明：</div>
        <div class="content" v-html="couponDedail.couDesc"></div>
      </div>
    </nav-content>
  </div>
</template>

<script type="text/ecmascript-6">
  import QRCode from 'qrcode'
  import Coupon from './base/coupon.vue'

  export default {
    name: '',
    data() {
      return {
        couponDedail: {},
        brightnessResult: {}
      }
    },
    mounted() {
      this.getMyCouInfo()
    },
    methods: {
      getMyCouInfo() {
        this.$Loading.open();
        let paramsData = {
          token: this.$store.state.login.token,
          couNo: this.$route.params.couNo
        }
        this.$http.post(`/app/json/coupon/getMyCouInfo`, paramsData).then(res => {
          let data = res.data
          if (data.status == 0) {
            this.couponDedail = data.data || {}
            this.$nextTick(() => {
              QRCode.toCanvas(document.getElementById('qrcode'), this.couponDedail.dynamicCode || '', {width: 240})
            })
          }
          this.$Loading.close()
        })
      }
    },
    components: {Coupon},
    destroyed() {
      this.$bridgefunc.brightness(this.brightnessResult.value, this.brightnessResult.isauto, (result) => {})
    },
    created() {
      this.$bridgefunc.brightness(1, 0, (result) => {
        this.brightnessResult = result
      })
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@/common/stylus/variable.styl"
  .coupon-detail-container {
    overflow-y: auto !important
    -webkit-overflow-scrolling touch
  }

  .coupon-content {
    padding 0 10px
    margin-top: 5px;
  }

  .qr-code-wrapper {
    text-align: center
    margin 10px;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    border-radius 5px;

    .qr-code-text {
      word-break break-all
      padding 11px
      line-height 14px
      text-align: center
    }
  }

  .refresh-wrapper {
    padding-bottom: 20px;
    color: #999;

    .iconfont {
      font-size: 30px;
      vertical-align: middle
    }

    .refresh-text {
      padding-left: 10px;
      font-size: 16px;
      vertical-align: middle
    }
  }

  .rule-warpper {
    margin 10px;
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    border-radius 5px;
    padding 15px;

    .title {
      font-weight: 600
    }

    .content {
      padding 11px 0
      line-height: 20px;
    }
  }
</style>
