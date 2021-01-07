
<template>
  <div class="detail-list">
    <div class="row theme_bg_white" v-for="(item, idx) in listData" :key="idx" @click="productEvent(item)">
      {{dataProcessing(item)}}
      <div class="img-div">
        <img v-lazy="item.phMainUrl">
      </div>
      <div class="info-div" v-if="rowStyle ==1">
        <div class="title theme_font_black double-line" v-html="item.skuName"></div>
        <div class="info-row">
          <PriceOrder :listitem="item"></PriceOrder>
        </div>
        <div class="info-row num-info">
          <span class="font-small theme_font_tint">销量：{{item.salesNum != '' ? item.salesNum : '0'}}</span>
          <span class="font-small theme_font_tint">库存：{{item.stockNum != '' ? item.stockNum : '0'}}</span>
          <i v-if="item.hidden != 1" class="iconfont mall-jia-copy theme_standard_font_i car-size" style="float: right;" @click.stop="addToCart(item)" ></i>
          <i v-else class="icon iconfont mall-dui car-size mallDui theme_standard_font_i" style="float: right;" @click.stop="addToCart({})" ></i>
        </div>
      </div>
      <div class="info-div" v-if="rowStyle ==2">
        <div class="title theme_font_black double-line" v-html="item.skuName"></div>
        <div class="info-row">
          <PriceOrder :listitem="item"></PriceOrder>
        </div>
        <div class="info-row num-info">
          <span class="font-small theme_font_tint">销量：{{item.salesNum != '' ? item.salesNum : '0'}}</span>
          <span class="font-small theme_font_tint">库存：{{item.stockNum != '' ? item.stockNum : '0'}}</span>
          <span class="theme_standard_font_i" style="float: right;" @click='delSku(item.skuId)'>删除</span>
        </div>
      </div>
      <div class="info-div" v-if="rowStyle ==3">
        <div class="title theme_font_black double-line" v-html="item.skuName"></div>
      <div class="info-row">
          <PriceOrder :listitem="item" ></PriceOrder>
        </div>
        <div class="info-row num-info">
          <!-- <span class="font-small theme_font_tint">销量：{{item.salesNum != '' ? item.salesNum : '0'}}</span>
          <span class="font-small theme_font_tint">评价：{{item.commentsNum != '' ? item.commentsNum : '0'}}</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VueLazyLoad from 'vue-lazyload'
  import PriceOrder from  '@/components/commonui/price/price-order'

  export default {
    name: "detail-list",
    props: {
      listData: Array,
      rowStyle: [String,Number]
      // styleObj: Object,
    },
    components: {
      PriceOrder
    },
    data() {
      return {
        // styleObj: {
        //   rowStyle: 1
        // }
        // showActivities: ["团购", "领券", "积分兑换"],
      }
    },
    methods: {
      itemSelect: function (item, idx) {
        item.selected = !item.selected;
        this.listData.splice(idx, 1, item)
        this.$emit('selectedItemEvent', item)
      },
      getShowPrice:function(item){
        if((item.activityPrice == 0 || item.activityPrice == '') && (item.points == '' || !item.points)){
          return false;
        }else {
          return true;
        }
      },
      dataProcessing: function (item) {
        // 数据，尤其是价格，需要做初始化处理
        // 全局价格处理
        let dpedData = this.$mallCommon.priceFromItem(item)
        item.dpedData = dpedData;
        // 展示活动
        let showActivities = [];
        if (item.activityTypes) {
          for (let i = 0; i < item.activityTypes.length; i++) {
            let text = item.activityTypes[i];
            let activityTag = item.activityTags.length > i? item.activityTags[i]:'';
            if (!~showActivities.indexOf(text) && activityTag.indexOf('不显示') == -1) {
              showActivities.push(text)
            }
          }
        }
        item.showActivities = showActivities;
      },
      delSku(skuId) {
        this.$emit('delSku', skuId)
      },
      productEvent: function (item) {
        this.$emit('productEvent', item)
      },
      addToCart: function (item) {
        this.$emit('addToCart', item)
      },
      addshare: function (item) {
        this.$emit('addshare', item)
      },
      addShopping: function (item) {
        this.$emit('addShopping', item)
      },
      deleteShare: function (item) {
        this.$emit('deleteShare', item)
      },
      upperShelf(item){
        this.$emit('upperShelf', item)
      },
      text(rewardType){
        // 3 积分 8 油滴 9 豌豆 12 元
        let text = ''
        if(rewardType == 3){
          text = '积分'
        }else if(rewardType == 8){
          text = '油滴'
        }else if(rewardType == 9){
          text = '豌豆'
        }else if(rewardType == 0){
          text = '元'
        }
        return text
      },
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .detail-list {
    padding 0 8px;
    overflow hidden

    .row {
      margin-top 8px;
      padding 8px;
      overflow hidden;
      border-radius 6px;
      position: relative;

      .edit-btn {
        float left;
        height 120px;
        margin-left -10px;
        padding 50px 10px;
        i {
          font-size 18px;
        }
      }
      .img-div {
        float left;
        position relative;
        width 90px;
        height 90px;
        img {
          width 100%;
          height 100%;
        }
      }
      .info-div {
        padding-left 10px;
        overflow hidden;
        .profitstyle{
          font-size 16px
        }
        .commodity-recommend {
          padding: 2px 6px;
          font-size: 10px;
          border-radius: 10px;
          border-width: 0.8px;
          border-style: solid;
          margin-right: 4px;
        }
        .sharesize{
          font-size 16px
          color #999
        }
        .title {
          padding 1px 0;
          margin 5px 0;
          font-size $font-size-medium;
          line-height 16px;
          height 32px;
        }
        .info-row {
          padding 9px 0 5px;
        }
        .activity {
          display flex;
          align-items center;
          height 22px;
          padding 5px 0 0px;
          .act-item {
            padding 2px 8px;
            font-size 10px;
            border-radius 10px;
            border-width 0.5px
            border-style solid
            margin-right 4px;
          }
        }
        .num-info {
          padding-top 10px;
          .car-size {
            padding 5px;
            margin-top -10px;
            font-size 18px;
          }
        }
      }
      .used {
        position: absolute;
        right: -14px;
        top: 16%;
        transform: translateY(-50%);

        .used-img {
          width: 60px;
        }
      }
    }
  }
</style>
