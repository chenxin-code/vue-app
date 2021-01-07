/**Created by liaoyingchao on 2019-04-30.*/

<template>
  <div>
    <div class="title-row">
<!--      // subStatus 1001待改价 1000待确认-->
      <div class="state-text theme_font_red" v-if="stateText=='待确认'">{{itemData.subStatus==1001?"待改价":stateText}}</div>
      <div class="state-text theme_font_red" v-else>{{stateText}}</div>
      <div class="store-name">{{itemData.storeName}}</div>
    </div>
    <div class="order-pro" v-for="item in itemData.purchaseOrderItemList">
      <div class="img-div">
        <img :src="item.skuMainUrl">
      </div>
      <div class="info-div">
        <div class="title double-line theme_font_common">{{item.skuName}}</div>
        <div class="number theme_font_gray">数量：{{item.buyCount}}</div>
        <div class="price theme_font_red">
          <span>¥</span>
          <span class="big">{{getIntStr(item)}}.</span>
          <span>{{getDecimalStr(item)}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "order-pro",
    props: ['itemData', 'stateText'],
    components: {},
    data() {
      return {}
    },
    methods: {
      getIntStr: function (item) {
        let arr = this.$util.toDecimal2(item.purchasePrice).split('.')
        return arr[0]
      },
      getDecimalStr: function (item) {
        let arr = this.$util.toDecimal2(item.purchasePrice).split('.')
        return arr[1]
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .title-row {
    padding-bottom 8px;
    .state-text {
      float right
      font-size 12px;
    }
    .store-name {
      font-size 15px;
      font-weight 500;
    }
  }
  .order-pro {
    margin-top 8px;
    display flex;
    align-items center;
    .img-div {
      width 80px;
      height 80px;
      img {
        display block;
        width 100%;
        height 100%;
      }
    }
    .info-div {
      flex 1;
      padding-left 10px;
      .title {
        font-size 14px;
        line-height 16px;
        height 32px;
      }
      .number {
        margin-top 5px;
        font-size 12px;
      }
      .price {
        margin-top 5px;
        font-size 12px;
        font-weight 500;
        display flex;
        align-items flex-end;

        .big {
          font-size 18px;
        }
      }
    }
  }
</style>
