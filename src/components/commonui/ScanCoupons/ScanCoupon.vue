/**Created by steven on 2019/7/16.*/

<template>
  <div class="ScanCoupon" v-if="visible">


    <div class="content">
      <div class="img">
        <img class="top" src="./img/coupon-top.png" alt="">
        <img class="bt" src="./img/coupon-bt.png" alt="">
        <div class="couponslist">
          <div class="coupon" v-for="item in mktAwardModelList" @click="couponDetail(item)">
            <div class="left">
              <div class="amount">
                <span class="small">￥</span><span class="big">{{getShowAmount(item.awardAttach.couFaceValue)}}</span>
              </div>
              <p class="cou-type">{{item.awardAttach.couTypeCategoryName}}</p>
            </div>
            <div class="right">
              <div class="right-content">
                <div class="top-div">
                  <p class="single-line cou-title">{{item.awardAttach.couTypeTitle}}</p>
                  <p class="use-btn">立即使用</p>
                </div>
                <div class="bt-div">
                  <p class="title-l single-line">
                    {{getShowDate(item.awardAttach.validStartDate)}}-{{getShowDate(item.awardAttach.validEndDate)}}</p>
                  <p class="title-r"><span class="small-s">X</span>{{item.awardNum}}</p>
                </div>
              </div>

            </div>
          </div>
          <div class="nocoupon" v-if="mktAwardModelList.length == 0 && isRequestFinish">
            <p>{{ noCouponShowTip }}</p>
          </div>
        </div>
      </div>
    </div>
    <img class="close" src="./img/close.png" alt="" @click="visible = false">

  </div>
</template>

<script>

  import router from '../../../router'
  import store from '@/vuex/store'

  export default {
    name: "ScanCoupon",
    components: {},
    data() {
      return {
        visible: false,
        couponCode: '',
        type: '',
        mktAwardModelList: [],
        isRequestFinish: false,
        noCouponShowTip: '暂无可领取优惠券!'
      }
    },
    methods: {
      open: function () {
        this.visible = true;
        this.getCouScanQrcode();
      },
      getShowDate: function (dateStr) {
        let arr = dateStr.split(' ');
        dateStr = arr[0];
        dateStr = dateStr.replace('-', '.');
        return dateStr;
      },
      getShowAmount: function (amountStr) {
        amountStr += '';
        let arr = amountStr.split('.');
        return arr[0];
      },
      couponDetail: function (coupon) {
        this.visible = false;
        this.$util.linkToCouponList()
      },

      getCouScanQrcode: function () {
        let url = '/app/json/app_market/getCouScanQrcode';
        let params = {
          mktActivityId: this.couponCode
        }
        console.log(this.couponCode)
        if (this.type == '2') {
          url = '/app/json/app_market/getCouScanQrcodeWithOuCode'
          params.qrCode = this.couponCode
        } else if (this.type == '3') {
          url = '/app/json/app_market/getCouScanDynamicCode'
          params.dynamicCode = this.couponCode
        } else if (this.type == '4') {
          url = '/app/json/app_market/getCouScanQrcodeAll'
          params.qrcodeAll = this.couponCode
        } else if (this.type == '5') {
          params = Object.assign({orderType:500005}, JSON.parse(this.couponCode))
        }else if(this.type == '6'){
          url='/app/json/app_market/getRefuelActivityScanQrcode'
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
    mounted() {
      console.log('组件')
      if (store.state.globalConfig.scan_code_get_coupon_tip_text) {
        this.noCouponShowTip = store.state.globalConfig.scan_code_get_coupon_tip_text;
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import '~@/common/stylus/variable.styl';

  .ScanCoupon {
    width 100%
    height 100%
    overflow hidden
    position absolute
    top 0px
    left 0px
    z-index 1000
    background: rgba(0, 0, 0, 0.66);

    .close {
      position absolute
      width 30px
      height 30px
      top 100px
      right 50px
    }

    .content {
      display flex
      justify-content center
      align-items center
      width 100%
      height 100%
      background none

      .img {
        width 305px
        height 275px
        position relative

        .top {
          width 100%
          height 100%
          position absolute
          z-index 1
        }

        .bt {
          width 100%
          height 130px
          bottom 20px
          position absolute
          z-index 3
          pointer-events none
        }

      }

      .couponslist {
        left 56px
        right 40px
        bottom 105px
        top 30px
        position absolute
        z-index 2
        overflow auto

        .nocoupon {
          width 100%
          height 100%
          display flex
          align-items center

          p {
            width: 100%;
            text-align center
            color $color-theme-r
            font-size $font-size-medium-x
          }
        }

        .coupon {
          background-color white
          padding 6px 5px
          display flex
          justify-content space-between
          align-items center

          .left {
            width 46px
            display flex
            flex-direction column
            justify-content center
            align-items center
            flex-shrink 0
            flex-grow 0

            .amount {
              width 100%
              display flex
              align-items flex-end
              justify-content center

              .small {
                color $color-theme-r
                font-size $font-size-small-s
              }

              .big {
                color $color-theme-r
                font-size 20px
              }
            }

            .cou-type {
              font-size $font-size-small
              color $color-theme-r
              width 100%
              text-align center
              margin-top 6px
            }
          }

          .right {
            flex 1
            overflow hidden
            border-left 1px dashed $color-theme-r

            .right-content {
              margin-left 3px
            }

            .top-div {
              display flex
              width 100%

              .use-btn {
                background-color $color-theme-r
                font-size $font-size-medium-s
                color white
                padding 4px 8px
                border-radius 11px
                flex-shrink 0
                flex-grow 0
                margin-top 6px
              }

              .cou-title {
                color $color-text-d
                font-size $font-size-medium
                flex 1
              }
            }

            .bt-div {
              display flex
              justify-content space-between
              align-items center
              margin-top 10px

              .title-l {
                font-size $font-size-small-s
                color $color-text-ll
              }

              .title-r {
                font-size $font-size-medium
                color $color-text-d

                .small-s {
                  font-size $font-size-small-s
                }
              }
            }
          }
        }

      }
    }
  }
</style>
