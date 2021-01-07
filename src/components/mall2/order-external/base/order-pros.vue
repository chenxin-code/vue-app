/**Created by liaoyingchao on 2018/11/26.*/

<template>
  <div class="order-pros">
    <div class="order-pro-row" v-for="product in orderItemList" v-if="orderItemList.length == 1">
      <div class="img-div" v-if="type == 'external'">
        <img :src="product.phPictureUrl">
      </div>
      <div class="img-div" @click.stop="enterProductDetail(product)" v-else>
        <img :src="product.phPictureUrl">
      </div>
      <div class="info-div" >
        <div class="title theme_font_black">{{product.skuName}}</div>
        <div class="number theme_font_tint" v-if="product.number > 1">
          <span>购买数量：</span>
          <span> {{product.number}}</span>
        </div>
      </div>
    </div>
    <div class="order-pro-row scroll-style" v-if="orderItemList.length > 1">
      <div class="img-div" v-for="product in orderItemList">
        <img :src="product.phPictureUrl">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "order-pros",
    props: ['orderItemList', 'type'],
    components: {},
    data() {
      return {}
    },
    methods: {
      enterProductDetail:function(product){
        let path = '/mall2/detail/' + this.$util.getDataString()
        this.$router.push({
          path: path,
          query: {
            storeOuCode: product.storeOuCode,
            skuId: product.skuId,
            lastPath: this.$route.path,
            // deliveryType: product.deliverType,
            productType: product.productType
          }
        })
      }
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .order-pros {
    width 100%;
    overflow hidden
    .scroll-style {
      overflow-x: auto;
      overflow-y: hidden;
      white-space:nowrap;
    }
    .order-pro-row {
      width 100%;
      font-size 0px;
      .img-div {
        display inline-block;
        vertical-align middle;
        width 80px;
        height 80px;
        margin-right 8px;
        img {
          display block;
          width 100%;
          height 100%;
        }
      }
      .info-div {
        max-width 250px;
        display inline-block;
        vertical-align middle;
        line-height 22px;
        .title {
          overflow hidden;
          min-height $font-size-medium;
          font-size $font-size-medium;
        }
        .number {
          margin-top 10px;
          min-height $font-size-small;
          font-size $font-size-small;
        }
      }
    }
  }
</style>
