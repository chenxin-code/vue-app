<template>
  <div class="coupon-container" :class="{disabled: disabled}" @click="couponProducts(item)">
    <div class="coupon-left" :class="[formatCouType(item.couTypeCategoryAlias)]"
         :style="couponStyle">
      <template v-if="!(item.couPicReal || item.couPic)">
        <template v-if="item.isHideAmount != 1">
          <div class="price-info">
            <span class="unit">￥</span>
            <span class="price">{{item.couFaceValue}}</span>
          </div>
          <div class="msg">满{{item.couThresholdAmount}}元可用</div>
        </template>
        <template v-else>
          <span>{{item.couTypeTitle}}</span>
        </template>
      </template>
    </div>
    <div class="coupon-right">
      <div class="name double-line" :class="{disabled: disabled}">
        <span class="tip" :class="[formatCouType(item.couTypeCategoryAlias)]"
              v-if="!disabled">{{item.couTypeCategoryName}}</span>
        <span class="text">{{item.couTypeTitle}}</span>
      </div>
      <div class="time-wrapper" :class="{disabled: disabled}">
        <span class="time">{{setHour(item.validStartDate)}}-{{setHour(item.validEndDate)}}</span>
        <span class="btn" :class="[formatCouType(item.couTypeCategoryAlias)]"
              v-if="!disabled && hasBtn">{{item.isActive === 0 ? '待激活' : '点击使用'}}</span>
      </div>
      <div class="used" v-if="used">
        <img class="used-img" src="../../../../../../../static/image/coupon/used.png" alt="">
      </div>
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
      used: {
        type: Boolean,
        default: false
      },
      hasBtn: {
        type: Boolean,
        default: true
      },
      item: {
        type: Object,
        default() {
          return {}
        }
      },
      index: {
        default: 0
      }
    },
    data() {
      return {}
    },
    computed: {
      couponStyle() {
        let styl = {}
        if (this.item.couPicReal || this.item.couPic) {
          styl = {backgroundImage: `url(${this.item.couPicReal || this.item.couPic})`}
        }
        return styl
      }
    },
    methods: {
      couponProducts(coupon) {
        if (this.disabled) {
          return
        }
        if (coupon.couTypeCategoryAlias === 'SC') {
          let path = '/mall2/list/' + this.$util.getDataString()
          this.$router.push({
            path: path,
            query: {
              pageType: 'coupon',
              coupon: coupon.couTypeCode,
              couThresholdAmount: coupon.couThresholdAmount,
              couFaceValue: coupon.couFaceValue,
//          skuId: this.detailData.skuId,
              lastPath: this.$route.path,
//          storeOuCode: this.detailData.storeOuCode,
              endTime: this.$util.getDateFromString(coupon.validEndDate)
            }
          })
        } else {
          this.$router.push({name: 'coupon-detail', params: {couNo: coupon.couNo}})
        }
      },
      setHour(d) {
        return d ? this.$util.formatDate(new Date(d.toString().replace(/-/g, '/')), 'yyyy.MM.dd') : ''
      },
      formatCouType(type) {
        return type ? couCategory[type] ? couCategory[type] : 'bg-color-1' : 'bg-color-1'
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
      width 120px
      text-align: center
      padding 14px 10px;
      color: #fff;
      display flex
      justify-content center
      align-items center
      flex-direction column
      background-size: 100% 100% !important
      background-repeat: no-repeat !important

      .price-info {
        flex-shrink 0


        .unit {
          font-size: 24px;
        }

        .price {
          font-size: 45px;
          font-weight: 600
          margin-left: -8px;
        }
      }

      .msg {
        flex-shrink 0
        font-size: 12px;
        padding-top: 6px;
        line-height: 14px;
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

    .coupon-right {
      padding 15px 11px;
      padding-right: 18px;
      flex 1
      font-size: 14px;
      position: relative
      overflow: hidden
      min-height: 100%;
      display flex
      flex-direction column
      /*justify-content space-between*/

      .name {
        .tip {
          padding: 2px 6px;
          border-radius 8px;
          color: #fff;
          font-size: 12px;
          margin-right: 4px;

          &.bg-color-1 {
            background: linear-gradient(90deg, #67cfdc, #44d2ac)
          }

          &.bg-color-2 {
            background: linear-gradient(90deg, #ffb705, #ff850b)
          }

          &.bg-color-3 {
            background: linear-gradient(90deg, #ff916e, #ef5e5a)
          }

          &.bg-color-4 {
            background: linear-gradient(90deg, #e59b88, #ac7061)
          }

          &.bg-color-0 {
            background: linear-gradient(90deg, #5c9de1, #687add)
          }
        }

        &.disabled {
          padding-right: 40px;
        }

        .text {
          vertical-align middle
          line-height 20px
        }
      }

      .time-wrapper {
        padding-top: 10px;
        display: flex
        justify-content space-between
        align-items center

        .time {
          font-size: 12px;
          color: #999
        }

        .btn {
          padding: 6px 10px;
          border-radius 20px;
          color: #fff;
          font-size: 14px;

          &.bg-color-1 {
            background: linear-gradient(90deg, #67cfdc, #44d2ac)
          }

          &.bg-color-2 {
            background: linear-gradient(90deg, #ffb705, #ff850b)
          }

          &.bg-color-3 {
            background: linear-gradient(90deg, #ff916e, #ef5e5a)
          }

          &.bg-color-4 {
            background: linear-gradient(90deg, #e59b88, #ac7061)
          }

          &.bg-color-0 {
            background: linear-gradient(90deg, #5c9de1, #687add)
          }
        }
      }

      .used {
        position: absolute
        right: 10px;
        top: 50%;
        transform translateY(-50%)

        .used-img {
          width 50px;
        }
      }
    }

    &.disabled {
      .coupon-left {
        background: #999
      }
    }
  }
</style>
