/**Created by liaoyingchao on 2018/11/15.*/

<template>
  <div class="list">
    <div class="eccell" v-for="(item,index) in coupons" @click.stop="itemEvent(item,index)">
      <div class="ecinfo shadow-cell">
        <div class="left-info theme_font_white theme_bg_light_blue">
          <div class="left-con" v-if="item.couCategory == 40">
            <P v-if="item.couDiscountValue" class="faceamt "><span class="span-xx">{{item.couDiscountValue * 1000 / 100}}折</span></P>
            <P v-else class="faceamt "><span class="span-x">折扣券</span></P>
            <p class="limmony" v-show="item.couThresholdAmount>0">满{{item.couThresholdAmount}}元可用</p>
          </div>
          <div class="left-con" v-else>
            <P v-if="item.couFaceValue" class="faceamt "><span class="span-x">￥</span><span class="span-xx">{{item.couFaceValue}}</span></P>
            <P v-if="item.couFaceValue == ''" class="faceamt "><span class="span-x">￥</span><span class="span-xx-s">{{item.couMinFaceValue + '~' + item.couMaxFaceValue}}</span></P>
            <p class="limmony" v-show="item.couThresholdAmount>0">满{{item.couThresholdAmount}}元可用</p>
          </div>
        </div>
        <div class="right-info">
          <div class="right-con">
            <div class="top-type">
              <div class="top-con">
                <p class="ectype-con theme_bg_light_blue theme_font_white" v-if="item.couOriginCode == '100'">平台券</p>
                <p class="title-con">{{item.couTypeTitle}}</p>
              </div>
            </div>
            <div class="coupon-tip">
              <div class="single-line font-small theme_font_tint" v-if="item.couFaceValue == ''">注：领取金额{{item.couMinFaceValue}}元至{{item.couMaxFaceValue}}元随机</div>
            </div>
            <div class="date-con">
              <div style="flex: 1;">{{item.mktStartDate.split(' ')[0]}} 至 {{item.mktEndDate.split(' ')[0]}}</div>
            </div>
          </div>
        </div>
        <div class="buy-div">
          <div class="points">
            <p class="title single-line">消耗{{excTypeName(item)}}</p>
            <div class="point-wrapper">
              <img class="img" :src="excTypeIcon(item)" alt="">
              <span class="point-num">{{ excTypeVal(item) || 0}}</span>
            </div>
          </div>
          <div class="btn to-product theme_font_light_blue" v-if="item.isReceived == 1" @click.stop="couponProducts(item)">可用商品</div>
          <div class="btn to-product theme_bg_dark_d theme_font_white" v-else-if="item.soldNum == 100" @click.stop="">已抢完</div>
          <div class="btn get-coupon theme_bg_light_blue theme_font_white" v-else @click.stop="getCouponEvent(item)">点击兑换</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Toast from "../../../../Vendor/toast";
  import store from "@/vuex/store";

  export default {
    name: "list",
    props: ['coupons', 'listType', 'payAmount'],
    components: {},
    data() {
      return {
        selectedIndex: -1,
        selectedCouponType: '',
        selectedCouponThresholdAmount: '',
        canUseCouponNumber: '',
      }
    },
    methods: {
      setItemReceived: function (item) {
        for (let i = 0; i < this.coupons.length; i++) {
          let oItem = this.coupons[i]
          if (oItem.id == item.id) {
            item.isReceived = 1
            this.coupons.splice(i, 1, item)
            return;
          }
        }
      },
      excTypeVal(item) {
        if (item.activityTags.indexOf('YouDouExCoupon') >= 0) {
          return item.perDiscountEmpRewardsPrice
        } else if (item.activityTags.indexOf('RewardExCoupon') >= 0) {
          return item.perDiscountRewardsPrice
        }
        return item.points
      },
      excTypeIcon(item) {
        let path = ''
        if (item.activityTags.indexOf('YouDouExCoupon') >= 0) {
          if (item.soldNum == 100) {
            path = 'static/image/coupon/emp-reward-dis.png'
          } else {
            path = 'static/image/coupon/emp-reward.png'
          }
        } else {
          if (item.soldNum == 100) {
            path = 'static/image/coupon/point-de.png' // 抢光状态
          } else {
            path = 'static/image/coupon/point-icon.png'
          }
        }
        return path
      },
      excTypeName(item) {
        let name = ''
        if (item.activityTags.indexOf('YouDouExCoupon') >= 0) {
          name = store.state.globalConfig.Employees_wallet || '福豆'
        } else if (item.activityTags.indexOf('RewardExCoupon') >= 0) {
          name = store.state.globalConfig.Employees_wallet || '福豆'
        } else {
          name = '积分'
        }
        return name
      },
      getCouponEvent: function (item) {
        if (item.distCntCurUser >= item.discountGoodsCntPerUser) {
          this.$Toast(`每人限购${item.discountGoodsCntPerUser}个，您已到达上限，去看看其它商品吧！`)
        } else if (item.remainNum == 0) {
          this.$Toast('已售完')
        } else if (item.selfSoldNum == 100) {
          this.$Toast('今日可领取次数已用尽')
        } else {
          this.$emit('jfdhCouponEvent', item)
        }
      },
      couponProducts: function (item) {
        this.$emit('couponProducts', item)
      },
      itemEvent: function (item,index) {
        if (this.listType == 2) {

          if (this.selectedCouponType != '' && this.selectedCouponType != item.couTypeCode) {
            Toast('不能与已选优惠券叠加使用！')
            return ;
          }

          item.selected = !item.selected
          this.coupons.splice(index, 1, item)

          if (item.selected) {
            this.selectedCouponType = item.couTypeCode
            this.canUseCouponNumber = item.couTypeUseConditionModel.limitUserUseCouPerOrder
            this.selectedCouponThresholdAmount = item.couThresholdAmount
          }

          let arr = [];
          for (let i = 0; i < this.coupons.length; i++) {
            let item1 = this.coupons[i]
            if (item1.selected == true) {
              arr.push(item1)
            }
          }
          if (arr.length == '') {
            this.selectedCouponThresholdAmount = 0
            this.selectedCouponType = ''
            this.canUseCouponNumber = ''
          }

          let selectedNum = arr.length

          if (this.canUseCouponNumber != '' && selectedNum > this.canUseCouponNumber) {
            item.selected = !item.selected
            this.coupons.splice(index, 1, item)
            Toast('优惠券单笔订单使用数量已达上限！')
            return ;
          } else if (this.selectedCouponThresholdAmount * selectedNum > this.payAmount) {
            item.selected = !item.selected
            this.coupons.splice(index, 1, item)
            Toast('订单金额不足，使用数量已达上限！')
            return ;
          }

          this.$emit('selectedItems', arr)
        }
      }
    },
    mounted() {
      if (this.listType == 2) {
        let arr = [];
        for (let i = 0; i < this.coupons.length; i++) {
          let item = this.coupons[i]
          if (item.selected == true) {
            this.selectedCouponType = item.couTypeCode
            this.canUseCouponNumber = item.couTypeUseConditionModel.limitUserUseCouPerOrder
            arr.push(item)
          }
        }
        this.$emit('selectedItems', arr)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .list {
    overflow hidden
    .eccell {
      /*background-color #9fa0a0*/
      background-color white
      .ecinfo {
        height 90px
        display flex
        align-items center;
        .left-info {
          height 100%;
          /*background-color magenta*/
          padding 0px 6px
          display flex
          align-items center
          width 28%
          //background: linear-gradient(145deg, #5c9de1, #687add);
          .left-con {
            width 100%
            .faceamt {
              text-align center
              overflow hidden
              .span-x{
                font-size $font-size-large
                font-weight $font-weight-x
              }
              .span-xx{
                font-size $font-size-large-xxx
                font-weight $font-weight-xx
              }
              .span-xx-s {
                font-size 28px;
                font-weight $font-weight-xx
              }
            }
            .limmony {
              margin-top 10px
              font-size $font-size-medium-s
              font-weight 500
              text-align center
            }

          }
        }
        .right-info {
          flex 1
          height 100%
          display flex
          align-items center
          .right-con {
            width 100%;
            margin-left 10px
            margin-right 8px
            .top-type {
              height 40px;
              font-size $font-size-small
              .top-con {
                display flex
                align-items center;
                .ectype-con {
                  margin-right 8px;
                  padding 2px 9px
                  border-radius: 10px;
                  -webkit-border-radius: 10px;
                }
                .title-con {
                  flex 1
                  font-size $font-size-medium
                }
              }
            }
            .date-con {
              width 100%;
              margin-top 5px
              font-size $font-size-small
              display flex;
              align-items center;
              .btn {
                padding 4px 6px;
                border-width 0.5px;
                border-style solid;
                font-size $font-size-small
                margin 0 0 0 6px
                border-radius 15px;
              }
            }

          }
        }
        .buy-div {
          margin 5px;
          width 70px;
          display flex;
          justify-content center;
          align-items center;
          flex-flow column;
          overflow hidden;
          .points {
            padding-bottom 5px;
            .title {
              font-size: 12px;
              color: #F80F16
            }

            .count-down {
              margin-top: 6px;
            }

            .point-wrapper {
              font-size: 12px;
              margin-top 8px;
              margin-bottom: 4px;
              position relative
              text-align center;

              .img {
                vertical-align: middle
                width 16px;
              }

              .point-num {
                vertical-align: middle
                padding-left: 4px;
                font-size: 16px;
                color: #F80F16
              }

              /*&:before, &:after {
                content ''
                position: absolute
                top: 50%;
                transform translateY(-50%)
                width 14px;
                border-bottom 1px solid #F80F16
              }

              &:before {
                right 110%
              }

              &:after {
                left: 110%;
              }*/
            }
          }
          .btn {
            padding 4px 6px;
            border-width 0.5px;
            border-style solid;
            font-size $font-size-small
            border-radius 15px;
          }
        }
      }
      .tip-con {
        margin-left 10px
        margin-right 10px
        margin-top 10px
        font-size $font-size-small
      }
      .coupon-tip {
        height 14px;
      }
    }
  }
</style>
