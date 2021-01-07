/**Created by liaoyingchao on 2020-05-28.*/

<template>
  <div class="coupon-detail">
    <nav-top @backEvent="backEvent" :bgImg="require('./imgs/top-bg.png')"></nav-top>
    <nav-content>
      <div class="content">
        <div class="bg-img">
          <img src="./imgs/top-bg-1.png">
        </div>
        <div class="coupon-2" v-if="type == 2">
          <div class="mianer">
            <span>¥</span>
            <span class="big">{{$util.toDecimal2(coupenData.couType.couFaceValue)}}</span>
          </div>
          <div class="cou-info">
            <div class="cou-title double-line">{{coupenData.couType.couTypeTitle}}</div>
            <div class="cou-time">有效期：{{coupenData.couType.validDays}}天</div>
          </div>
          <div class="right">
            <div class="text">消耗积分</div>
            <div class="points">{{coupenData.exchangeUnit}}</div>
            <div class="btn" @click="submitExchangeOrder()">立即兑换</div>
          </div>
        </div>
        <div class="coupon" v-else>
          <div class="mianer">
            <p class="big">加油券</p>
            <!--<p class="number">剩余{{coupenData.stockNum >= 100 ? '99+' : coupenData.stockNum}}张</p>-->
            <p class="number" v-if="coupenData.stockNum">剩余{{coupenData.stockNum >= 100 ? '99+' : coupenData.stockNum }}张</p>
            <p class="number" v-else>剩余99+张</p>
          </div>
          <div class="cou-info">
            <div class="cou-title double-line">{{coupenData.showTitle}}</div>
            <div class="cou-time">有效期：180天</div>
          </div>
          <div class="right">
            <div class="price">¥{{$util.toDecimal2(coupenData.activityPrice)}}</div>
            <div class="text">¥{{$util.toDecimal2(coupenData.salePrice)}}</div>
            <div class="btn" @click="submitOrder">立即购买</div>
          </div>
        </div>
        <div class="block">
          <div class="title-row line_bottom">
            <div class="title-icon">
              <img src="./imgs/cou-sm.png">
            </div>
            <div class="title">优惠券说明</div>
            <div class="right-btn" @click="$router.push({path: '/icbc/supportstation'})">
              <span>可用油站</span>
              <i class="iconfont mall-gengduojiantou"></i>
            </div>
          </div>
          <div class="block-content" v-if="type == 2">
            <div v-html="coupenData.couType.couDesc"></div>
          </div>
          <div class="block-content" v-else-if="detailData">
            <div v-html="detailData.proSkuMediaModel.mobileDetail"></div>
          </div>
        </div>
        <div class="block">
          <div class="title-row line_bottom">
            <div class="title-icon">
              <img src="./imgs/cou-syfs.png">
            </div>
            <div class="title">使用方式</div>
          </div>
          <div class="block-content">
            <img class="test-img" src="./imgs/tt.png">
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import payHelper from "@/utils/payHelper";
  import Cookie from 'js-cookie'

  export default {
    name: "coupon-detail",
    components: {},
    data() {
      return {
        coupenData: {},
        detailData: null,
        type: 1 // 1买券， 2 积分换券
      }
    },
    methods: {
      submitExchangeOrder: function () {
        let url = "/app/json/app_exchange/submitExchangeOrder";
        let paramsData = {
          exchangeDetailId: this.coupenData.id,
          // occurOuCode: item.storeOuCode
        }

        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            const payData = data.data || {}
            if (data.status == 0) {
              // console.log(payData)
              // return;
              this.$market.doPay({payMode: 305, payModeSub: 305007}, payData.payInfo).then(() => {
                Cookie.set('icbc_tradeNo', payData.tradeNo)
                // this.resultHand("1", data.data);
              }).catch(() => {
                this.$Toast("支付失败！")
                // this.resultHand("0", data.data);
              })
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast("请求数据失败！");
          }
        );
      },
      getCouponDetail: function (d) {
        this.$Loading.open();
        let url = '/app/json/product/getAppProDetail';
        let paramsData = {
          productType: d.productType,
          skuId: d.skuId,
          deliverType: '2'
        };
        paramsData.storeOuCode = d.storeOuCode ? d.storeOuCode : '';
        paramsData.pickupStoreOuCode = d.storeOuCode ? d.storeOuCode : '';

        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              this.detailData = data.data;
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast('请求数据失败！')
          }
        );
      },
      submitOrder: function () {
        let paramsData = {}
        let carts = [{
          "skuId": this.coupenData.skuId,
          "storeOuCode": this.coupenData.storeOuCode,
          "number": 1,
          "checked": 1,
          "isGift": 0
        }]
        let url = "/app/json/fee_life_order/submit";
        paramsData.deliveryType = '2'

        paramsData.virtualUserPhone = this.$store.state.userInfo.phone;

        paramsData.orderScene = this.$util.orderScene()
        paramsData.carts = carts;

        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            const payData = data.data || {}
            if (data.status == 0) {
              payHelper.payEvent({payMode: 305, payModeSub: 305005}, payData.orderType, payData.orderId).then(() => {
                Cookie.set('icbc_tradeNo', payData.tradeNo)
                // this.resultHand("1", payData);
              }).catch(() => {
                this.$Toast("支付失败！")
                // this.resultHand("0", payData);
              })
            } else {
              this.$Toast(data.info);
            }
          },
          error => {
            this.$Loading.close();
            this.$Toast("请求数据失败！");
          }
        );
      },
      resultHand(result, payData) {
        this.$Loading.close();
        if (result == "1") {
          this.$router.replace({
            path: "/icbc/success",
            query: {
              orderType: payData.orderType,
              orderId: payData.id,
              fromPage: 1
            }
          });
        } else {
          this.$Toast("支付失败！")
        }
      },
      backEvent: function () {
        this.$router.go(-1)
      }
    },
    created() {
      this.type = this.$route.query.type || 1
      if (this.type == 1) {
        let d = JSON.parse(this.$route.query.couponData)
        this.coupenData = d
        this.getCouponDetail(d)
      } else {
        this.coupenData = JSON.parse(this.$route.query.couponData)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .coupon-detail {
    width 100%
    height 100%
    overflow hidden

    .content {
      position relative;
      height 100%;
      background-color #efefef;
      overflow-y auto;

      .bg-img {
        position absolute;
        left 0;
        top -1px;
        right 0;
        z-index 0;

        img {
          width 100%;
        }
      }

      .coupon {
        background url("./imgs/jyq-bg.png") repeat center center / 100% 100%;
        display flex;
        align-items center;
        margin 8px 10px;
        position relative;
        z-index 2;

        .mianer {
          text-align center;
          width 88px;
          font-size 0;
          color white;

          .big {
            font-size 18px;
          }

          .number {
            margin 8px auto 0;
            font-size 10px;
            background-color white;
            color #CE0112;
            display inline-block;
            padding 4px 10px;
            border-radius 12px;
            //ma
          }
        }

        .cou-info {
          flex 1;
          padding 8px;

          .cou-title {
            font-size 12px;
            line-height 14px;
            height 28px;
          }

          .cou-time {
            margin-top 20px;
            color #999;
            font-size 12px;
          }
        }

        .right {
          text-align center;
          color #CE0112;
          padding 8px;

          .text {
            font-size 10px;
            text-decoration line-through;
            color #999;
            margin-top 6px;
          }

          .price {
            font-size 14px;
            font-weight 500;
          }

          .btn {
            margin-top 6px;
            padding 6px 10px;
            font-size 14px;
            color white;
            border-radius 15px;
            background-color #CE0112;
          }
        }
      }

      .coupon-2 {
        background url("./imgs/jfhq-bg.png") repeat center center / 100% 100%;
        display flex;
        align-items center;
        margin 8px 10px;
        position relative;
        z-index 2;

        .mianer {
          text-align center;
          width 88px;
          font-size 0;
          color white;

          span {
            font-size 12px;
            font-weight 500;
          }

          .big {
            font-size 20px;
            font-weight 500;
          }
        }

        .cou-info {
          flex 1;
          padding 8px;

          .cou-title {
            font-size 12px;
            line-height 14px;
            height 28px;
          }

          .cou-time {
            margin-top 20px;
            color #999;
            font-size 12px;
          }
        }

        .right {
          text-align center;
          color #CE0112;
          padding 8px;

          .text {
            font-size 10px;
          }

          .points {
            margin-top 6px;
            font-size 14px;
            font-weight 500;
          }

          .btn {
            margin-top 6px;
            padding 6px 10px;
            font-size 14px;
            color white;
            border-radius 15px;
            background-color #CE0112;
          }
        }
      }

      .block {
        background-color white;
        margin 10px;
        box-shadow 0 1px 8px #efefef;
        overflow hidden;
        padding 0 10px;
        border-radius 5px;

        .title-row {
          padding 10px 0;
          display flex;
          align-items center;

          .title-icon {
            img {
              display block;
              width 18px;
              height 18px;
            }
          }

          .title {
            font-size 16px;
            margin-left 5px;
            flex 1;
          }

          .right-btn {
            display flex;
            align-items center;

            span, i {
              font-size 12px;
            }
          }
        }

        .block-content {
          padding 10px 0;

          p {
            font-size 12px;
            line-height 16px;
          }

          .test-img {
            margin-top -10px;
            width 100%;
          }
        }
      }
    }
  }
</style>
