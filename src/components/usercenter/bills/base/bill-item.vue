/**Created by liaoyingchao on 2019-06-05.*/

<template>
  <div class="bill-item">
    <div class="img-div">
      <img src="../imgs/appjiayou.png" v-if="itemData.bizType == '1'">
      <img src="../imgs/jiayou.png" v-if="itemData.bizType == '2'">
      <img src="../imgs/shangcheng.png" v-if="itemData.bizType == '3'">
      <img src="../imgs/yijie.png" v-if="itemData.bizType == '4'">
      <img src="../imgs/chongzhi.png" v-if="itemData.bizType == '5'">
    </div>
    <div class="info-div">
      <div class="title single-line">{{itemData.bizTypeName}}</div>
      <div class="text single-line">{{nameOfMall}}</div>
      <div class="time theme_font_gray">{{itemData.tradeTime}}</div>
    </div>
    <div class="price">-{{$util.toDecimal2(itemData.amount)}}</div>
  </div>
</template>

<script>
  export default {
    name: "bill-item",
    components: {},
    props: ['itemData'],
    data() {
      return {
        dataAggregation: this.itemData,
        nameOfMall: ''
      }
    },
    methods: {
    },
    created() {
      if (this.dataAggregation.bizTypeName == '商城购物' || this.dataAggregation.bizTypeName == '线下购物') {
        this.nameOfMall = '易捷消费'
      }
      if (this.dataAggregation.bizTypeName == 'App加油' || this.dataAggregation.bizTypeName == '线下加油' || this.dataAggregation.bizTypeName == '加油卡充值') {
        this.nameOfMall = '加油消费'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  .bill-item {
    background-color white;
    overflow hidden
    display flex;
    align-items center;
    padding 8px 15px;

    .img-div {
      img {
        display block;
        width 45px;
        height 45px;
      }
    }

    .info-div {
      flex 1;

      .title {
        padding 4px 10px;
        font-size 14px;
        font-weight 500;
      }

      .text {
        padding 4px 10px;
        font-size 12px;
      }

      .time {
        padding 4px 10px;
        font-size 12px;
      }
    }

    .price {
      font-size 14px;
      font-weight 500;
    }
  }
</style>
