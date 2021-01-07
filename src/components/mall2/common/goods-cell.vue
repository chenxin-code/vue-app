<template>
  <div>
    <div class="bottom">
      <div class="goods-info">
        <img :src="goodsInfo.phPictureUrl"/>
        <div class="right-good">
          <div class="goods-title theme_font_common"><p>{{goodsInfo.skuName}}</p></div>
          <div class="goods-price theme_font_gray">
<!--            单价：￥{{goodsInfo.salePrice?goodsInfo.salePrice:goodsInfo.price}}&nbsp&nbsp数量：{{goodsInfo.number}}&nbsp&nbsp<span v-if="goodsCount">申请数量：{{goodsCount}}</span>-->
            单价：￥{{goodsInfo.salePrice?goodsInfo.salePrice:goodsInfo.price}}&nbsp&nbsp数量：{{type==1?goodsInfo.payNumber:goodsInfo.number}}&nbsp&nbsp<span v-if="type==1">申请数量：{{goodsInfo.number}}</span><span v-if="type==2">申请数量：{{goodsCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="package-list">
      <div class="bottom" v-for="item in goodsInfo.packageList">
        <div class="goods-info">
          <img :src="item.phPictureUrl"/>
          <div class="right-good">
            <div class="goods-title theme_font_common"><p>{{item.skuName}}</p></div>
            <div class="goods-price theme_font_gray">
              <span v-if="item.salePrice">单价：￥{{item.salePrice}}</span>
              <span v-if="item.number">&nbsp&nbsp数量：{{item.number}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'goodscell',
    components: {},
    props:[
      'goodsInfo',
      'goodsCount',
      'type'
    ],
    data() {
      return {
        msg: 'msg'
      }
    },
    methods: {
      testFunc: function () {
        console.log('testFunc')
      }
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .bottom {
    width 100%
    height 100%
    overflow hidden
    margin-bottom:8px;
    .goods-info{
      display flex
      align-items center
      img{
        width 74px
        height 74px
        /*height 146px*/
      }
      .right-good{
        padding-left 8px;
        .goods-title{
          min-height 30px;
          font-size $font-size-medium-s
          -webkit-line-clamp: 2;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          p{
            line-height 15px
          }
        }
        .goods-price{
          margin-top 10px
          font-size $font-size-small
        }

      }
    }
  }
  .package-list{
    padding-left:30px;
    .goods-info{
      img{
        width 54px;
        height 54px;
      }
      .right-good{
        .goods-title{
          font-size:12px;
        }
      }
    }
  }
</style>
