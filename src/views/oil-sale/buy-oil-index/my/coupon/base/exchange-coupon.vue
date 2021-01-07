<template>
  <div class="coupon-container">
    <div class="coupon-left">
      <img
        class="img"
        v-if="entryType == 0"
        :src="couponInfo.couPicReal"
        alt="">
      <img
        class="img"
        v-else-if="entryType == 1"
        :src="couponInfo.couPic"
        alt="">
      <div v-if="entryType == 0 && couponInfo.couFaceValueType == 2" class="content">
        <p class="name single-line coupon-title">{{ couponInfo.couTypeTitle }}</p>
        <!-- <p v-else-if="entryType == 1" class="name single-line coupon-title">{{ couponInfo.showTitle }}</p> -->
        <div class="price-info" :class="{disabled: disabled}">
          <span class="price">{{ calRandomAmount(couponInfo.couMinFaceValue, couponInfo.couMaxFaceValue) }}</span>
          <span class="tip">满{{ couponInfo.couThresholdAmount }}可用</span>
        </div>
      </div>
      <div v-else class="content">
        <p class="name single-line coupon-title">{{ couponInfo.couTypeTitle }}</p>
        <!-- <p v-else-if="entryType == 1" class="name single-line coupon-title">{{ couponInfo.showTitle }}</p> -->
        <div class="price-info" :class="{disabled: disabled}">
          <span class="price">{{ calAmount(couponInfo.couFaceValue) }}</span>
          <span class="tip">满{{ couponInfo.couThresholdAmount }}可用</span>
        </div>
      </div>
    </div>
    <div class="coupon-right">
      <slot class="height-100"></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      couponInfo: {
        type: Object,
        required: false,
        default: function () {
          return {}
        }
      },
      entryType: { // 入口类型
        type: Number,
        required: false,
        default: 0
      }
    },
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
      // 计算券金额
      calAmount(amount) {
        if (amount) {
          amount = parseInt(amount)
          return amount
        } else {
          return 0
        }
      },
      // 计算随机金额券金额
      calRandomAmount(min, max) {
        let result = ''
        if (!min || !max) {
          return '0-0'
        } else {
          return min + '-' + max
        }
      }
    },
    components: {}
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  .coupon-container {
    border-radius 4px;
    overflow: hidden
    box-shadow: 0 0 9px 0 rgba(197, 197, 197, 0.3);
    background: #fff;
    display flex

    .coupon-left {
      padding 11px 15px;
      flex 1
      font-size: 14px;
      line-height: 21px;
      position: relative

      &:after {
        content ''
        border-right 1px dotted #ddd;
        position: absolute
        height 80%;
        top: 50%;
        right: 0;
        transform translateY(-50%)
        z-index 1
      }

      .img {
        width 80px;
        height 80px;
        float: left
      }

      .content {
        overflow: hidden
        padding-left: 6px;

        .coupon-title {
          -webkit-box-orient vertical
          -webkit-line-clamp 2
          max-width 100%
          white-space normal
          height 42px
        }
      }

      .price-info {
        padding-top: 10px;

        .price {
          font-size: 28px;
          line-height: 28px;
          color: #F80F16
          vertical-align middle
        }

        .tip {
          background-color: rgba(252, 15, 23, 0.1)
          border-radius 5px;
          font-size: 12px;
          padding 0 6px
          display inline-block
          height: 28px;
          line-height: 28px;
          vertical-align middle
          color #f80f16
        }

        &.disabled {
          .price {
            color: #999
          }

          .tip {
            color #999
            background-color: rgba(153, 153, 153, 0.1)
          }
        }
      }
    }

    .coupon-right {
      width 130px
      height 100px;
    }
  }
</style>
