<!--列表的砍价商品-->
<template>
  <div>
    <div class="coupon" :class="{shadow: true}" @click.stop="toDetails(groupCoupon)" v-if="groupCoupon" >
      <div class="coupon-type" :style="{width:'65px',height:'65px'}">
        <img v-lazy="formatPic || require('../image/券@2x.png')" class="img" alt="">
      </div>
      <div class="coupon-content">
        <div class="content-operation">
          <span class="title"> {{groupCoupon.prizeName}} </span>
          <span class="operation">{{`${time(groupCoupon.startValidateTime || '')} - ${time(groupCoupon.endValidateTime)}`}}</span>
        </div>
        <div class="content-Btn" v-if="detailsRow.state != 3 && getIsTakePartCutObj.role">
          <span v-if="!isCutPrice">帮砍后领取</span>
          <span v-if="isCutPrice && !getIsTakePartCutObj.isGetPrize" @click.stop="getCouScan(groupCoupon)">点击领取</span>
          <span v-if="isCutPrice && getIsTakePartCutObj.isGetPrize" @click.stop="couponList">去使用</span>
        </div>
        <div class="content-Btn" v-if="detailsRow.state != 3 && !getIsTakePartCutObj.role">
          <span>帮砍后领取</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from "vuex";
  import Config from "@/api/config";
  import Countdown from "@/components/Vendor/countdown/countdown"
  export default {
    name: '',
    components: {
      Countdown
    },
    props: {
      isCutPrice: {
        type: Boolean,
        required: false,
        default: false
      },
      getIsTakePartCutObj: {
        type: Object,
        default() {
          return null
        }
      },
      detailsRow: {
        type: Object,
        default() {
          return null
        }
      },
      groupCoupon: {
        type: Object,
        default() {
          return null
        }
      }
    },
    data() {
      return {}
    },
    mounted() {
    },
    computed: {
      ...mapGetters(["userInfo"]),
      formatPic() {
        let result = ''
        if (this.groupCoupon && this.groupCoupon.coupon && this.groupCoupon.couPic) {
          result = this.$util.formatImage(this.groupCoupon.couPic)
        }
        return result
      }
    },
    methods: {
      time(item) {
        let arr = item.split(' ')
        return arr [0]
      },
      getCouScan(item) {
        this.$emit('getCouScan', item)
      },
      couponList() {
        this.$router.push({
          path: `/coupon_list`,
        })
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~@/common/stylus/variable.styl';
  .shadow {
    box-shadow 0 1px 8px #efefef;
  }
  .coupon {
    height 100%
    display flex
    padding 12px;
    border-radius 8px;
    margin-bottom 10px
    background-color #fff
    .coupon-type {
      background-size 100% 100%
      display flex
      align-items center
      justify-content center
      font-weight: 600;
      color: $color-theme

      .img {
        width 100%;
        height 100%
      }
    }
    .coupon-content {
      flex 1
      display flex
      align-items center
      justify-content space-between
      margin-left 10px
      .content-operation {
        flex 1
        height 100%
        display flex
        flex-direction column
        justify-content space-around
        .operation {
          font-size 10px
          color: #989898
        }
      }
      .content-Btn {
        width 86px
        height 100%
        display flex
        align-items center
        justify-content center
        span {
          text-align center
          color: #fff;
          display block
          font-size: 12px;
          border-radius 14px;
          background: #f02e2e
          padding 6px 10px
        }
      }
    }
  }
</style>
