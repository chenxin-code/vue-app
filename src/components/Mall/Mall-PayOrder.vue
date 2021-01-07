/**Created by steven on 2018/7/2.*/

<template>
  <div class="Mall-PayOrder">

    <nav-top @backEvent="backEvent" >
    </nav-top>

    <div class="paycontent" :style="{top: (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}">
      <div class="orderlist selfborder">
        <div style="overflow: hidden;">
          <p class="leftp">
            <span>订单详情</span>
            <span class="small-span">(共{{products.length}}件商品)</span>
          </p>
        </div>
        <div class="pro-div" v-if="products.length == 1">
          <div class="pro-img">
            <img :src="products[0].phPictureUrl"/>
          </div>
          <div class="pro-info font-medium-s">
            <p class="pro-name">{{products[0].productName}}</p>
            <!--<p class="pro-size">50g</p>-->
            <p style="margin-top: 20px;">
              <span class="theme-color">￥</span>
              <span class="theme-color sale-price">{{$util.toDecimal2(products[0].price)}}</span>
              <!--<span class="cost-price">200</span>-->
              <span class="sale-num">x {{products[0].number}}</span>
            </p>
          </div>
        </div>
        <div class="pro-div" v-if="products.length > 1" @click="productEvent()">
          <div class="pro-img-1" v-for="index in [0, 1]">
            <img :src="products[index].phPictureUrl"/>
          </div>
          <div class="pros-num" v-if="products.length > 1">共{{getPorductsNum()}}件</div>
        </div>
      </div>
      <div class="paylist selfborder">
        <p  class="paytip">
          <span>选择支付方式</span>
          <span class="moneytip">(您还需支付金额:<span class="money">￥{{$util.toDecimal2(getSalePrice()-getCouponsPrice())}}</span>)</span>
        </p>
        <div  class="paymt"  @click="choosPayType(210)" >
          <img src="../../../static/image/mall/wechatpay.png" alt="">
          <span>微信支付</span>
          <img class="payright" src="../../../static/image/mall/screen4.png" alt="" v-show="payType == 210">
        </div>
        <div class="paymt"  @click="choosPayType(200)">
          <img src="../../../static/image/mall/alipay.png" alt="">
          <span>支付宝支付</span>
          <img class="payright" src="../../../static/image/mall/screen4.png" alt="" v-show="payType == 200">
        </div>
      </div>
      <div class="moneylist selfborder">
        <div class="realpay">
          <span class="leftp">应付总额</span>
          <span class="rightp">￥{{$util.toDecimal2(getSalePrice())}}</span>
        </div>
        <div class="cutpay">
          <span class="leftp">实付金额</span>
          <span class="rightp">￥{{$util.toDecimal2(getSalePrice()-getCouponsPrice())}}</span>
        </div>
        <div class="cutpay">
          <span class="leftp">优惠券</span>
          <span class="rightp">{{$util.toDecimal2(getCouponsPrice())}}</span>
        </div>
      </div>
    </div>
    <button class="btn-div" @click="payEvent">立即支付</button>
    <PopPros v-if="showPros" :products="products" @closeEvent="closeEvent"></PopPros>
  </div>
</template>

<script>
  import PopPros from '../base/pop-pros'

