/**Created by steven on 2018/6/12.*/

<template>
  <div class="Mall-OrderForm">
    <nav-top @backEvent="backEvent" >
    </nav-top>
    <div class="order-form"  :style="{top: (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}">
      <div class="place shadow">
        <div @click="placeEvent">
          <img class="right-arrow" src="../../../static/image/mall/right.png"/>
          <div class="row-div">
            <span class="name">{{ orderPlace.receiverName }}</span>
            <span class="font-medium">{{ orderPlace.mobile }}</span>
          </div>
          <div class="row-div single-line" style="padding-top: 0px;">
            <span class="default" v-if="orderPlace.isDefault == 1">默认</span>
            <span class="font-medium-s">{{ orderPlace.id ? orderPlace.provinceName + orderPlace.cityName + orderPlace.countryName + orderPlace.townName + orderPlace.address : '请选择地址' }}</span>
          </div>
        </div>
        <img class="line-img" src="../../../static/image/mall/bg.png"/>
        <div class="row-div font-medium single-padding">
          <span>支付方式</span>
          <img class="more-img" src="../../../static/image/mall/more.png"/>
          <span class="row-value">在线支付</span>
        </div>
      </div>
      <div class="product shadow">
        <div class="pro-div" v-if="singleProduct">
          <div class="pro-img">
            <img :src="singleProduct.phPictureUrl"/>
          </div>
          <div class="pro-info font-medium-s">
            <p class="pro-name">{{singleProduct.productName}}</p>
            <!--<p class="pro-size">50g</p>-->
            <p style="margin-top: 20px;">
              <span class="theme-color">￥</span>
              <span class="theme-color sale-price">{{$util.toDecimal2(singleProduct.price)}}</span>
              <!--<span class="cost-price">200</span>-->
              <span class="sale-num">x {{selectedNum}}</span>
            </p>
          </div>
        </div>
        <div class="row-div top-padding font-medium" v-if="singleProduct">
          <span>购买数量</span>
          <!--img :class="{'subtractactive':selectedNum>1,'subtractno':selectedNum==1}" @click="addEvent" class="num-btn-img" src="../../../static/image/mall/nu_add.png"/>
          <span class="num">{{selectedNum}}</span>
          <img @click="minusEvent" class="num-btn-img" src="../../../static/image/mall/nu_re.png"/-->

		<div class="quantities">
			<i  :class="{'subtractactive':selectedNum>1,'subtractno':selectedNum==1}" @click="minusEvent"></i>
			<i class="num">{{selectedNum}}</i>
			<i class="add" @click="addEvent"></i>
		</div>


        </div>
        <div class="pro-div" v-if="products.length > 1" @click="productEvent()">
          <div class="pro-img-1" v-for="index in [0, 1]">
            <img :src="products[index].phPictureUrl"/>
          </div>
          <div class="pros-num" v-if="products.length > 1">共{{getPorductsNum()}}件</div>
        </div>
        <div class="row-div font-medium">
          <span>配送</span>
          <img class="more-img" src="../../../static/image/mall/more.png"/>
          <span class="row-value">快递运输</span>
        </div>
      </div>
      <div class="white-div shadow">
        <div class="row-div font-medium">
          <span>发票信息</span>
          <img class="more-img" src="../../../static/image/mall/more.png"/>
          <span class="row-value">暂不支持</span>
        </div>
        <div class="row-div font-medium">
          <span>优惠券</span>
          <img class="more-img" src="../../../static/image/mall/more.png"/>
          <span class="row-value">无可用</span>
        </div>
      </div>
      <div class="white-div shadow">
        <div class="row-div font-medium">
          <span>商品金额</span>
          <span class="row-value" v-if="fromType == 'single'">￥{{getPayPrice()}}</span>
          <span class="row-value" v-if="fromType == 'cart'">￥{{getCartPrice()}}</span>
        </div>
        <div class="row-div font-medium">
          <span>运费</span>
          <span class="row-value theme-color">{{$util.toDecimal2(freightAmount)}}</span>
        </div>
        <div class="row-div font-medium">
          <span>优惠</span>
          <span class="row-value theme-color">0.00</span>
        </div>
      </div>
    </div>
    <div class="bottom-btns">
      <div class="submit" @click="submitEvent">提交订单</div>
      <div class="font-small submit-price">
        <span>￥</span>
        <!--<span class="price-num" v-if="fromType == 'single'">{{getPayPrice()}}</span>-->
        <span class="price-num">{{getTotalPrice()}}</span>
      </div>
    </div>
    <PopPros v-if="showPros" :products="products" @closeEvent="closeEvent"></PopPros>
  </div>
