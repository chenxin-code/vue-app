
<template>
  <div class="card-list">
    <div class="left-div">
      <div class="card" v-for="(item, index) in leftArray" :key="index" @click="productEvent(item)">
        <div v-show="isOpen || index < 1">
           {{dataProcessing(item)}}
          <div class="card-content theme_bg_white">
            <div class="img-div">
              <img v-lazy="item.phMainUrl">
            </div>
            <div class="title theme_font_black single-line" v-html="item.skuName"></div>
            <div class="info-row">
              <PriceOrder :listitem="item"></PriceOrder>
            </div>
            <div class="info-row num-info">
              <span class="font-small theme_font_tint">销量：{{item.salesNum != '' ? item.salesNum : '0'}}</span>
              <span class="font-small theme_font_tint">库存：{{item.stockNum != '' ? item.stockNum : '0'}}</span>
              <i v-if="item.hidden != 1" class="iconfont mall-jia-copy theme_standard_font_i car-size" style="float: right;" @click.stop="addToCart(item)" ></i>
              <i v-else class="icon iconfont mall-dui car-size mallDui" style="float: right; color: #ce8f27" @click.stop="addToCart({})" ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-div">
      <div class="card" v-for="(item, index) in rightArray" :key="index" @click="productEvent(item)">
        <div v-show="isOpen || index < 1">
           {{dataProcessing(item)}}
          <div class="card-content theme_bg_white">
            <div class="img-div">
              <img v-lazy="item.phMainUrl">
            </div>
            <div class="title theme_font_black single-line" v-html="item.skuName"></div>
            <div class="info-row">
              <PriceOrder :listitem="item"></PriceOrder>
            </div>
            <div class="info-row num-info">
              <span class="font-small theme_font_tint">销量：{{item.salesNum != '' ? item.salesNum : '0'}}</span>
              <span class="font-small theme_font_tint">库存：{{item.stockNum != '' ? item.stockNum : '0'}}</span>
              <i v-if="item.hidden != 1" class="iconfont mall-jia-copy theme_standard_font_i car-size" style="float: right;" @click.stop="addToCart(item)" ></i>
              <i v-else class="icon iconfont mall-dui car-size mallDui" style="float: right; color: #ce8f27" @click.stop="addToCart({})" ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VueLazyLoad from 'vue-lazyload'
  import PriceOrder from  '@/components/commonui/price/price-order'

  export default {
    name: "card-list",
    props: {
      listData: Array,
      isOpen: {
        type: Boolean,
        default: true // 是否展开所有的
      }
    },
    components: {
      PriceOrder
    },
    data() {
      return {
        leftArray: [],
        rightArray: []
      }
    },
    methods: {
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
          item.showActivities = showActivities;
        }
      },
      productEvent: function (item) {
        this.$emit('productEvent', item)
      },
      addToCart: function (item) {
        this.$emit('addToCart', item)
      },
      initData: function () {
        let rightArr = [];
        let leftArr = [];
        for (let i = 0; i < this.listData.length; i++) {
          let item = this.listData[i]
          this.dataProcessing(item)
          if (i % 2) {
            rightArr.push(item);
          } else {
            leftArr.push(item)
          }
        }
        this.rightArray = rightArr;
        this.leftArray = leftArr;
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
      dataProcessing: function (item) {
        // 数据，尤其是价格，需要做初始化处理
        // 全局价格处理
        let dpedData = this.$mallCommon.priceFromItem(item)
        item.dpedData = dpedData;
      }
    },
    watch: {
      listData: {
        handler: function () {
          this.initData()
        },
        deep: true
      }
    },
    created() {
      this.initData()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped type="text/stylus">
  @import "~@/common/stylus/variable.styl"
  .card-list {
    padding 0 4px;
    overflow hidden
    /*display flex;
    width 100%;
    flex-wrap : wrap*/
    .left-div {
      float left;
      width 50%;
    }
    .right-div {
      overflow hidden
      width 50%;
    }
    .card {
      width 100%;
      padding 4px;
      /*float left;*/
      .card-content {
        padding 0px 0 8px;
        overflow hidden;
        border-radius 6px;
        .img-div {
          position relative;
          width 100%;
          height 0px;
          padding-bottom 100%;
          img {
            position absolute;
            width 100%;
            height 100%;
          }
        }
        .title {
          padding 1px 8px;
          margin 5px 0;
          font-size $font-size-medium;
          line-height 16px;
          height 16px;
        }
        .info-row {
          font-size $font-size-medium;
          padding 4px 8px;

          .font-small {
            font-size 10px;
          }
        }

        .activity {
          display flex;
          align-items center;
          /*padding 0px 0;*/
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
          padding-top 8px;
          .car-size {
            padding 5px;
            margin-top -10px;
            font-size 18px;
          }
          span:nth-child(2) {
            margin-left 10px;
          }
        }
      }
    }
  }
</style>
