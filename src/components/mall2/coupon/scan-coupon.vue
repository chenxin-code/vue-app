/**Created by liaoyingchao on 2020-03-03.*/

<template>
  <div>
    <nav-top :noBack="true"></nav-top>
    <nav-content class="coupon-center">
      <div class="coupon-list" v-if="isRequestFinish && mktAwardModelList.length">
        <exchange-coupon
          v-for="(item, index) in mktAwardModelList"
          :key="index"
          class="coupon-item"
          :couponInfo="item.awardAttach">
          <!-- 暂时抢光 -->
          <div class="operate">
            <img  class="img received" src="@/assets/state/received.png" alt="">
            <div class="btn theme_bg_red" @click="couponProducts(item.awardAttach)">立即使用</div>
          </div>
        </exchange-coupon>
      </div>
      <div class="no-coupon-wrapper" v-else-if="isRequestFinish">
        <img class="img" src="../../../../static/image/coupon/none-icon.png" alt="">
        <p class="title theme_font_tint">没有可领优惠券</p>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import ExchangeCoupon from './base/exchange-coupon'
  import CircleProgress from './base/circle.vue'

  export default {
    name: "scan-coupon",
    components: {
      ExchangeCoupon,
      CircleProgress
    },
    data() {
      return {
        couponCode: '',
        type: '',
        mktAwardModelList: [],
        hasMore: true,
        isRequestFinish: false
      }
    },
    methods: {
      couponProducts(coupon) {
        // if (this.$store.state.webtype == 2) {
        //   this.$router.push({
        //     path: '/usercenter/downloadshare',
        //   })
        // } else {
          if (coupon.couTypeCategoryAlias === 'SC') {
            let path = '/mall2/list/' + this.$util.getDataString()
            if (coupon.canUseListPath) {
              path = coupon.canUseListPath
            }
            this.$router.push({
              path: path,
              query: {
                pageType: 'coupon',
                coupon: coupon.couTypeCode,
                couThresholdAmount: coupon.couThresholdAmount,
                couFaceValue: coupon.couFaceValue,
                lastPath: this.$route.path,
                endTime: this.$util.getDateFromString(coupon.validEndDate)
              }
            })
          } else if (coupon.couTypeCategoryAlias == "QF") {
            // 洗车券为qf，如果配置url跳转url如果没有配置跳转二维码详情
            if (coupon.canUseListPath) {
              let path = coupon.canUseListPath
              this.$router.push({
                path: path,
                query: {
                  couTypeCode: coupon.couTypeCode,
                  couNo: coupon.couNo
                }
              })
            } else {
              this.defaultNavigate(coupon)
            }
          } else if (coupon.couTypeCategoryAlias === 'CZ' && this.couponQrCodeEnabled == 3) { //充值券并且配置了3 跳转充值页面
            this.$router.push({
              path: '/addCard',
              query: {couNo: coupon.couNo}
            })
          } else if(coupon.couTypeCategoryAlias == "JY"){
            this.$router.push({
              path: '/stationto',
              query: {stationType:'coupon',RefuelGsOuCode: JSON.stringify(coupon.couTypeUseConditionModel.refuelGsOuCode), RefuelGsOuCodeOp: coupon.couTypeUseConditionModel.refuelGsOuCodeOp}
            })
          } else {
            this.defaultNavigate(coupon)
          }
        // }
      },
      defaultNavigate(coupon) {
        // 详情禁止跳转
        if (this.user === 5) {
          return
        }
        console.log(coupon)
        if(coupon.couNo){
          this.$router.push({
            path: '/coupon_detail',
            query: {couNo: coupon.couNo}
          })
        }else{
          this.$router.push({
            path: '/coupon_list',
          })
        }

      },
      toCouponList() {
        this.$util.linkToCouponList()
      },
      getCouScanQrcode: function () {
        let url = '/app/json/app_market/getCouScanQrcode';
        let params = {
          mktActivityId: this.couponCode
        }
        if (this.type == '2') {
          url = '/app/json/app_market/getCouScanQrcodeWithOuCode'
          params.qrCode = this.couponCode
        } else if (this.type == '3') {
          url = '/app/json/app_market/getCouScanDynamicCode'
          params.dynamicCode = this.couponCode
        } else if (this.type == '4') {
          url = '/app/json/app_market/getCouScanQrcodeAll'
          params.qrcodeAll = this.couponCode
        }else if(this.type == '6'){
          url = '/app/json/app_market/getRefuelActivityScanQrcode'
          params.qrCode = this.couponCode
        }
        this.$Loading.open();
        this.$http.post(url, params).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              let mktAwardModelList = data.data.mktAwardModelList;
              let arr = [];
              mktAwardModelList.forEach((item, index) => {
                item.awardAttach = JSON.parse(item.awardAttach);
                arr.push(item);
              });
              this.mktAwardModelList = arr;
              this.isRequestFinish = true;

            } else {
              this.$Toast(data.info);
              this.visible = false;
            }
          },
          error => {
            this.$Loading.close();
            this.visible = false;
            this.$Toast('请求数据失败！')
          }
        );
      }
    },
    created() {
      console.log('路由')
      if (this.$route.query.COUPON) {
        this.couponCode = this.$route.query.COUPON || ''
        this.type = '1'
      } else if (this.$route.query.COUPON_OUCODE) {
        this.couponCode = this.$route.query.COUPON_OUCODE || '' // ({"mktActivityId":"1","occurOuCode":"1","refuelGsOuCode":"1"}加密后)
        this.type = '2'
      } else if (this.$route.query.COUPON_DYNAMIC_CODE) {
        this.couponCode = this.$route.query.COUPON_DYNAMIC_CODE || ''
        this.type = '3'
      } else if (this.$route.query.COUPON_ALL) {
        this.couponCode = this.$route.query.COUPON_ALL || ''
        this.type = '4'
      }else if (this.$route.query.StationRefuelActivity) {
        this.couponCode = this.$route.query.StationRefuelActivity || ''
        this.type = '6'
      } else {
        this.$Toast('扫描CODE无法识别')
        return;
      }
      this.getCouScanQrcode()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .scan-coupon {
    width 100%
    height 100%
    background-color #f6f6f6;

    .list-content {
      height 100%;
      overflow-y auto;
      padding 20px;

      .tip {
        padding 20px;
        text-align center;
        color #999;
      }
    }
  }

  .coupon-center {
    display flex
    flex-direction column

    .coupon-list {
      padding 8px;
      overflow-x hidden
      overflow-y auto
      -webkit-overflow-scrolling touch
      flex 1

      .coupon-item {
        & + .coupon-item {
          margin-top: 8px;
        }

        .operate {
          text-align: center
          display flex
          flex-direction column
          align-items center
          justify-content center
          height 100%

          .title {
            font-size: 12px;
            color: #F80F16
          }

          .count-down {
            margin-top: 6px;
          }

          .point-wrapper {
            display inline-block
            font-size: 12px;
            margin-top 10px;
            margin-bottom: 4px;
            position relative

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

            &:before, &:after {
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
            }
          }

          .img {
            vertical-align: middle
            width 44px;
          }
          .btn {
            margin-top: 6px;
            padding 6px 0
            text-align: center
            width 75%
            color: #fff;
            border-radius 20px;
            display inline-block
            background: #F80F16
          }

          .text {
            font-size: 10px;

            & + .text {
              padding-top: 5px;
            }
          }

          .exchange-success {
            width 50px;
          }

          &.out {
            .title {
              color: #999999
            }

            .point-wrapper {
              &:before, &:after {
                border-color: #999999
              }

              .point-num {
                color: #999999
              }
            }

            .btn {
              background: #999999
            }
          }
        }
      }
    }

    .no-coupon-wrapper {
      position: absolute
      top: 10%;
      left: 50%;
      transform translate3d(-50%, 0, 0)
      text-align: center

      .img {
        width 90px;
      }

      .title {
        padding-top 24px;
        font-size: 16px;
        color: #5a5a5a
      }
    }
  }

  .no-data {
    padding: 15px;
    text-align: center;
  }
</style>
