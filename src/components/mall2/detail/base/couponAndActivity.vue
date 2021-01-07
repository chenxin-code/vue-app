/**Created by liaoyingchao on 2020-09-28.*/

<template>
  <div class="couponAndActivity" @click="openEvent" v-if="showCoupons.length > 0 || (detailData.activityList && detailData.activityList.length > 0)">
    <div class="row" v-if="showCoupons.length > 0">
      <div class="title-label theme_bg_red">领券</div>
      <div class="coupon theme_font_red single-line" v-for="coupon in showCoupons">{{coupon.showText}}</div>
      <div class="right-more">
        <i class="iconfont mall-gengduo theme_font_tint"></i>
      </div>
    </div>
    <div class="row" v-for="(activity, idx) in detailData.activityList">
      <div class="title-label theme_bg_red">{{activity.type}}</div>
      <div class="black-font">{{activity.title}}</div>
      <div class="right-more" v-if="showCoupons.length == 0 && idx == 0">
        <i class="iconfont mall-gengduo theme_font_tint"></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "couponAndActivity",
    components: {},
    props: {
      detailData: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {}
    },
    computed: {
      /**
       * 获取需要展示的券数组
       * @returns {Array}
       */
      showCoupons() {
        let arr = []
        if (this.detailData.couponInList.length > 0) {
          for (let i = 0; i < this.detailData.couponInList.length; i++) {
            let value = this.detailData.couponInList[i]
            if (new Date() - new Date(value.validEndDate.replace(/-/g, '/')) > 0) {
              //过期的优惠券去掉
            } else {
              // 1.满减券 满x元减y元
              // 2.折扣券 满x元享y折
              // 3.现金券 立减x元
              // couCategory  券类型 10：代金券；20：满减券；30：兑换券；40：折扣券 60 生日券
              let showText = ''
              if (value.couCategory == '20') {
                // 1.满减券 满x元减y元
                showText += `满${value.couThresholdAmount}元减${value.couFaceValue}元`
              } else if (value.couCategory == '40') {
                // 2.折扣券 满x元享y折
                showText += `满${value.couThresholdAmount}元享${value.couDiscountValue * 1000 / 100}折`
              } else if (value.couCategory == '10') {
                // 3.现金券 立减x元
                showText += `立减${value.couFaceValue}元`
              }
              if (showText != '') {
                value.showText = showText
                arr.push(value)
                if (arr.length >= 3) {
                  return arr;
                }
              }
            }
          }
        }
        return arr
      }
    },
    created() {
      console.log('detailData.activityList', this.detailData.activityList)
    },
    methods: {
      openEvent() {
        this.$emit('openEvent')
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .couponAndActivity {
    overflow hidden
    margin-top -5px;
    padding-bottom 12px;

    .row {
      display flex;
      align-items center;
      padding 4px 0;
      font-size 12px;

      .black-font {
        font-weight 500;
      }

      .title-label {
        text-align center;
        padding 3px 5px;
        border-radius 3px;
        width 60px;
        font-size 12px;
        color white;
        margin-right 10px;
      }

      .coupon {
        margin-right 5px;
        background url("../img/coupon-bg.png") no-repeat center center / 100% 100%;
        padding 3px 5px;
        font-size 12px;
      }

      .right-more {
        flex 1;
        text-align right;
        padding-right 2px;
        i {
          font-size 16px;
        }
      }
    }
  }
</style>