</template>

<script>
  import {Indicator, Toast} from 'mint-ui'
  import BScroll from 'better-scroll'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import {mapGetters} from 'vuex'
  import PopPros from '../base/pop-pros'

  export default {
    name: "Mall-OrderForm",
    components: {
      Indicator,
      Toast,
      BScroll,
      swiper,
      swiperSlide,
      mapGetters,
      PopPros
    },
    computed: {
      ...mapGetters([
        'orderPlace'
      ]),
    },
    data() {
      return {
        placeFormScroll: null,
        scrollY: 0,
        products: [],
        singleProduct: null,
        selectedNum: 0,
        freightAmount: 0,
        fromType: '',
        ordCartIds: [],
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
        //console.log(this.products)
        let num = 0;
        for (let i = 0; i < this.products.length; i++) {
          num += this.products[i].number
        }
        return num
      },
      placeEvent: function () {
        this.$bridgefunc.customPush({
          path: '/malladdress',
          query: {

          }
        })
      },
      getTotalPrice: function () {
        let price = 0
        if (this.fromType == 'single') {
          price = parseFloat(this.getPayPrice()) + this.freightAmount
        } else {
          price = parseFloat(this.getCartPrice()) + this.freightAmount
        }
        return this.$util.toDecimal2(price);
      },
      getPayPrice: function () {
        let price = this.singleProduct.price * this.selectedNum
        return this.$util.toDecimal2(price);
      },
      //增加商品重算运费
	addEvent: function () {
		this.selectedNum ++;
		this.reset_Freight();
		console.log('商品增加');
     },
      minusEvent: function () {
        if (this.selectedNum > 1) {
          this.selectedNum --
		this.reset_Freight();
		console.log('商品减少');
        }
      },
      getCartPrice: function () {
        let price = 0
        if (this.products.length == 1) {
          this.products[0].number = this.selectedNum
        }
        for (let i = 0; i < this.products.length; i++) {
          let item = this.products[i]
          price += item.price * item.number
        }
        return this.$util.toDecimal2(price);
      },
      submitEvent: function () {
        this.$Loading.open()
        let url = '/app/json/order/submit';
        // {token: "c:app:DC5D0B4D9BD543F5B28EE9519E137C13", skuId:888399,number:2,orderType:"200001",ordCartIds:[],userAddressId:"4492",proAmount:"80",totalAmount:"800"}
        let params1 = {}
        if (this.fromType == 'cart') {
          let price = this.getTotalPrice()
          params1 = {
            token: this.$store.state.login.token,
            orderType: '200001',
            skuId: '',
            number: '',
            ordCartIds: this.ordCartIds,
            proAmount: price,
            couponAmount:0,
            totalAmount: price,
            userAddressId: this.orderPlace.id,
            couponList:[],
          };
        } else if (this.fromType == 'single') {
          let price = this.getTotalPrice()
          params1 = {
            token: this.$store.state.login.token,
            orderType: '200001',
            skuId: this.singleProduct.id,
            number: this.selectedNum,
            ordCartIds: [],
            proAmount: price,
            couponAmount:0,
            totalAmount: price,
            userAddressId: this.orderPlace.id,
            couponList:[],
          };
        }
        console.log(params1)
        let _this = this
        this.$http.post(url, params1).then(res => {
          _this.$Loading.close()
          let data = res.data;
          console.log(data);
          if (data.status == 0) {
            if (_this.products.length == 1) {
              let item = _this.products[0]
              item.number = _this.selectedNum
            }
            _this.$store.state._products = _this.products
            _this.$bridgefunc.vuexStorage(function () {
              _this.$bridgefunc.customPush({
                path: '/mallpayorder',
                query: {
                  orderid: data.data.orderId
                }
              })
            })
          } else {
            _this.$Toast(data.info)
          }
        }, error => {
          _this.$Loading.close()
          console.log('获取失败', error);
          _this.$Toast('获取数据失败')
        });
      },
	reset_Freight: function () {
		this.$Loading.open();
		let url = '/app/json/ord_cart/findFreightByAddress';
 		let paramsFindFreightByAddressData = {
			token: this.$store.state.login.token,
			number:this.selectedNum,
			skuId: this.singleProduct.skuId,
			userAddressId: this.orderPlace.id
		};
 		let _this = this;
		this.$http.post(url, paramsFindFreightByAddressData).then(
			res => {
				_this.$Loading.close();
			},
			error => {
				_this.$Loading.close();
				_this.$Toast('计算运费失败');
			}
		);
	},
      backEvent: function () {
        this.$bridgefunc.customGo(-1)
      }
    },
    mounted() {

    },
    created() {
      // let prosStr = this.$route.query.orderdata ? this.$route.query.orderdata : '{}'
      // let proData = JSON.parse(prosStr)
      // console.log(proData)
      // let pros = []
      // for (let key in proData) {
      //   let arr = proData[key]
      //   for (let i = 0; i < arr.length; i++) {
      //     pros.push(arr[i])
      //   }
      // }
      this.ordCartIds = this.$route.query.ordcartids ? JSON.parse(this.$route.query.ordcartids) : []
      this.fromType = this.$route.query.type ? this.$route.query.type : ''
      this.freightAmount = this.$route.query.freightAmount ? this.$route.query.freightAmount : 0
      this.products = this.$store.state._products;
      if (this.products.length == 1) {
        this.singleProduct = this.products[0]
        this.selectedNum = this.singleProduct.number
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .Mall-OrderForm {
    position relative
    width 100%;
    height 100%;
    background-color white
    overflow hidden
    .order-form {
      position absolute
      bottom 50px;
      left 0px;
      right 0px;
      overflow-x hidden;
      overflow-y auto;
      .place {
        position relative;
        margin 0px 10px;
        padding-top 8px;
        background-color white;
        .right-arrow {
          position absolute;
          right 10px;
          top 33px;
          width 12px;
          height 12px;
        }
        .name {
          font-size $font-size-medium-x
        }
        .default {
          display inline-block
          font-size $font-size-small-s
          background-color $color-theme-r
          padding 0px 5px;
          color white;
          border-radius 10px;
        }
        .line-img {
          margin-top 10px;
          display block;
          width 100%;
          height 3px;
        }
      }
      .product {
        position relative;
        margin 10px;
        padding-top 8px;
        background-color white;
        .pro-div {
          overflow hidden;
          .pro-img {
            float left;
            margin 10px;
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
          .pro-info {
            padding-right 10px;
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
        .pros-num {
          float right
          overflow hidden
          line-height 100px;
          height 100px;
          margin-right 10px;
          font-size $font-size-medium-s
          color $color-text-l
        }
        span, img {
          display inline-block;
          vertical-align middle;
        }
        .num-btn-img {
          margin-top -10px;
          padding 10px;
          width 40px;
          height 40px;
          float right;
        }
        .num {
          float right;
          padding 0px 10px;
          margin 0px -10px;
        }
      }
      .white-div {
        margin 10px;
        padding 10px 0px;
        background-color white
      }
      .row-div {
        padding 6px 10px;
      }
      .single-padding {
        padding-top 15px;
        padding-bottom 15px;
      }
      .top-padding {
        padding-top 10px;
      }
      .row-value {
        display inline-block
        float right;
      }
      .more-img {
        padding-left 10px;
        float right;
        width 35px;
        height 25px;
        margin-top: -2px;
      }
    }
    .bottom-btns {
      position fixed;
      left 0px;
      right 0px;
      bottom 0px;
      height 50px;
      line-height 50px;
      border-top 1px solid $color-line-gray-l
      background-color white
      .submit-price {
        padding-left 10px;
        line-height 50px;
        color $color-theme-text-d
        .price-num {
          display inline-block
          margin-left -6px;
          color $color-theme-text-d
          font-size $font-size-large
        }
      }
      .submit {
        float right;
        width 30%;
        height 50px;
        color white
        text-align center;
        font-size $font-size-medium-x;
        background-color $color-theme-r
      }
    }
    .shadow {
      box-shadow:0px 0px 5px #efefef;
    }
  }

.quantities{position: relative;float: right;}
.quantities i{font-style:normal;color:$color-background-l;font-size:$font-size-medium;float:left;}
.quantities .subtractactive{width:24px;height:24px;background:url("../../../static/image/mall/nu_re1.png") 0px 0px no-repeat;background-size:24px 24px;position: absolute;right: 40px;top:-3px;}
.quantities .subtractno{width:24px;height:24px;background:url("../../../static/image/mall/nu_re.png") 0px 0px no-repeat;background-size:24px 24px;position: absolute;right: 40px;top:-3px;}
.quantities .num{line-height:24px;position: absolute;right: 24px;top:-3px}
.quantities .add{width:24px;height:24px;background:url("../../../static/image/mall/nu_add.png") 0px 0px no-repeat;background-size:24px 24px;position: absolute;right: -5px;top:-3px}



</style>
