
<template>
  <div class="card-list">
<!-- 左 -->
    <div class="left-div">
      <div class="card" v-for="(item, index) in leftArray" :key="index" @click="productEvent(item)">
        <div v-show="isOpen || index < 1">
          <div class="card-content theme_bg_white">
            <div class="img-div">
              <img v-lazy="item.picMainUrl">
            </div>
            <div class="title theme_font_black double-line" v-html="getSkuNameStr(item)"></div>
            <!-- 微店 -->
            <div class="info-row space-between" v-if="!item.groupFlag">
              <div>
                <span>
                  <span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(item.salePrice)}}</span><span class="price-x theme_font_red">.{{getDecimals(item.salePrice)}}</span>
                </span>
              </div>
              <div>
                <span class="theme_font_red theme_border_red price-x act-item" v-if='item.profit'>
                  <span class="theme_bg_red theme_font_white" style="padding: 0 1px">赚</span>
                  <span>{{item.rewardType == 12 ? '¥':''}}{{item.profit || 0.00}} {{text(item.rewardType)}}</span>
                </span>
              </div>
            </div>
            <!-- 企业采购 -->
            <div class="info-row space-between" v-if="item.groupFlag">
              <div>
                <span>
                  <span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(item.salePriceMin)}}</span><span class="price-x theme_font_red" >.{{getDecimals(item.salePriceMin)}}</span>
                  <span class="price-x theme_font_red">~</span>&nbsp;
                  <span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(item.salePriceMax)}}</span><span class="price-x theme_font_red">.{{getDecimals(item.salePriceMax)}}</span>
                </span>
              </div>
            </div>
            <!-- 微店 -->
            <div class="info-row num-info flex-end" v-if="!item.groupFlag">
              <div class="car-c">
                <i v-if="item.hidden != 1" class="iconfont mall-jia-copy theme_standard_font_i car-size" style="float: right;" @click.stop="addToCart(item)" ></i>
                <i v-else class="icon iconfont mall-dui car-size mallDui" style="float: right; color: #ce8f27" @click.stop="addToCart({})" ></i>
              </div>
            </div>
            <!-- 企业采购 -->
            <div class="info-row num-info space-between" v-if="item.groupFlag">
              <div>
                <span class="theme_font_red theme_border_red price-x act-item" v-if='item.profitMax'>
                   <span class="theme_bg_red theme_font_white" style="padding: 0 1px">赚</span>
                   <span v-if="item.rebateModelEmp == 2">{{item.rewardType == 12 ? '¥':''}}{{item.profitMin || 0.00}} {{text(item.rewardType)}}</span>
                   <span v-else>{{item.rewardType == 12 ? '¥':''}}{{item.profitMin || 0.00}} ~ {{item.profitMax || 0.00}} {{text(item.rewardType)}}</span>
                </span>
              </div>
              <div class="car-c">
                <i v-if="item.hidden != 1" class="iconfont mall-jia-copy theme_standard_font_i car-size" style="float: right;" @click.stop="addToCart(item)" ></i>
                <i v-else class="icon iconfont mall-dui car-size mallDui" style="float: right; color: #ce8f27" @click.stop="addToCart({})" ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
