/**Created by liaoyingchao on 2020-06-16.*/

<template>
  <div class="station-detail">
    <nav-top @backEvent="backEvent" :bgImg="require('./imgs/top-bg.png')"></nav-top>
    <nav-content>
      <div class="station-detail" ref="StationDetail">
        <div class="station-detail-info">
          <div class="station-detail-info-content" v-if="station">
            <div class="local-detail">
              <div class="img-div">
                <img src="static/images/esh-nearstation/logo.png">
              </div>
              <div class="info-div">
                <div class="row">
                  <div class="title single-line">{{station.name}}</div>
                  <div class="yz-btn" v-if="station.distance < 500">
                    <img src="static/images/esh-nearstation/jzjy.png">
                    <span>进站加油</span>
                  </div>
                  <div class="yz-btn" v-else>
                    <img class="dhdz" src="static/images/esh-nearstation/dhdz.png">
                    <span>导航到站</span>
                  </div>
                </div>
                <div class="row1">
                  <div class="dw">
                    <img src="static/images/esh-nearstation/dw2.png" alt="">
                  </div>
                  <div class="address double-line">{{station.address}}</div>
                  <div class="distance" v-if="station.distance > 1000">
                    距您{{$util.toDecimal2(station.distance / 1000)}}km
                  </div>
                  <div class="distance" v-else>
                    距您{{station.distance}}m
                  </div>
                </div>
              </div>
            </div>
            <div class="block" @click="$router.push({path: '/icbc/oilcoupon', query: {noDetail: true}})">
              <div class="icon">
                <img src="./imgs/jyq-icon-2.png">
              </div>
              <div class="title">电子加油券</div>
              <div class="right">
                <div class="amount">¥{{$util.toDecimal2(couponDetail.totalAmount)}}</div>
                <div class="btn line_circle">立即加油</div>
              </div>
            </div>
          </div>
          <div class="coupon-list-group">
            <div class="jfhq-div" :class="{'jfhq-div-1': isUp}" v-if="station && jfhqCouponList.length > 0">
              <div class="title">积分换券</div>
              <div class="coupon" @click="buyCouponEvent2(item)" v-for="item in jfhqCouponList">
                <div class="mianer">
                  <span>¥</span>
                  <span class="big">{{$util.toDecimal2(item.couType.couFaceValue)}}</span>
                </div>
                <div class="cou-info">
                  <div class="cou-title double-line">{{item.couType.couTypeTitle}}</div>
                  <div class="cou-time">有效期：{{item.couType.validDays}}天</div>
                </div>
                <div class="right">
                  <div class="text">消耗积分</div>
                  <div class="points">{{item.exchangeUnit}}</div>
                  <div class="btn" @click.stop="submitExchangeOrder(item)">立即兑换</div>
                </div>
              </div>
            </div>
            <div class="jyq-div" :class="{'jyq-div-1': isUp}" v-if="jyCouponList.length > 0 && station">
              <div class="title">抢券加油</div>
              <div class="coupon" @click="buyCouponEvent(item)" v-for="item in jyCouponList">
                <div class="mianer">
                  <p class="big">加油券</p>
                  <!--<p class="number">剩余{{item.stockNum > 99 ? '99+' : item.stockNum}}张</p>-->
                  <p class="number" v-if="item.stockNum">剩余{{item.stockNum >= 100 ? '99+' : item.stockNum }}张</p>
                  <p class="number" v-else>剩余99+张</p>
                </div>
                <div class="cou-info">
                  <div class="cou-title double-line">{{item.showTitle}}</div>
                  <div class="cou-time">有效期：180天</div>
                </div>
                <div class="right">
                  <div class="price">¥{{item.activityPrice}}</div>
                  <div class="text">¥{{item.salePrice}}</div>
                  <div class="btn" @click.stop="submitOrder(item)">立即购买</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav-content>
  </div>
</template>

