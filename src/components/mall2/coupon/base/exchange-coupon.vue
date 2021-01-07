<template>
  <div class="coupon-container">
    <div class="coupon-left" @click="moveToDetail">
      <div class="media-object"  :class="[formatCouType(couponInfo.couTypeCategoryAlias)]">
        <template v-if="!(couponInfo.couPicReal || couponInfo.couPic)">
          <template v-if="couponInfo.isHideAmount != 1">
            <!-- 江苏中石油满 减无法设置bug32981要求 couCategory=10隐藏满多少减多少 -->
            <template v-if="couponInfo.couCategory == 10">
              <div class="media-object-price-info">
                <span class="unit">￥</span>
                <span class="price">{{ dealwithCouFaceValue(couponInfo.couFaceValue) }}</span>
              </div>
              <!-- <div class="msg">满{{couponInfo.couThresholdAmount}}元可用</div>-->
            </template>
            <!--          满减券-->
            <template v-else-if="couponInfo.couCategory == 20">
              <div class="media-object-price-info">
                <span class="unit">￥</span>
                <span class="price">{{ dealwithCouFaceValue(couponInfo.couFaceValue) }}</span>
              </div>
              <div class="msg">满{{couponInfo.couThresholdAmount}}元可用</div>
            </template>
            <!--          折扣券-->
            <template v-else-if="couponInfo.couCategory == 40">
              <div class="media-object-price-info" v-if="couponInfo.couDiscountValue">
                <span class="price">{{ getDiscount(couponInfo.couDiscountValue) }}</span>
                <span class="unit">折</span>
              </div>
              <div class="media-object-price-info" v-else>
                <span class="price">折扣券</span>
              </div>
              <div class="msg">满{{couponInfo.couThresholdAmount}}元可用</div>
            </template>
            <!--          代金券和其它券-->
            <template v-else>
              <div class="media-object-price-info">
                <span class="unit">￥</span>
                <span class="price">{{couponInfo.couFaceValue}}</span>
              </div>
            </template>
          </template>
          <template v-else>
            <span>{{couponInfo.couTypeTitle}}</span>
          </template>
        </template>
        <template v-else>
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
        </template>
      </div>
      <div v-if="entryType == 0 && couponInfo.couFaceValueType == 2" class="content">
        <p class="name single-line coupon-title">{{ couponInfo.couTypeTitle }}</p>
        <!-- <p v-else-if="entryType == 1" class="name single-line coupon-title">{{ couponInfo.showTitle }}</p> -->
<!--        <div class="price-info" :class="{disabled: disabled}">-->
<!--          <span class="price">{{ calRandomAmount(couponInfo.couMinFaceValue, couponInfo.couMaxFaceValue) }}</span>-->
<!--          <span class="tip">满{{ couponInfo.couThresholdAmount }}可用</span>-->
<!--        </div>-->
      </div>
      <div v-else class="content">
        <p class="name single-line coupon-title">{{ couponInfo.couTypeTitle }}</p>
        <!-- <p v-else-if="entryType == 1" class="name single-line coupon-title">{{ couponInfo.showTitle }}</p> -->
<!--        <div class="price-info" :class="{disabled: disabled}">-->
<!--          <span class="price">{{ calAmount(couponInfo.couFaceValue) }}</span>-->
<!--          <span class="tip">满{{ couponInfo.couThresholdAmount }}可用</span>-->
<!--        </div>-->
      </div>
    </div>
    <div class="coupon-right">
      <slot class="height-100"></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 商城券 bg-color-0 非油券 bg-color-1 洗车券 bg-color-2 充值券 bg-color-3 加油券 bg-color-4
  //  加油券		JY
  //  商城券		SC
  //  充值券		CZ
  //  第三方合作券		DSF
  //  便利店		BLD
  const couCategory = {
    'JY': 'bg-color-4',
    'CZ': 'bg-color-3',
    'DSF': 'bg-color-2',
    'BLD': 'bg-color-1',
    'SC': 'bg-color-0'
  }
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
      dealwithCouFaceValue(couFaceValue) {
        if (Number(couFaceValue) > 100) {
          return parseInt(couFaceValue)
        } else {
          return couFaceValue
        }
      },
      getDiscount: function (couDiscountValue) {
        return couDiscountValue * 1000 / 100
      },
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
      },
      formatCouType(type) {
        if (!(this.couponInfo.couPicReal || this.couponInfo.couPic)) {
          return type ? couCategory[type] ? couCategory[type] : 'bg-color-1' : 'bg-color-1'
        } else {
          return ''
        }
      },
      // 返回给父组件的方法
      moveToDetail() {
        this.$emit("moveDetail",this.couponInfo)
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

      .media-object {
        width 80px;
        height 80px;
        float: left
        display flex
        justify-content center
        align-items center
        flex-direction column
        color:#fff;
        border-radius 5px;
        .img {
          width 100%
          height 100%
        }
        &.bg-color-1 {
          background: linear-gradient(145deg, #67cfdc, #44d2ac)
        }

        &.bg-color-2 {
          background: linear-gradient(145deg, #ffb705, #ff850b)
        }

        &.bg-color-3 {
          background: linear-gradient(145deg, #ff916e, #ef5e5a)
        }

        &.bg-color-4 {
          background: linear-gradient(145deg, #e59b88, #ac7061)
        }

        &.bg-color-0 {
          background: linear-gradient(145deg, #5c9de1, #687add)
        }
      }

      .media-object-price-info {
        flex-shrink 0


        .unit {
          font-size: 12px;
        }

        .price {
          font-size: 20px;
          font-weight: 600
          margin-left: -4px;
        }
      }

      .msg {
        flex-shrink 0
        font-size: 12px;
        padding-top: 6px;
        line-height: 14px;
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
          font-size: 20px;
          line-height: 28px;
          color: #F80F16
          vertical-align middle
        }

        .tip {
          background-color: rgba(252, 15, 23, 0.1)
          border-radius 5px;
          font-size: 12px;
          padding 0 4px
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
