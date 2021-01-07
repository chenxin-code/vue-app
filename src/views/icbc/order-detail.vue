/**Created by liaoyingchao on 2020-06-19.*/

<template>
  <div class="order-detail">
    <nav-top @backEvent="$router.go(-1)" :bgImg="require('./imgs/top-bg.png')"></nav-top>
    <nav-content>
      <div class="content-bg" v-if="detailData">
        <div class="coupon" v-for="coupon in detailData.orderItemList">
          <div class="mianer">
            <p class="big">加油券</p>
          </div>
          <div class="cou-info">
            <div class="cou-title double-line">{{coupon.skuName}}</div>
            <div class="cou-time">有效期：180天</div>
          </div>
        </div>
        <div class="block">
          <div class="row title-row line_bottom">
            <div class="title">订单信息</div>
            <div class="state">{{getItemState(detailData)}}</div>
          </div>
          <div class="row top-margin">
            <div class="label">订单号</div>
            <div class="value">{{detailData.id}}</div>
          </div>
          <div class="row">
            <div class="label">支付时间</div>
            <div class="value">{{detailData.payTime}}</div>
          </div>
          <div class="row">
            <div class="label">支付方式</div>
            <div class="value">{{detailData.payModeSub == '305007' ? '工行积分支付' : '工行银行卡支付'}}</div>
          </div>
          <div class="row" v-if="detailData.payModeSub == '305007'">
            <div class="label">消耗积分</div>
            <div class="value"><span>{{getPayPoints(detailData.payAmount)}}</span></div>
          </div>
          <div class="row" v-else>
            <div class="label">实付金额</div>
            <div class="value">¥<span>{{$util.toDecimal2(detailData.payAmount)}}</span></div>
          </div>
          <div class="row bottom-margin">
            <div class="label">客服电话</div>
            <div class="value">{{detailData.storePhone}}</div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>

  export default {
    name: "order-detail",
    components: {},
    data() {
      return {
        orderPayType: '',
        orderType: '',
        orderId: '',
        detailData: null
      }
    },
    methods: {
      callKF: function () {

      },
      getPayPoints: function (payAmount) {
        let num = payAmount * 100
        if (this.$store.state.globalConfig.pay_icbc_points_conversion_ratio) {
          num = num * this.$store.state.globalConfig.pay_icbc_points_conversion_ratio
        }
        return num
      },
      getItemState: function (item) {
        let str = '已派券'
        if (item.rechargeState == '0' || item.rechargeState == '1') {
          str = '派券中'
        } else if (item.rechargeState == '3') {
          str = '派券失败'
        }
        return str
      },
      // 获取订单详情
      getOrderDetail: function () {
        this.$Loading.open();
        let url = '/app/json/app_shopping_order/detail';
        let paramsData = {
          orderPayType: this.orderPayType,
          orderType: this.orderType,
          orderId: this.orderId
        };
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status == 0) {
              let myData = data.data
              if (myData.wechatMerchantCouponAmount && myData.wechatMerchantCouponAmount > 0) {
                myData.payAmount = myData.payAmount - myData.wechatMerchantCouponAmount
              }
              this.$mallCommon.dataProcessing(myData)

              for (let i = 0; i < myData.orderItemList.length; i++) {
                let item = myData.orderItemList[i]
                let abstractJson = item.abstractJson
                if (abstractJson) {
                  item.abstractJson = JSON.parse(abstractJson)
                }
              }

              this.detailData = myData
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
    },
    created() {
      this.orderPayType = this.$route.query.orderPayType || ''
      this.orderType = this.$route.query.orderType || ''
      this.orderId = this.$route.query.orderId || ''
      this.getOrderDetail();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .order-detail {
    width 100%
    height 100%
    overflow hidden
    .content-bg {
      background-color #efefef;
      width 100%
      height 100%
      overflow hidden

      .coupon {
        background url("./imgs/jyq-bg.png") repeat center center / 100% 100%;
        display flex;
        align-items center;
        margin 10px;
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


      .block {
        margin 10px;
        border-radius 8px;
        padding 4px 10px;
        background-color white;
        .row {
          padding 6px 0;
          font-weight 500;
          display flex;
          align-items center;
          justify-content space-between;
          font-size 12px;
          color #999;
          .title {
            color black;
            font-size 16px;
          }
          .value {
            color #333;
          }
          .amount {
            color black;
            font-size 12px;
            span {
              font-size 16px;
              font-weight 500;
            }
          }
        }

        .top-margin {
          margin-top 6px;
        }

        .bottom-margin {
          margin-bottom 6px;
        }

        .title-row {
          padding 12px 0;
        }
      }
    }
  }
</style>
