/**Created by liaoyingchao on 2020-06-16.*/

<template>
  <div class="esh-jfhq">
    <div class="jfhq-div" v-if="jfhqCouponList.length > 0">
      <div class="title">
        <div class="text">积分换券</div>
        <div class="more" :class="hotareaClass({idCode: moduleData.idCode + 'more'})" @click="hotEvent('more');$market.customPush({path: '/icbc/pointstocoupon'})">更多</div>
      </div>
      <div class="coupon" @click="buyCouponEvent(item)" v-for="(item,idx) in jfhqCouponList" :key="idx">
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
  </div>
</template>

<script>
  import Cookie from 'js-cookie'
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "esh-jfhq",
    components: {},
    props: ['myIndex', 'usePorpData', 'propData'],
    mixins: [hee],
    data() {
      return {
        jfhqCouponList: []
      }
    },
    computed: {
      pageData: function() {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function() {
        return this.pageData.moduleList[this.myIndex].data;
      },
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      buyCouponEvent: function (item) {
        this.$router.push({
          path: '/icbc/coupondetail',
          query: {
            type: 2,
            couponData: JSON.stringify(item)
          }
        })
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
            } else if(this.$store.state.webtype != '-1'){
              this.$Toast(data.info)
            }
          },
          err => {
            this.$Loading.close();
            this.$Toast("系统运行过程中遇到问题，请稍候再试");
          }
        )
      },
    },
    created() {
      this.getJFCouponList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .esh-jfhq {
    width 100%
    height 100%
    overflow hidden
    .jfhq-div {
      padding-bottom 5px;
      margin 0 10px;

      .title {
        font-size 16px;
        font-weight 500;
        padding 5px 0;
        display flex
        justify-content space-between;
        align-items center;

        .more {
          font-size 14px;
          background-color #f94b56;
          border-radius 20px;
          padding 6px 15px;
          color white;
        }
      }

      .coupon {
        background url("../../../../../static/images/esh/jfhq-bg.png") repeat center center / 100% 100%;
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
  }
</style>