export default {
  name: "Mall-PayOrder",
  components: {
    PopPros
  },
  data () {
    return {
      goods:[],
      // 支付宝：200 微信：210
      payType:210,
      products: [],
      orderId: '',
      showPros: false
    }
  },
  methods: {
    closeEvent: function () {
      this.showPros = false
    },
    productEvent: function () {
      this.showPros = true
    },
    getPorductsNum: function () {
      let num = 0;
      for (let i = 0; i < this.products.length; i++) {
        num += this.products[i].number
      }
      return num
    },
    backEvent: function () {
      this.$bridgefunc.customGo(-1)
    },
    choosPayType:function (pay) {
      this.payType = pay;
    },
    getSalePrice: function () {
      let price = 0;
      for (let i = 0; i < this.products.length; i++) {
        let item = this.products[i];
        price += item.price * item.number
      }
      return price
    },
    getCouponsPrice: function () {
      return 0
    },
    payEvent: function () {
      // /app/json/order/pay
      this.$Loading.open()
      let url = '/app/json/order/pay';
      let params1 = {
        token: this.$store.state.login.token,
        orderId: this.orderId,
        payMode: this.payType,
        orderType: "200001",
        amount: this.getSalePrice() - this.getCouponsPrice()
      };
      if (this.payType == 200) {
        params1.payModeSub = 200001
      } else if (this.payType == 210) {
        params1.payModeSub = 210001
      }
      let _this = this
      this.$http.post(url, params1).then(res => {
        _this.$Loading.close()
        let data = res.data;
        console.log(data);
        if (data.status == 0) {
          if (_this.payType == 200) {
            let payInfo = data.data.payInfo
            _this.$bridgefunc.aliPay(payInfo, function (result) {
              _this.$bridgefunc.customPush({
                path: '/mallpayresult',
                query: {
                  result: result
                }
              })
              //_this.$Toast('result ',result)
            })
          } else if (this.payType == 210) {
            let payInfo = JSON.parse(data.data.payInfo)
            // let sign = payInfo.sign;//_this.$util.getUrlParam(payInfo, 'sign')
            // let timestamp = _this.$util.getUrlParam(payInfo, 'timestamp')
            // let noncestr = _this.$util.getUrlParam(payInfo, 'noncestr')
            // let partnerid = _this.$util.getUrlParam(payInfo, 'partnerid')
            // let prepayid = _this.$util.getUrlParam(payInfo, 'prepayid')
            // let package1 = _this.$util.getUrlParam(payInfo, 'package')
            // let appid = _this.$util.getUrlParam(payInfo, 'appid')
            // let payinfo = {
            //   sign: sign,
            //   timestamp: timestamp,
            //   noncestr: noncestr,
            //   partnerid: partnerid,
            //   prepayid: prepayid,
            //   package: package1,
            //   appid: appid
            // }

            _this.$bridgefunc.wxPay(payInfo, function (result) {
              _this.$bridgefunc.customPush({
                path: '/mallpayresult',
                query: {
                  result: result
                }
              })
            })
          }
        } else {
          _this.$Toast(data.info)
        }
      }, error => {
        _this.$Loading.close()
        console.log('获取失败', error);
        _this.$Toast('获取数据失败')
      });
    }
  },
  created () {
    this.orderId = this.$route.query.orderid ? this.$route.query.orderid : '';
    this.products = this.$store.state._products;
    // this.$store.state._products = [];
    // this.$bridgefunc.vuexStorage()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import "~@/common/stylus/variable.styl"
.Mall-PayOrder {
  position relative
  width  100%
  height 100%
  background-color white
  overflow hidden
  .paycontent{
    position absolute
    left 0px;
    right 0px;
    bottom 50px;
    overflow-y scroll
    -webkit-overflow-scrolling touch;
    margin 8px 3% 0px 3%
    .selfborder{
      box-shadow:0px 0px 5px #efefef;
      margin-bottom 10px
      padding 10px
    }
    .orderlist{
      overflow hidden
      .pro-div {
        overflow hidden
        .pro-img {
          margin 10px 10px 0px 0px;
          float left;
          width 80px;
          height 80px;
          img {
            width 100%;
            height 100%;
          }
        }
        .pro-img-1 {
          float left;
          margin 10px;
          width 80px;
          height 80px;
          img {
            width 100%;
            height 100%;
          }
        }
        .pros-num {
          float right
          overflow hidden
          line-height 100px;
          height 100px;
          margin-right 10px;
          font-size $font-size-medium-s
          color $color-text-l
        }
        .pro-info {
          overflow hidden;
          .pro-name {
            margin-top 15px;
            font-size 15px;
            height 36px;
            overflow:hidden;
            text-overflow:ellipsis;
            display:-webkit-box;
            -webkit-box-orient:vertical;
            -webkit-line-clamp:2;
          }
          .pro-size {
            color $color-text-l
          }
          .theme-color {
            color $color-theme-text-d
          }
          .sale-price {
            display inline-block
            margin-left -6px;
            margin-right 5px;
            font-size $font-size-large
          }
          .cost-price {
            color $color-text-l
            text-decoration: line-through;
          }
          .sale-num {
            float right
          }
        }
      }
    }
    .paylist{
      .paytip{
        font-size 15px;
        .moneytip{
          font-size $font-size-medium-s
          .money{
            font-size $font-size-medium
            color  $color-theme-r
          }
        }
      }
      .paymt{
        margin-top 5px
        padding 8px 0px;
        vertical-align middle
        $payImgHeight = 24px
        img{
          width $payImgHeight
          height $payImgHeight
          vertical-align: middle
        }
        span{
          margin-left 10px
          font-size $font-size-medium
          font-weight $font-weight-m
          /*display: inline-block*/
          height $payImgHeight
          line-height $payImgHeight
        }
        .payright{
          float right
          width 19px
          height 19px
        }
      }
    }
    .moneylist{
      .realpay{
        margin-top 5px
        overflow hidden
      }
      .cutpay{
        margin-top 15px
        overflow hidden
      }
    }
    .leftp{
      font-size $font-size-medium
      float left
    }
    .rightp{
      font-size $font-size-medium
      float right
    }
    .small-span {
      font-size $font-size-medium-s;
    }
  }

  .btn-div {
    position absolute
    width 100%;
    bottom 0px;
    height 50px;
    font-size $font-size-medium-x;
    background-color $color-theme-r;
    color white;
    border none;
    outline: none;
  }
}
</style>