<!-- 右 -->
    <div class="right-div">
      <div class="card" v-for="(item, index) in rightArray" :key="index" @click="productEvent(item)">
        <div v-show="isOpen || index < 1">
          <div class="card-content theme_bg_white">
            <div class="img-div">
              <img v-lazy="item.picMainUrl">
            </div>
            <div class="title theme_font_black double-line" v-html="getSkuNameStr(item)"></div>
            <!-- 微店 -->
            <div class="info-row space-between" v-if="!item.groupFlag">
              <div>
                <span>
                  <span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(item.salePrice)}}</span><span class="price-x theme_font_red">.{{getDecimals(item.salePrice)}}</span>
                </span>
              </div>
              <div>
                <span class="theme_font_red theme_border_red price-x act-item" v-if='item.profit'>
                  <span class="theme_bg_red theme_font_white" style="padding: 0 1px">赚</span>
                  <span>{{item.rewardType == 12 ? '¥':''}}{{item.profit || 0.00}} {{text(item.rewardType)}}</span>
                </span>
              </div>
            </div>
            <!-- 企业采购 -->
            <div class="info-row space-between" v-if="item.groupFlag">
              <div>
                <span>
                  <span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(item.salePriceMin)}}</span><span class="price-x theme_font_red">.{{getDecimals(item.salePriceMin)}}</span>
                  <span class="theme_font_red">~</span>&nbsp;
                  <span class="price-x theme_font_red">￥</span><span class="price-z theme_font_red">{{getInteger(item.salePriceMax)}}</span><span class="price-x theme_font_red">.{{getDecimals(item.salePriceMax)}}</span>
                </span>
              </div>
            </div>
            <!-- 微店 -->
            <div class="info-row num-info flex-end" v-if="!item.groupFlag">
              <!-- <span v-if="item.isRecommend" class="theme_border_red theme_font_red" style="border: 1px solid;border-radius: 12px;padding: 1px 5px;">推荐商品</span> -->
              <div class="car-c">
                <i v-if="item.hidden != 1" class="iconfont mall-jia-copy theme_standard_font_i car-size" style="float: right;" @click.stop="addToCart(item)" ></i>
                <i v-else class="icon iconfont mall-dui car-size mallDui" style="float: right; color: #ce8f27" @click.stop="addToCart({})" ></i>
              </div>
            </div>
            <!-- 企业采购 -->
            <div class="info-row num-info space-between" v-if="item.groupFlag">
              <div>
                <span class="theme_font_red theme_border_red price-x act-item" v-if='item.profitMax'>
                  <span class="theme_bg_red theme_font_white" style="padding: 0 1px">赚</span>
                  <span v-if="item.rebateModelEmp == 2">{{item.rewardType == 12 ? '¥':''}}{{item.profitMin || 0.00}} {{text(item.rewardType)}}</span>
                  <span v-else>{{item.rewardType == 12 ? '¥':''}}{{item.profitMin || 0.00}} ~ {{item.profitMax || 0.00}} {{text(item.rewardType)}}</span>
                </span>
              </div>
              <div class="car-c">
                <i v-if="item.hidden != 1" class="iconfont mall-jia-copy theme_standard_font_i car-size" style="float: right;" @click.stop="addToCart(item)" ></i>
                <i v-else class="icon iconfont mall-dui car-size mallDui" style="float: right; color: #ce8f27" @click.stop="addToCart({})" ></i>
              </div>
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
      text(rewardType) {
        console.log("rewardType", rewardType);
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
        return text;
      },
      getInteger: function (price) {
        let str = this.$util.toDecimal2(price)
        let arr = str.split('.')
        return arr[0]
      },
      getDecimals: function (price) {
        let str = this.$util.toDecimal2(price)
        let arr = str.split('.')
        return arr[1]
      },
      getSkuNameStr: function (item) {
        let skuName = item.skuName
        if (item.interfaceType == '2') {
          skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this.$store.state.globalConfig.interface_type_name_1 || '京东'}</span>` + skuName
        } else if (item.interfaceType == '1') {
          skuName = `<span style="padding: 1px 3px;font-size: 8px;background-color: #ff0000;border-radius: 2px;color: #ffffff;margin-right: 6px;">${this.$store.state.globalConfig.interface_type_name_2 || '有路'}</span>` + skuName
        }
        return skuName
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
  @import "~@/common/stylus/mixin.styl"
  @import "./css/price.styl"
  .card-list {
    padding 0 4px;
    overflow hidden
    /*display flex;
    width 100%;
    flex-wrap : wrap*/
    .space-between {
      display: flex;
      justify-content: space-between;
    }
    .flex-end {
      display: flex;
      justify-content: flex-end;
    }
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
        }
        .info-row {
          font-size $font-size-medium;
          padding 4px 8px;

          .font-small {
            font-size 10px;
          }
        }
        .act-item {
          border-width 0.5px
          border-style solid
        }
        .num-info {
          padding-top 8px;

          .car-c {
            display inline-block;
            vertical-align middle;
            float right;
            margin-top -2px;
            position relative;
            .number {
              position absolute;
              right -8px;
              top -12px;
              font-size 10px;
              padding 2px 5px;
              color white;
              border-radius 15px;
              text-align center;
            }
          }
          .car-size {
            font-size 18px;
            position: relative
            &:after {
              content: ''
              position: absolute
              top: -10px
              left: -10px
              right: -10px
              bottom: -10px
            }
          }
          span:nth-child(2) {
            /*margin-left 10px;*/
          }
          .wish-icon-c {
            extend-click();
            .wish-icon {
              width 20px;
              height 20px;
              border-radius 50%
              &:last-child {
                display none;
              }
            }
            &.is-add-wish {
              .wish-icon {
                display none;
              }
              .wish-icon:last-child {
                display inline-block
              }
            }
          }
        }
      }
    }
    .equal-div {
      display flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .card {
        width 50%;
        padding 4px;
        .card-content {
          height 100%;
          .title {
            height 34px;
          }
          .info-row {
            height 25px;
          }
        }
      }
    }
  }
</style>
