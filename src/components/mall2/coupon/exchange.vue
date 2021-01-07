/**Created by liaoyingchao on 2020-01-10.*/

<template>
  <div class="detail">
    <nav-top @backEvent="$router.go(-1)"></nav-top>
    <nav-content>
      <div class="content">
        <div class="address" @click="toSelectAddress">
          <div class="no-address" v-if="!($store.state.mall2.selectAddress.id > 0)">
<!--            <img class="adr-img" src="./imgs/adr.png">-->
            <span>{{$t("loginRegisterLang.selectAddress")}}</span>
            <img class="zm-jiantou-14" src="static/image/setting/jt.png">
          </div>
          <div class="selected-address" v-if="$store.state.mall2.selectAddress.id > 0">
<!--            <img class="adr-img" src="./imgs/adr.png">-->
            <div class="address-info">
              <div class="name">
                <span>{{$store.state.mall2.selectAddress.receiverName}}</span>
                <span>{{$store.state.mall2.selectAddress.mobile}}</span>
              </div>
              <div class="detail">{{$store.state.mall2.selectAddress.addressFull}}</div>
            </div>
            <img class="zm-jiantou-14" src="static/image/setting/jt.png">
          </div>
        </div>
        <div class="card-div">
          <coupon :item="couponDedail" :buttonType="-1" :showCover="false"></coupon>
        </div>
        <div class="text-div">
          <div class="title">优惠券使用说明
</div>
          <div class="text-content" v-html="couponDedail.couDesc"></div>
        </div>
      </div>
      <div class="bottom-btn">
        <div class="btn theme_standard_bg" @click="exchangeProduct">确认使用
</div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import JsBarcode from 'jsbarcode'
  import QRCode from 'qrcode'
  import coupon from './base/coupon'

  export default {
    name: "detail",
    components: {
      coupon
    },
    data() {
      return {
        couNo: '',
        couponDedail: {},
      }
    },
    methods: {
      exchangeProduct: function () {
        if (!(this.$store.state.mall2.selectAddress.id > 0)) {
          this.$Toast("请选择地址！")
          return ;
        }

        this.$Loading.open()
        let dynamicCode = this.couponDedail.dynamicCode || ''
        if (dynamicCode == '') {
          this.$Toast("动态码为空！")
          return ;
        }
        this.$http.post('/app/json/coupon/useExchangeCou', {
          dynamicCode: dynamicCode,
          occurOuCode: '1',
          addessInfo: this.$store.state.mall2.selectAddress
        }).then(res => {
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.$Toast("兑换成功！")
            this.$router.go(-1)
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Loading.close()
          this.$Toast("请求数据失败，请稍后！")
        })
      },
      toSelectAddress: function () {
        this.$router.push({
          path: "/mall2/addresslist"
        });
      },
      getCouponDetail: function () {
        let url = '/app/json/coupon/getMyCouInfo'
        this.$Loading.open()
        this.$http.post(url, {
          couNo: this.couNo
        }).then(res => {
            console.log(res)
          this.$Loading.close()
          let data = res.data
          if (data.status == 0) {
            this.couponDedail = data.data || {}
            // let codeStr = this.couponDedail.dynamicCode || ''
            //
            // let qrcode = document.getElementById('QRCode');
            // QRCode.toCanvas(qrcode, codeStr, { width: 160, margin:0})
            // let barcode = document.getElementById('BARCode');
            // JsBarcode(barcode, codeStr, {
            //   height: 60,
            //   displayValue: false
            // });
            // this.myTimer = window.setTimeout(() => {
            //   this.getCouponDetail()
            // }, 30000)
          } else {
            this.$Toast(data.info)
          }
        }).catch(err => {
          this.$Loading.close()
          this.$Toast("获取数据失败！")
        })
      }
    },
    created() {
      this.couNo = this.$route.query.couNo
      this.getCouponDetail()
    },
    destroyed() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .detail {
    width 100%
    height 100%
    overflow hidden
    .nav-content {
      background-color #f6f6f6;
    }
    .content {
      position absolute;
      left 0;
      right 0;
      top 0;
      bottom 75px;
      .address {
        padding 15px 10px;
        margin 10px 20px;
        background-color white;
        border-radius 5px;
        overflow hidden;
        .adr-img {
          display block;
          width 30px;
          height 30px;
        }
        .no-address {
          display flex;
          align-items center;
          padding 5px 0;
          span {
            font-size 16px;
            flex 1;
            padding 0 10px;
          }
        }
        i {
          font-size 18px;
          margin-right 8px;
        }
        .i-more {
          font-size 16px;
        }
        .selected-address {
          display flex;
          align-items center;
          .address-info {
            flex 1;
            padding 0 20px 0 10px
            line-height 1.4;
            .name {
              font-size 16px;
              font-weight 600;
              padding-bottom 5px;
              span {
                margin-right 10px;
              }
            }
            .detail {
              font-size 14px;
              color #666;
            }
          }
        }
      }
      .card-div {
        margin 15px 20px 0;
        background-color white;
        .cell {
          position relative;
          box-shadow 0 1px 8px #efefef;
          .info-div {
            position absolute;
            left 10px;
            width 210px;
            top 25px;
            bottom 10px;
            overflow hidden;
            .title {
              font-size 16px;
              padding 10px 0;
            }
            .time {
              position absolute;
              bottom 3px;
              font-size 10px;
              color #999;
            }
          }
          img {
            display block;
            width 335px;
            height 100px;
          }
        }
      }
      .text-div {
        margin 12px 20px;
        line-height 1.6;
        .title {
          font-size 16px;
          font-weight 600;
        }
        .text-content {
          font-size 14px;
        }
      }
    }
    .bottom-btn {
      position absolute;
      left 20px;
      right 20px;
      bottom 20px;
      .btn {
        height 50px;
        text-align center;
        line-height 50px;
        border-radius 5px;
        font-size 16px;
        color white;
        font-weight 600;
      }
    }
  }
</style>
