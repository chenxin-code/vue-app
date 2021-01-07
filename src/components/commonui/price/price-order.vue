/**Created by steven on 2019/1/1.*/

<template>

  <div class="price-order">

    <!--product-price-->
    <div class="price-content" v-if="productData">
      <span class="font-small theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(productData.price)}}</span><span class="font-small theme_font_red">.{{getDecimals(productData.price)}}</span><span class="price-z theme_font_red" v-if="productData.digitalPrice && productData.digitalPrice != ''">{{productData.price > 0 ? '+' : ''}}{{productData.digitalPrice}}</span><span class="font-small theme_font_red" v-if="productData.digitalPrice && productData.digitalPrice != ''">{{displayUnit(productData.acctType)}}</span>
      <span class="line-price" v-if="productData.showLinePrice && productData.salePrice">￥{{$util.toDecimal2(productData.salePrice || 0)}}</span>
    </div>


    <!--订单样式-->
    <div class="price-content" v-else-if="orderitem">
      <price-content :priceData="orderData"></price-content>
    </div>

    <!--订单详情单个商品样式-->
    <div class="price-content" v-else-if="orderdetailp">
      <price-content :priceData="orderData"></price-content>
    </div>

    <!--订单商品金额-->
    <div class="price-content" v-else-if="orderdetailallproduct">
      <price-content :priceData="orderData"></price-content>
    </div>

    <!--商品列表样式, 两行显示-->
    <div class="tow-line-div" v-else-if="listitem_Double">
      <!--<p class="price-x theme_bg_black user_level" v-show="listitem_Double.userLevelStr && listitem_Double.userLevelStr != ''">{{listitem_Double.userLevelStr}}</p>-->
      <div style="text-align: center;">
        <price-content :priceData="goodData"></price-content>
      </div>
      <div class="o-price">
        <!--有积分的情况下不显示划线价-->
        <span class="theme_font_tint"  v-if="getIsShowLinePrice(goodData)" :class="[ getGlobalConfig.priceShowType == 2 ? 'line-through' : '222' ,goodData.fontSmallCls]"><span v-if="getGlobalConfig.priceShowType == 1">原价:</span>￥{{$util.toDecimal2(goodData.dpedData.linePrice)}}</span>
      </div>
    </div>

    <!--商品样式  柴总数据-->
    <div class="price-content align-center" v-else>
      <img v-show="getGlobalConfig.priceShowLevelTag != false && goodData.showLevelImg && goodData.userLevelStr && goodData.userLevelStr != ''"  :src="getListImgStr(goodData)" class="levelimg"></img>

      <div class="price-content">
        <price-content :isRMBEnd="isRMBEnd" :priceData="goodData"></price-content>
        <!--有积分的情况下不显示划线价-->
        <span class="theme_font_tint left-m-8"  v-if="getIsShowLinePrice(goodData)" :class="[ getGlobalConfig.priceShowType == 2?'line-through':'',goodData.fontSmallCls]"><span v-if="getGlobalConfig.priceShowType == 1">原价:</span>￥{{$util.toDecimal2(goodData.dpedData.linePrice)}}</span>
      </div>
    </div>

  </div>

</template>

<script>
import priceContent from './price-content'
import market from "../../../utils/market";
import store from "../../../vuex/store";
import util from "../../../utils/util";