<script>
  import Cookie from 'js-cookie'

  export default {
    name: "station-detail",
    components: {},
    data() {
      return {
        jyCouponList: [],
        jfhqCouponList: [],
        station: null,
        couponDetail: {},
        nowTop: 0,
        isUp: false
      }
    },
    methods: {
      submitOrder: function (item) {
        let paramsData = {}
        let carts = [{
          "skuId": item.skuId,
          "storeOuCode": item.storeOuCode,
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
              this.$market.payEvent({payMode: 305, payModeSub: 305005}, payData.orderType, payData.orderId).then(() => {
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
      submitExchangeOrder: function (item) {
        let url = "/app/json/app_exchange/submitExchangeOrder";
        let paramsData = {
          exchangeDetailId: item.id,
          // occurOuCode: item.storeOuCode
        }

        this.$Loading.open();
        this.$http.post(url, paramsData).then(
          res => {
            this.$Loading.close();
            let data = res.data;
            const payData = data.data || {}
            if (data.status == 0) {
              this.$market.doPay({payMode: 305, payModeSub: 305007}, data.data.payInfo).then(() => {
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
      buyCouponEvent: function (item) {
        this.$router.push({
          path: '/icbc/coupondetail',
          query: {
            couponData: JSON.stringify(item)
          }
        })
      },
      buyCouponEvent2: function (item) {
        this.$router.push({
          path: '/icbc/coupondetail',
          query: {
            type: 2,
            couponData: JSON.stringify(item)
          }
        })
      },
      setStationDetail: function (station) {
        this.station = station
      },
      getJFCouponList: function () {
        let url = '/app/json/app_exchange/queryExchangeDetailList'
        let paramsData = {
          longitude: this.$store.state.currentLocation.posx,
          latitude: this.$store.state.currentLocation.posy,
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status === 0) {
              this.jfhqCouponList = data.data
            } else {
              this.$Toast(data.info)
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
      getJYCouponList: function () {
        let url = '/app/json/product/getAppProSearchList';
        let paramsData = {
          productType: '513',
          //supportCountryDelivery: 0,
          page: 1,
          rows: 20,
        };
        paramsData.area = {
          provinceId: this.$store.state.indexData.provinceId,
          cityId: this.$store.state.indexData.cityId
        }
        this.$Loading.open();
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status === 0) {
              this.jyCouponList = data.data.list
            } else {
              this.$Toast(data.info)
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
      getJYCouponInfo: function () {

        let url = '/app/json/djljy/router?m=getAccount'
        let paramsData = {
          userId: this.$store.state.userInfo.userId
        };
        this.$Loading.open();
        this.$http.post(url, paramsData).then(res => {
            this.$Loading.close();
            let data = res.data;
            if (data.status === 0) {
              this.couponDetail = JSON.parse(data.data).walletObj
            } else {
              this.$Toast(data.info)
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
      backEvent: function () {
        this.$router.go(-1)
      }
    },
    mounted() {
      this.setStationDetail(JSON.parse(this.$route.query.station))
      this.$nextTick(() => {
        /**
         *获取dom高度
         *设置列表默认位置为从头部70%的位置
         *获取列表默认坐标
         *获取拖拽按钮element
         */
        this.domHeight = document.documentElement.clientHeight;
        this.nowTop = this.domHeight * 0.7

      });
      this.getJFCouponList()
      // this.getJYCouponList()
      this.getJYCouponInfo()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .station-detail {
    width 100%
    height 100%
    overflow hidden
    .station-detail {
      height 100%;
      overflow-y auto
      -webkit-overflow-scrolling touch;

      .station-detail-info {
        background: #fff;
        border-radius 8px;
      }

      .station-detail-info-content{
        flex-shrink 0
      }


      .coupon-list-group{
        //flex 1;
        //overflow-y auto
      }
      &.has-bk {
        background: #efefef url("./imgs/top-bg-1.png") no-repeat left top;
        background-size 100% auto

        .station-detail-info {
          box-shadow 0 1px 8px #efefef;
          background-color white;
        }
      }

      .top-bk {
        margin 10px;
        overflow hidden;
        box-shadow 0 1px 8px #efefef;
        border-radius 8px;
        background-color white;
        position relative;
        z-index 2;
      }

      .local-detail {
        display flex;
        align-items flex-start;
        padding 10px;

        .img-div {
          img {
            display block;
            width 50px;
            height 50px;
            border-radius 5px;
            overflow hidden;
          }
        }

        .info-div {
          padding-left 8px;
          flex 1;
          overflow hidden;

          .row {
            display flex;
            align-items center;

            .title {
              font-size 16px;
              font-weight 500;
              flex 1;
            }

            .yz-btn {
              display flex;
              align-items center;
              padding 5px 0;

              img {
                height 16px;
                margin-right 3px;
              }

              span {
                font-size 12px;
              }
            }
          }

          .row1 {
            display flex;
            align-items flex-start;
            margin-top 8px;
            color #999;

            .dw {
              img {
                display block;
                height 16px;
              }
            }

            .address {
              flex 1;
              line-height 16px;
              font-size 12px;
              padding-left 3px;
            }

            .distance {
              width 100px;
              text-align right;
              line-height 16px;
              font-size 12px;
            }
          }
        }
      }

      .block {
        margin 4px 10px 10px;
        box-shadow 0 1px 8px #efefef;
        border-radius 8px;
        padding 10px;
        display flex;
        align-items center;

        .icon {
          padding 8px 12px 8px 4px;
          border-right 1px dashed #ddd;

          img {
            display block;
            width 50px;
            height 50px;
          }
        }

        .title {
          padding 12px;
          flex 1;
          font-size 16px;
          font-weight 500;
        }

        .right {
          text-align center;

          .amount {
            font-weight 600;
            font-size 18px;
            color #CE0112;
          }

          .btn {
            margin-top 8px;
            padding 6px 12px;
            font-size 14px;
            color #CE0112;

            &.btn:before {
              border-color #CE0112;
            }
          }
        }
      }

      .jfhq-div {
        margin 0 10px;

        &.jfhq-div-1 {
          .coupon {
            .mianer {
              width 90px;
            }
          }
        }

        .title {
          font-size 16px;
          font-weight 500;
          padding 5px 0;
        }

        .coupon {
          background url("./imgs/jfhq-bg.png") repeat center center / 100% 100%;
          display flex;
          align-items center;
          margin-top 8px;
          box-shadow 0 1px 8px #efefef;

          .mianer {
            text-align center;
            width 92px;
            font-size 0;
            color white;

            span {
              font-size 12px;
              font-weight 500;
            }

            .big {
              font-size 18px;
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
      }

      .jyq-div {
        margin 10px 10px 0;

        &.jyq-div-1 {
          .coupon {
            .mianer {
              width 90px;
            }
          }
        }

        .title {
          font-size 16px;
          font-weight 500;
          padding 5px 0;
        }

        .coupon {
          background url("./imgs/jyq-bg.png") repeat center center / 100% 100%;
          display flex;
          align-items center;
          margin 10px 0px;
          position relative;
          z-index 2;
          box-shadow 0 1px 8px #efefef;

          .mianer {
            text-align center;
            width 92px;
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
      }

      .yzfw-div {
        margin 0 10px;

        .title {
          font-size 16px;
          font-weight 500;
          padding 5px 0;
          margin 10px 0 8px;
        }

        .info-block {
          margin 0px 0px 10px;
          box-shadow 0 1px 8px #efefef;
          background-color white;
          border-radius 8px;

          .title-row {
            margin 0 10px;
            padding 12px 0;
            display flex;
            align-items center;

            img {
              width 16px;
            }

            p {
              margin-left 5px;
              font-size 14px;
            }
          }

          .items-div {
            overflow hidden;

            .item {
              margin 10px;
              float left;
              background-color #F5F5F5;
              padding 4px 8px;
              border-radius 4px;
              border 1px solid #ddd;
              font-size 12px;
            }
          }
        }
      }
    }
  }
</style>
