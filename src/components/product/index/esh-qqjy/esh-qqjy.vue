/**Created by liaoyingchao on 2020-06-16.*/

<template>
  <div class="esh-qqjy">
    <div class="jyq-div" v-if="moduleType=='jyq' && jyCouponList.length > 0">
      <!--<div class="title">抢券加油</div>-->
      <div class="coupon" :class="hotareaClass({idCode: moduleData.idCode + item.id})" @click="hotEvent(item.id);couponDetailEvent(item)" v-for="(item,idx) in jyCouponList" :key="idx">
        <div class="mianer">
          <p class="big">加油券</p>
          <p class="number" v-if="item.stockNum">剩余{{item.stockNum >= 100 ? '99+' : item.stockNum }}张</p>
          <p class="number" v-else>剩余99+张</p>
        </div>
        <div class="cou-info">
          <div class="cou-title double-line">{{item.showTitle}}</div>
          <div class="cou-time">有效期：180天</div>
          <!--<div class="cou-time"></div>-->
        </div>
        <div class="right">
          <div class="price">¥{{item.activityPrice}}</div>
          <div class="text">¥{{item.salePrice}}</div>
          <div class="btn" @click.stop="buyCouponEvent(item)">立即购买</div>
        </div>
      </div>
    </div>
    <div class="yjq-container" v-else-if="jyCouponList.length > 0">
      <div class="list">
        <div class="coupon" v-for="item in jyCouponList" :style="getCouponStyle()">
          <div class="mianer"></div>
          <div class="cou-info">
            <div class="cou-title double-line">{{item.showTitle}}</div>
            <div class="cou-time">有效期至：90天</div>
          </div>
          <div class="right">
            <div class="cou-discount">￥{{item.activityPrice}}</div>
            <div class="cou-original">￥{{item.salePrice}}</div>
            <div class="btn" @click.stop="buyCouponEvent(item)">立即购买</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cookie from 'js-cookie'
  import Bus from "../bus";
  import hee from "../_js/hotarea-extend-event";

  export default {
    name: "esh-qqjy",
    components: {},
    mixins: [hee],
    data() {
      return {
        jyCouponList: []
      }
    },
    props: ['myIndex', 'usePorpData', 'propData'],
    computed: {
      pageData: function () {
        if (this.usePorpData == true) {
          return this.propData;
        }
        return this.$store.state.pageData;
      },
      moduleData: function () {
        return this.pageData.moduleList[this.myIndex].data;
      },
      moduleType: function () {
        return this.moduleData.styleType==2
          ? 'yjq' // 易捷券
          : 'jyq' // 加油券
      }
    },
    methods: {
      /**
       * @description 热力统计事件
       */
      hotEvent(eKey=''){
        this.actionBtnEvent(this.pageData.pgCode, this.moduleData.idCode + eKey)
      },
      submitOrder: function (item) {
        let paramsData = {}
        let carts = [{
          "skuId": item.skuId,
          "storeOuCode": item.storeOuCode,
          "number": 1,
          "checked": 1,
          "isGift": 0
        }]
        let url = this.moduleType == 'jyq'
          ? "/app/json/fee_life_order/submit"
          : "/app/json/app_shopping_order/submit";
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
              let payMode;
              if(this.$store.state.webtype == 3){ // 小程序
                payMode = {payMode: 210, payModeSub: 210005}
              }else if(this.$store.state.webtype == 2){ // 公众号
                payMode = {payMode: 210, payModeSub: 210002}
              }else{  // 其它
                payMode = {payMode: 305, payModeSub: 305005}
              }
              this.$market.payEvent(payMode, payData.orderType, payData.orderId).then(() => {
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
      buyCouponEvent: function (item) {
        if (this.$store.state.webtype == -1) {
          return ;
        }
        this.submitOrder(item)
      },
      couponDetailEvent: function (item) {
        this.$market.customPush({
          path: '/icbc/coupondetail',
          query: {
            couponData: JSON.stringify(item)
          }
        })
      },
      getJYCouponList: function () {
        let url = this.$market.apiBaseURL() + '/app/json/product/getAppProSearchList';
        let paramsData = {
          productType: this.moduleType=='jyq' ? '513' : '5',
          //supportCountryDelivery: 0,
          page: 1,
          rows: 20,
        };

        if (this.moduleData.rows) {
          let arr = []
          for (let i = 0; i < this.moduleData.rows.length; i++) {
            let item = this.moduleData.rows[i]
            if (item.skuId != '') {
              arr.push(item.skuId)
            }
          }
          if (arr.length > 0) {
            paramsData.skuIds = arr
          }
        }

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
      getCouponStyle: function () {
        let styleObj = {};
        this.moduleData.bgImgUrl ? styleObj.backgroundImage = `url(${this.moduleData.bgImgUrl})` : null;
        return styleObj;
      },
    },
    created() {
      this.getJYCouponList()
      Bus.$on("refreshESHQQJY", idCode => {
        if(idCode!=this.moduleData.idCode) return;
        this.getJYCouponList()
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .esh-qqjy {
    width 100%
    height 100%
    overflow hidden
    .jyq-div {
      margin 10px 10px 0;
      padding-bottom 5px;

      .title {
        font-size 16px;
        font-weight 500;
        padding 5px 0;
      }

      .coupon {
        background url("../../../../../static/images/esh/jyq-bg.png") repeat center center / 100% 100%;
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
    .yjq-container{
      .list {
        overflow-y auto;
        .coupon {
          position relative;
          z-index 2;
          background url(./imgs/yj-bg.png) repeat center center / 100% 100%;
          display flex;
          align-items center;
          margin 0 5px;
          height:80px;
          margin:0 12.5px;
          padding-right 10px
          .mianer {
            height:100%;
            width 92px;
          }
          .cou-info {
            flex 1;
            padding-left:8px;
            .cou-title {
              font-size 12px;
            }
            .cou-time {
              margin-top 26px;
              color #999;
              font-size 12px;
            }
          }
          .right {
            text-align center;
            color #ff3c55;
            .cou-discount{
              color:#C70211;
              font-weight:bold;
              font-size:15px;
              &+div{
                margin-top:5px;
              }
            }
            .cou-original{
              color:#999;
              font-size:12px;
              text-decoration:line-through;
              &+div{
                margin-top:5px;
              }
            }
            .btn {
              display:flex;
              align-items:center;
              justify-content:center;
              width 70px
              height 24px
              font-size 12px;
              color white;
              border-radius 15px;
              background-color #ff3c55;
            }
            img {
              width 60px;
              height 60px;
            }
          }
          +.coupon{
            margin-top:10px;
          }
        }
      }
    }
  }
</style>
