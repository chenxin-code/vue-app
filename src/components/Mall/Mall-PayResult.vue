/**Created by steven on 2018/6/12.*/
<template>
  <div class="Mall-PayResult">
    <nav-top @backEvent="backEvent" >
    </nav-top>
    <div class="result" :style="{'margin-top': (this.$store.state.barHeight+this.$market.getNavHeight())+ 'px'}">
      <i class="iconResult success" v-if="payResult == 1"></i>
      <i class="iconResult fail" v-if="payResult == 0"></i>
    </div>
    <p class="resultText" v-if="payResult == 1">订单支付成功！</p>
    <p class="resultText" v-if="payResult == 0">订单支付失败！</p>
    <div class="btns">
      <span class="btn btnOne" @click="toOrderList">我的订单</span>
      <span class="btn btnTwo" @click="toBuy">继续购物</span>
    </div>
    <!--<div class="advise">-->
      <!--<p class="hot">热门商品</p>-->
      <!--<LayoutGrid :listData="goods"></LayoutGrid>-->
    <!--</div>-->
  </div>
</template>

<script>
import {Toast } from 'mint-ui'
import LayoutGrid from '../base/layout-grid'

export default {
  name: "Mall-PayResult",
  components: {
    Toast,
    LayoutGrid
  },
  data() {
    return {
      goodsLayout: 'list',
      goods: [
        {
          id: 1,
          proSkuName: 'xx',
          proTypeId: 10,
          proTypeName: '实物商品',
          proCateId: 1,
          proCateName: '服装',
          brandName: 'jd',
          phPicUrl: 'http://xxx',
          costPrice: '400',
          salePrice: '300',
        },
        {
          id: 1,
          proSkuName: 'xx',
          proTypeId: 10,
          proTypeName: '实物商品',
          proCateId: 1,
          proCateName: '服装',
          brandName: 'jd',
          phPicUrl: 'http://xxx',
          costPrice: '400',
          salePrice: '300',
        },
        {
          id: 1,
          proSkuName: 'xx',
          proTypeId: 10,
          proTypeName: '实物商品',
          proCateId: 1,
          proCateName: '服装',
          brandName: 'jd',
          phPicUrl: 'http://xxx',
          costPrice: '400',
          salePrice: '300',
        },
        {
          id: 1,
          proSkuName: 'xx',
          proTypeId: 10,
          proTypeName: '实物商品',
          proCateId: 1,
          proCateName: '服装',
          brandName: 'jd',
          phPicUrl: 'http://xxx',
          costPrice: '400',
          salePrice: '300',
        },
        {
          id: 1,
          proSkuName: 'xx',
          proTypeId: 10,
          proTypeName: '实物商品',
          proCateId: 1,
          proCateName: '服装',
          brandName: 'jd',
          phPicUrl: 'http://xxx',
          costPrice: '400',
          salePrice: '300',
        },
        {
          id: 1,
          proSkuName: 'xx',
          proTypeId: 10,
          proTypeName: '实物商品',
          proCateId: 1,
          proCateName: '服装',
          brandName: 'jd',
          phPicUrl: 'http://xxx',
          costPrice: '400',
          salePrice: '300',
        },
        {
          id: 1,
          proSkuName: 'xx',
          proTypeId: 10,
          proTypeName: '实物商品',
          proCateId: 1,
          proCateName: '服装',
          brandName: 'jd',
          phPicUrl: 'http://xxx',
          costPrice: '400',
          salePrice: '300',
        },
      ],
      payResult: 1
    };
  },
  methods: {
    backEvent: function () {
      this.$bridgefunc.customGo(-1)
    },
    toOrderList: function () {
      this.$bridgefunc.customPush({
        path: '/mallorderlist'
      })
    },
    toBuy: function () {
      this.$bridgefunc.customGo(-3)
    }
  },
  created () {
    this.payResult = this.$route.query.result ? this.$route.query.result : 1
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~@/common/stylus/variable.styl"
.Mall-PayResult {
  position absolute
  top 0px
  bottom 0px
  left 0px
  right 0px
  background-color:$color-background-lll;
  overflow-y scroll
  -webkit-overflow-scrolling touch
  .result{
    text-align:center;
    padding-top:50px;
    .iconResult{
      width:80px;
      height:80px;
      display:inline-block;
      background-position:0px 0px;
      background-size:80px 80px;
      background-repeat:no-repeat;
    }
    .success{
      background-image:url("../../../static/image/mall/Success.png")
    }
    .fail{
      background-image:url("../../../static/image/mall/fail.png")
    }
  }
  .resultText{
    text-align:center;
    font-size:$font-size-large;
    color:$color-text;
    font-weight:500;
  }
  .btns{
    padding-top:20px;
    overflow:hidden;
    padding:20px 3% 10px 3%;
    .btn{
      width:48%;
      height:30px;
      line-height:30px;
      border:1px solid $color-line-gray-l;
      border-radius:15px;
      -webkit-border-radius:15px;
      font-size:$font-size-medium;
      text-align:center;
    }
    .btnOne{
      color:$color-text;
      float:left;
    }
    .btnTwo{
      float:right;
      border-color:#fe6902;
      color:#fe6902;
    }
   }
  .advise{
    width:100%;
    .hot{
      width:100%;
      padding:0px 3%;
      height:40px;
      line-height:40px;
      text-align:center;
      background:#fff;
      font-size:$font-size-medium-x;
      font-weight:500;
    }
  }
}
</style>