export default {
  name: "price-order",
  props:[
    'productData',
    'scanProduct',
    'listitem',
    'detailitem',
    'orderitem',
    'orderdetailp',
    'orderdetailallproduct',
    'listitem_Double',

    // 以下为详情颜色定义
    'detailColor',
    'showLevelImg',

    // rmbEnd == 1 rmb 在后面
    'isRMBEnd'
  ],
  components: {
    priceContent
  },

  computed: {
    goodData() {
      //fontBigCls 大号字体class  fontSmallCls小号字体class  showLevelImg是否显示等级图标    showLinePrice 是否显示划线价
      let goodData = undefined;
      if(this.listitem){
        goodData = this.listitem;
        goodData.fontBigCls = 'price-z';
        goodData.fontSmallCls = 'price-x';
        goodData.showLevelImg = true;
        goodData.showLinePrice = true;

      }else if(this.detailitem){
        goodData = this.detailitem;
        goodData.fontBigCls = 'price-z-b';
        goodData.fontMaxCls = 'price-max-b';
        goodData.fontSmallCls = 'price-x-b';
        goodData.showLevelImg = true;

      }else if(this.scanProduct){
        goodData = this.scanProduct;
        goodData.fontBigCls = 'price-zheng';
        goodData.fontSmallCls = 'price-small';
        goodData.showLinePrice = true;
      } else if(this.listitem_Double){
        goodData = this.listitem_Double;
        goodData.fontBigCls = 'price-z';
        goodData.fontSmallCls = 'price-x';
        goodData.type = 'listdouble';
        goodData.showLinePrice = true;
      }

      if(this.detailColor == 'white'){
        goodData.whiteCls = 'theme_font_white_i';
      }else {
        goodData.whiteCls = '';
      }
      if(goodData){
        //tPrice  统一使用
        goodData.tPrice = goodData.activityPrice;
      }

      return goodData;
    },

    orderData() {
      //fontBigCls 大号字体class  fontSmallCls小号字体class
      let orderData = undefined;
      if(this.orderitem){
        orderData = JSON.parse(JSON.stringify(this.orderitem));
        //tPrice  统一使用
        orderData.tPrice = orderData.payAmount;

        for (let i = 0; i < this.digitalAccountList.length; i++) {
          let tempItem = this.digitalAccountList[i];
          orderData[tempItem.listKey] = orderData[tempItem.orderKey];
        }
      } else if(this.orderdetailp){
        orderData = JSON.parse(JSON.stringify(this.orderdetailp));
        orderData.payAmount = orderData.realPrice;
        this.$mallCommon.dataProcessing(orderData);
        //tPrice  统一使用
        orderData.tPrice = orderData.payAmount;

        for (let i = 0; i < this.digitalAccountList.length; i++) {
          let tempItem = this.digitalAccountList[i];
          orderData[tempItem.listKey] = orderData[tempItem.orderDetailKey];
        }
      } else if(this.orderdetailallproduct){
        orderData = JSON.parse(JSON.stringify(this.orderdetailallproduct));
        orderData.payAmount = orderData.totalAmount;
        this.$mallCommon.dataProcessing(orderData);
        //tPrice  统一使用
        orderData.tPrice = orderData.totalAmount;

        for (let i = 0; i < this.digitalAccountList.length; i++) {
          let tempItem = this.digitalAccountList[i];
          orderData[tempItem.listKey] = orderData[tempItem.orderKey];
        }
      }

      orderData.fontBigCls = 'price-z';
      orderData.fontSmallCls = 'font-small';

      return orderData;
    },
  },
  data () {
    return {
      digitalAccountList: store.state.globalConfig.acctList,
      getGlobalConfig: store.state.globalConfig
    }
  },
  methods: {
    // getGlobalConfig: function () {
    //   return store.state.globalConfig
    // },
    getInteger: function (price) {
      let str = util.toDecimal2(price)
      let arr = str.split('.')
      return arr[0] || '0'
    },
    getDecimals: function (price) {
      let str = util.toDecimal2(price)
      let arr = str.split('.')
      return arr[1] || '00'
    },
    displayUnit: function (acctType) {
      if (this.digitalAccountList && acctType && acctType != undefined && acctType != '') {
        let arr = this.digitalAccountList;
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i]
          if (item.acctType == acctType) {
            return item.displayName
          }
        }
      }
      return '积分'
    },


    getIsShowLinePrice:function(item){
      //划线价如果不存在  则不显示 或者商品已下架status为0
      if(!item.dpedData.linePrice || !item.showLinePrice || item.status == 0){
        return false;
      }
      //如果有 三方支付  则不显示
      for (let i = 0; i < this.digitalAccountList.length; i++) {
        let accitem = this.digitalAccountList[i];
        let points = item[accitem.listKey];
        if(points){
          return false;
        }
      }

      //如果划线价和活动价相同 不显示
      if(item.tPrice >= item.salePrice){
        return false;
      }

      return true;
    },
    getListImgStr:function (item) {
      let level = market.getMemberLevelIndex(item.userLevel);
      return 'static/image/mall2/level/'+ level+'.png'
    }
  },
  created () {
    if (this.productData && this.productData.isGift == 1) {
      this.productData.price = 0
    }
    // console.log(this.productData)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
@import "~@/common/stylus/variable.styl"
@import "./css/price.styl"

.price-order {
  display inline-block
  .price-content{
    display inline
    font-size 0
    line-height 1
  }
  .align-center{
    display flex
    align-items flex-end
  }
  .tow-line-div {
    margin-top 3px;
    text-align center;
    .o-price {
      text-align: center;
      margin: 3px 0px;
    }
    .line-through {
      text-decoration: line-through;
    }
  }


  .user_level{
    white-space nowrap
    color #FEE8AE
    padding 3px 5px
    border-radius 4px
    margin-right 2px
  }
  .levelimg{
    width 43px
    height 13px
  }
  .levelimgbig{
    width 58px
    height 16px
  }
}
</style>
