/**Created by liaoyingchao on 2019-04-25.*/

<template>
  <div class="list-component">
    <div class="product" v-for="item in listData" @click="productEvent(item)">
      <div class="block-w">
        <div class="img-div">
          <img :src="item.picMainUrl">
        </div>
        <div class="info-div">
          <p class="title single-line">{{item.showTitle}}</p>
          <div class="price theme_font_red">
            <div class="price-item" v-for="(price, idx) in getPrices(item.purPriceRules)">
              <p class="xian" v-if="idx != 0"> ~ </p>
              <p>¥</p>
              <p class="big">{{price.iNum}}.</p>
              <p>{{price.dNum}}</p>
            </div>
          </div>
          <p class="theme_font_gray">起购数量：{{item.minPurNumber}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import purchase from '../js/index'

  export default {
    name: "list-component",
    props: ['listData'],
    components: {},
    data() {
      return {

      }
    },
    methods: {
      productEvent: function (item) {
        this.$router.push({
          path: '/mall2/purchasedetail',
          query: {
            id: item.id
          }
        })
      },
      getPrices: function (arr) {
        return purchase.getPriceShow(arr)
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .list-component {
    padding 6px;
    display flex;
    flex-wrap: wrap

    .product {
      padding 3px;
      width 50%;

      .block-w {
        width 100%;
        background-color #fff;
        overflow hidden;
        border-radius 6px;

        .img-div {
          position relative;
          width 100%;
          height 0;
          padding-bottom 100%;

          img {
            position absolute;
            top 0;
            right 0;
            width 100%;
            height 100%;
          }
        }
        .info-div {
          padding 5px 8px 10px;
          p {
            padding 3px 0;
          }
          .title {
            font-size 14px;
          }
          .price {
            font-size 10px;
            display flex;
            align-items center
            .price-item {
              display flex;
              align-items flex-end;
              .xian {
                font-size 16px;
                padding 0 2px;
              }
              .big {
                font-size 16px;
              }
            }
          }
        }
      }
    }
  }
</style>
