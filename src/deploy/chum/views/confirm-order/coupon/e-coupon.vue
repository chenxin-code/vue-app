<template>
  <div class="ecoupon">
    <div v-if="canReceiveCoupon.length > 0">
      <div class="title theme_font_gray">可领取优惠券</div>
      <div class="eccell" v-for="(item,index) in canReceiveCoupon">
        <div class="ecinfo shadow-cell">
          <div class="left-info theme_font_white theme_bg_light_blue">
            <div class="left-con" v-if="item.couCategory == 40">
              <P class="faceamt " v-if="item.couDiscountValue">{{item.couDiscountValue * 1000 / 100}}折</P>
              <P class="faceamt " v-else>折扣券</P>
              <p class="limmony" v-show="item.couThresholdAmount>0">满{{item.couThresholdAmount}}元可用</p>
            </div>
            <div class="left-con" v-else>
              <P class="faceamt ">￥<span>{{item.couFaceValue}}</span></P>
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
              <div class="date-con">
                <div style="flex: 1;">{{item.startDate}}-{{item.endDate}}</div>
                <div class="btn get-coupon theme_bg_light_blue theme_font_white" v-if="item.isReceived == 0" @click="getCouponEvent(item)">点击领取
                </div>
                <div class="btn to-product theme_font_light_blue" v-if="item.isReceived == 1" @click="couponProducts(item)">可用商品</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tip-con theme_font_gray" v-if="isShowTip">{{tipStr}}</div>
      </div>
    </div>
    <div v-if="receivedCoupon.length > 0">
      <div class="title theme_font_gray">已领取优惠券</div>
      <div class="eccell" v-for="(item,index) in receivedCoupon">
        <div class="ecinfo shadow-cell">
          <div class="left-info theme_font_white theme_bg_light_blue">
            <div class="left-con" v-if="item.couCategory == 40">
              <P class="faceamt " v-if="item.couDiscountValue">{{item.couDiscountValue * 1000 / 100}}折</P>
              <P class="faceamt " v-else>折扣券</P>
              <p class="limmony" v-show="item.couThresholdAmount>0">满{{item.couThresholdAmount}}元可用</p>
            </div>
            <div class="left-con" v-else>
              <P class="faceamt ">￥<span>{{item.couFaceValue}}</span></P>
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
              <div class="date-con">
                <div style="flex: 1;">{{item.startDate}}-{{item.endDate}}</div>
                <div class="btn get-coupon theme_bg_light_blue theme_font_white" v-if="item.isReceived == 0"
                     @click="getCouponEvent(item)">点击领取
                </div>
                <div class="btn to-product theme_font_light_blue" v-if="item.isReceived == 1">可用商品</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tip-con theme_font_gray" v-if="isShowTip">{{tipStr}}</div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'ecoupon',
    props: [
      'isShowTip',
      'couponlist',
      'otherData'
    ],
    components: {},
    data() {
      return {
        tipStr: '所结算商品中没有该店铺的商品',
        receivedCoupon: [],
        canReceiveCoupon: []
      }
    },
    methods: {
      selectClick: function (item) {
        console.log(item)
        this.$emit('selectcoupon', item)
      },
      couponProducts: function (item) {
        this.$emit('couponProducts', item)
      },
      getCouponEvent: function (item) {
        this.$Loading.open();
        let url = '/app/json/app_market/getCouScanUrl';
        let params1 = {
          token: this.otherData.token,
          mktActivityId: item.mktActivityId,
          proCode: this.otherData.proCode,
          categoryCode: this.otherData.categoryCode,
          storeOuCode: this.otherData.storeOuCode
        }
        console.log(params1)

        this.$http.post(url, params1).then(res => {
          this.$Loading.close()
          let data = res.data;
          if (data.status == 0) {
            item.isReceived = 1
          } else {
            this.$Toast(data.info)
          }
        }, error => {
          this.$Loading.close()
          this.$Toast('请求数据失败！')
        });
      }
    },
    created() {
      this.receivedCoupon = [];
      this.canReceiveCoupon = [];
      for (let i = 0; i < this.couponlist.length; i++) {
        let item = this.couponlist[i]
        if (item.isReceived == 0) {
          this.canReceiveCoupon.push(item)
        } else {
          this.receivedCoupon.push(item)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .ecoupon {
    overflow hidden
    .title {
      font-size 24px;
      padding 16px;
    }
    .eccell {
      /*background-color #9fa0a0*/
      .ecinfo {
        height 180px
        display flex
        .left-info {
          /*background-color magenta*/
          padding 0px 25px
          display flex
          align-items center
          width 25%
          .left-con {
            .faceamt {
              font-size $font-size-large
              font-weight $font-weight-x
              span {
                font-size $font-size-large-xxx
                font-weight $font-weight-xx
              }
            }
            .limmony {
              margin-top 20px
              font-size $font-size-medium-s
              font-weight 500
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
            margin-left 20px
            margin-right 20px
            .top-type {
              font-size $font-size-medium-s
              .top-con {
                display flex
                align-items center;
                .ectype-con {
                  padding 4px 18px
                  border-radius: 20px;
                  -webkit-border-radius: 20px;
                }
                .title-con {
                  flex 1
                }
              }
            }
            .date-con {
              width 100%;
              margin-top 50px
              font-size $font-size-small
              display flex;
              align-items center;
              .btn {
                padding 4px 12px;
                border-width 2px;
                border-style solid;
                font-size $font-size-small
                margin 12px
                border-radius 20px;
              }
            }

          }
        }
      }
      .tip-con {
        margin-left 20px
        margin-right 20px
        margin-top 20px
        font-size $font-size-small
      }
    }
  }

</style>
