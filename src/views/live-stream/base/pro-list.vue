/**Created by liaoyingchao on 2020-04-07.*/

<template>
  <div class="pro-list mall2">
    <pop-view v-if="showPop" @closeEvent="popClose">
      <div class="pop-body">
        <p class="pop-title theme_font_black">精选商品</p>
        <div class="pop-scroll-div">
          <div class="pro-row" v-for="product in proList">
            <div class="img-div">
              <img :src="product.phMainUrl">
            </div>
            <div class="info-div">
              <div class="title theme_font_black" v-html="product.skuName"></div>
              <div class="price-row">
                <div class="price theme_standard_font">
                  ¥<span class="big">{{$util.toDecimal2(product.salePrice)}}</span>
                  <span class="line-price">¥{{$util.toDecimal2(product.marketPrice)}}</span>
                </div>
                <div class="qg-btn theme_standard_bg" @click="buyProduct(product)">立即抢购</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </pop-view>
  </div>
</template>

<script>

  export default {
    name: "pro-list",
    props: ['proList'],
    components: {
    },
    data() {
      return {
        showPop: false,
      }
    },
    methods: {
      buyProduct: function (item) {
        this.showPop = false;
        this.$emit('popClose')
        this.$emit('buyProduct', item)
      },
      popClose: function () {
        this.showPop = false;
        this.$emit('popClose')
        // setTimeout(() => {
        //
        // }, 100)
      },
    },
    created() {
      this.showPop = true;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .pro-list {
    overflow hidden
    .pro-row {
      box-shadow 0 1px 8px #efefef;
      .info-div {
        .title {
          height 78px;
        }
        .price-row {
          display flex;
          align-items center;
          justify-content space-between
          .big {
            font-size 16px;
          }
          .line-price {
            margin-left 8px;
            font-size 12px;
            text-decoration: line-through
            color #999;
          }
          .qg-btn {
            font-size 14px;
            color white;
            padding 3px 10px;
            text-align center;
            border-radius 20px;
          }
        }
      }
    }
  }
</style>
